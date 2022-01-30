import { Root } from "mdast";
import { clone, equals as deepEquals, mergeDeepRight, update } from "ramda";
import {
  createElement,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import styles from "./MarkdownEditor.module.scss";

type Schema = typeof defaultSchema;

/** html のサニタイズ。<code> の class 属性を残す */
const schema = mergeDeepRight<Schema, Schema>(defaultSchema, {
  ancestors: {
    code: ["pre"],
  },
  attributes: {
    // "class" でなく "className" を指定する必要があるので注意
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
  },
}) as Schema;

/** markdown をパースして AST を生成する */
export const parseMarkdown = (() => {
  const parser = unified().use(remarkParse).freeze();
  const transformer = unified().use(remarkGfm).freeze();
  return async (markdown: string) => {
    return await transformer.run(parser.parse(markdown));
  };
})();

/** markdown AST を text に戻す */
export const stringifyMarkdown = (() => {
  const compiler = unified().use(remarkStringify).freeze();
  return (ndast: Root) => {
    return compiler.stringify(ndast);
  };
})();

/** markdown AST を JSX エレメントに変換する */
export const formatMarkdown = (() => {
  const transformer = unified()
    .use(remarkRehype, { allowDangerousHtml: true }) // htmlを残す
    .use(rehypeRaw) // textとして含まれているhtmlをパースし直す
    .use(rehypeSanitize, schema) // 危険なhtmlが含まれないようにサニタイズ
    .freeze();
  const compiler = unified()
    .use(rehypeReact, { createElement, Fragment })
    .freeze();
  return async (fragment: Root) => {
    const resultFragment = await transformer.run(fragment);
    const element = compiler.stringify(resultFragment);
    return element;
  };
})();

/** １つのコンテントだけを抜き出した markdown AST を作る */
function createMarkdownFragment(root: Root, index: number) {
  const clonedRoot = clone(root);
  const content = clonedRoot.children[index];
  const fragment = { ...clonedRoot, children: [content] };
  return fragment;
}

/** markdown text をコンテントに分解する */
async function splitMarkdownContents(contents: string) {
  const root = await parseMarkdown(contents);
  return await Promise.all(
    root.children.map(async (_, index) => {
      const fragment = createMarkdownFragment(root, index);
      return stringifyMarkdown(fragment);
    })
  );
}

function useIsMounted() {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;
    return () => void (ref.current = false);
  }, []);
  return ref;
}

function useStateWithSync<T>(
  defaultState: T,
  equals?: (a: T, b: T) => boolean
) {
  const [state, setState] = useState(defaultState);
  const stateRef = useRef(state);

  const updateState = useCallback(
    (next: T) => {
      if (equals && equals(stateRef.current, next)) return;
      if (!equals && stateRef.current === next) return;
      stateRef.current = next;
      setState(next);
    },
    [equals, stateRef, setState]
  );

  useEffect(() => {
    updateState(defaultState);
  }, [updateState, defaultState]);

  return [state, updateState] as const;
}

export default function MarkdownEditor(props: { content: string }) {
  const { content: defaultContent } = props;
  const defaultMarkdown = useMemo(
    () => ({
      content: defaultContent,
      fragments: [] as string[],
    }),
    [defaultContent]
  );
  const [markdown, setMarkdown] = useStateWithSync(defaultMarkdown, deepEquals);
  const [position, setPosition] = useState(-1);
  const isMounted = useIsMounted();

  // ショートカットで編集を確定する（Ctrl+Enter | Escape）
  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if ((ev.ctrlKey && ev.code === "Enter") || ev.code === "Escape") {
        setPosition(-1);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  // markdown をコンテントに分割する
  useEffect(() => {
    (async () => {
      const fragments = await splitMarkdownContents(markdown.content);
      if (isMounted.current) {
        setMarkdown({ ...markdown, fragments });
      }
    })();
  }, [isMounted, markdown]);

  return (
    <div className={styles.MarkdownEditor}>
      {markdown.fragments.map((fragment, index) => (
        <FragmentPreviewEditor
          key={index}
          content={fragment}
          isSelected={index === position}
          onChanged={(fragment) => {
            const fragments = update(index, fragment, markdown.fragments);
            setMarkdown({
              content: fragments.join("\n"),
              fragments,
            });
          }}
          onSelect={() => setPosition(index)}
        />
      ))}
    </div>
  );
}

function FragmentPreviewEditor(props: {
  content: string;
  isSelected: boolean;
  onChanged: (content: string) => void;
  onSelect: () => void;
}) {
  const { content: defaultContent, isSelected, onChanged, onSelect } = props;
  const [content, setContent] = useStateWithSync(defaultContent);
  const [preview, setPreview] = useState(<Fragment />);
  const isMounted = useIsMounted();

  // プレビューを更新する
  useEffect(() => {
    (async () => {
      const ast = await parseMarkdown(content);
      const preview = await formatMarkdown(ast);
      if (isMounted.current) {
        setPreview(preview);
      }
    })();
  }, [isMounted, content]);

  // 編集結果を反映する
  useEffect(() => {
    if (!isSelected) {
      onChanged(content.endsWith("\n") ? content : content + "\n");
    }
  }, [content, isSelected]);

  return (
    <>
      {isSelected && (
        <div>
          <textarea
            value={content}
            onChange={(ev) => setContent(ev.target.value)}
          />
        </div>
      )}
      <div onClick={() => onSelect()}>{preview}</div>
    </>
  );
}

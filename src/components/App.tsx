import { Root } from "mdast";
import { clone, equals, mergeDeepRight, update } from "ramda";
import { createElement, Fragment, useEffect, useState } from "react";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import styles from "./App.module.scss";

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
  return async (ndast: Root) => {
    return await compiler.stringify(ndast);
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
    const element = await compiler.stringify(resultFragment);
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
      return await stringifyMarkdown(fragment);
    })
  );
}

const block = "```";

const defaultMarkdown = `
# test
a<br/>b
${block}javascript
const a = b + c + d;
${block}
`;

const initialContents: string[] = [];

export default function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [contents, setContents] = useState(initialContents);
  const [position, setPosition] = useState(-1);

  // ショートカットで編集を確定する（Ctrl+Enter | Escape）
  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if ((ev.ctrlKey && ev.code === "Enter") || ev.code === "Escape") {
        setPosition(-1);
        // setMarkdown(contents.join("\n"));
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [contents]);

  // markdown を項目に分割する
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const newContents = await splitMarkdownContents(markdown);
      if (isMounted && !equals(contents, newContents)) {
        setContents(newContents);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [markdown]);

  useEffect(() => {
    if (contents !== initialContents) {
      setMarkdown(contents.join("\n"));
    }
  }, [position, contents]);

  return (
    <div className={styles.App}>
      <h1>Notebook</h1>
      <div>
        {contents.map((content, index) => (
          <ContentEditorPreview
            key={index}
            content={content}
            isSelected={index === position}
            onChanged={(content) => {
              const newContents = update(index, content, contents);
              if (!equals(contents, newContents)) {
                setContents(newContents);
              }
            }}
            onSelect={() => setPosition(index)}
          />
        ))}
      </div>
    </div>
  );
}

function ContentEditorPreview(props: {
  content: string;
  isSelected: boolean;
  onChanged: (content: string) => void;
  onSelect: () => void;
}) {
  const { content, isSelected, onChanged, onSelect } = props;
  const [preview, setPreview] = useState(<Fragment />);

  // プレビューを更新する
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const ast = await parseMarkdown(content);
      const preview = await formatMarkdown(ast);
      if (isMounted) {
        setPreview(preview);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [content]);

  return (
    <>
      {isSelected && (
        <div>
          <textarea
            value={content}
            onChange={(ev) => onChanged(ev.target.value)}
          />
        </div>
      )}
      <div onClick={(ev) => onSelect()}>{preview}</div>
    </>
  );
}

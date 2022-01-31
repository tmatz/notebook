import MarkdownEditor from "~/components/MarkdownEditor";
import { useAppDispatch, useRootSelector } from "~/hooks/store";
import { update } from "~/redux/modules/markdown";
import styles from "./App.module.scss";

export default function App() {
  const dispatch = useAppDispatch();
  const content = useRootSelector((state) => state.markdown.content);
  return (
    <div className={styles.App}>
      <h1>Notebook</h1>
      <MarkdownEditor
        content={content}
        onChange={(content) => {
          dispatch(update(content));
        }}
      />
    </div>
  );
}

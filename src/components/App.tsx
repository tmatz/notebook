import MarkdownEditor from "~/components/MarkdownEditor";
import styles from "./App.module.scss";

const block = "```";

const markdown = `
# test
a<br/>b
${block}javascript
const a = b + c + d;
${block}
`;

export default function App() {
  return (
    <div className={styles.App}>
      <h1>Notebook</h1>
      <MarkdownEditor content={markdown} />
    </div>
  );
}

import { useState } from "react";
import styles from "./App.module.scss";

function App() {
  const [content, setContent] = useState("# test\na<br/>b");
  return (
    <div className={styles.App}>
      <h1>Notebook</h1>
      <div>
        <textarea
          value={content}
          onChange={(ev) => setContent(ev.target.value)}
        />
        <div>preview</div>
      </div>
    </div>
  );
}

export default App;

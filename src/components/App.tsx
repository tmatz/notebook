import { Route, Routes } from "react-router-dom";
import EditMarkdownPage from "~/containers/EditMarkdownPage";
import LoginPage from "~/containers/LoginPage";
import styles from "./App.module.scss";

export default function App() {
  return (
    <div className={styles.App}>
      <h1>Notebook</h1>
      <Routes>
        <Route path="/" element={<EditMarkdownPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

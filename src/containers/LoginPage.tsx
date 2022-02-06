import { useLogin } from "~/hooks/user";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const onClick = useLogin();
  const repoName = "NxGit";
  return (
    <div className={styles.LoginPage}>
      <h1>Login</h1>
      <button onClick={onClick}>
        Login by <span className={styles.repoName}>{repoName}</span>
      </button>
      <h2>or</h2>
      <button onClick={onClick}>Open File</button>
    </div>
  );
}

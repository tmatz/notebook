import { useLogin } from "~/hooks/gitlab";
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
    </div>
  );
}

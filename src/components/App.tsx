import { Route, Routes } from "react-router-dom";
import EditMarkdownPage from "~/containers/EditMarkdownPage";
import LoginPage from "~/containers/LoginPage";
import { useIsLoggedIn, useLogout } from "~/hooks/gitlab";
import OAuthRedirectPage from "../containers/OAuthRedirectPage";
import Page404 from "../containers/Page404";
import styles from "./App.module.scss";

export default function App() {
  return (
    <div className={styles.App}>
      <h1>
        <span>Notebook</span>
        <LogoutButton />
      </h1>
      <Routes>
        <Route path="/" element={<EditMarkdownPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/redirect" element={<OAuthRedirectPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

function LogoutButton() {
  const logout = useLogout();
  const [isLoggedIn, isPending] = useIsLoggedIn();
  if (!isLoggedIn || (isLoggedIn && isPending)) return null;
  return (
    <button
      className={styles.LogoutButton}
      onClick={logout}
      children="Logout"
    />
  );
}

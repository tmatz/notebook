import { useLayoutEffect, useRef, useState } from "react";
import { MdLogout } from "react-icons/md";
import { Route, Routes, useNavigate } from "react-router-dom";
import EditMarkdownPage from "~/containers/EditMarkdownPage";
import LoginPage from "~/containers/LoginPage";
import Page404 from "~/containers/Page404";
import { useAppDispatch, useRootSelector } from "~/hooks/store";
import { useIsLoggedIn, useLogout } from "~/hooks/user";
import { boot, checkLogin } from "~/redux/modules/user";
import styles from "./App.module.scss";

export default function App() {
  const isMounted = useRef(false);
  const [isBooted, setIsBooted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    isMounted.current = true;
    (async () => {
      try {
        if (
          window.location.pathname.startsWith(
            `${import.meta.env.BASE_URL}login/redirect`
          )
        ) {
          await dispatch(checkLogin());
        } else {
          await dispatch(boot());
        }
        navigate("/", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
      if (isMounted.current) {
        setIsBooted(true);
      }
    })();
    return () => {
      isMounted.current = false;
    };
  }, []);
  if (!isBooted) {
    return (
      <div className={styles.App}>
        <h1>
          <span>Notebook</span>
        </h1>
      </div>
    );
  }
  return (
    <div className={styles.App}>
      <h1>
        <span>Notebook</span>
        <span>
          <UserName />
          <LogoutButton />
        </span>
      </h1>
      <Routes>
        <Route path="/" element={<EditMarkdownPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

function UserName() {
  const name = useRootSelector((state) => state.user.user?.name);
  const username = useRootSelector((state) => state.user.user?.username);
  if (!username) return null;
  return (
    <button
      className={styles.UserName}
      onClick={() => {
        window.location.href = `https://nxgit.hallab.co.jp/${username}`;
      }}
    >
      {name}
    </button>
  );
}

function LogoutButton() {
  const logout = useLogout();
  const [isLoggedIn, isPending] = useIsLoggedIn();
  if (!isLoggedIn || (isLoggedIn && isPending)) return null;
  return (
    <button className={styles.LogoutButton} onClick={logout}>
      <MdLogout size="20px" />
    </button>
  );
}

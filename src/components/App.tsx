import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import { Route, Routes } from "react-router-dom";
import EditMarkdownPage from "~/containers/EditMarkdownPage";
import LoginPage from "~/containers/LoginPage";
import Page404 from "~/containers/Page404";
import { useAppNavigate } from "~/hooks/app-navigate";
import { useAppDispatch, useRootSelector } from "~/hooks/store";
import { useIsLoggedIn, useLogout } from "~/hooks/user";
import { boot } from "~/redux/modules/user";
//import styles from "./App.module.scss";

export default function App() {
  const navigate = useAppNavigate();
  const dispatch = useAppDispatch();
  const [isBooted, setIsBooted] = useState(false);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await dispatch(boot());
        navigate.replace("/");
      } catch {
        navigate.replace("/login");
      }
      if (isMounted) {
        setIsBooted(true);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <Flex direction="column" m="10px">
      <Heading size="2xl">
        <Flex justify="space-between">
          <Text>Notebook</Text>
          <Flex>
            <UserName />
            <LogoutButton />
          </Flex>
        </Flex>
      </Heading>
      {isBooted && (
        <Routes>
          <Route path="/" element={<EditMarkdownPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      )}
    </Flex>
  );
}

function UserName() {
  const name = useRootSelector((state) => state.user.user?.name);
  const username = useRootSelector((state) => state.user.user?.username);
  if (!username) return null;
  return (
    <button
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
    <Button bg="transparent" onClick={logout}>
      <MdLogout size="20px" />
    </Button>
  );
}

import { useCallback } from "react";
import { useAppNavigate } from "~/hooks/app-navigate";
import { useAppDispatch, useRootSelector } from "~/hooks/store";
import { login, logout } from "~/redux/modules/user";

export function useIsLoggedIn() {
  const isLoggedIn = useRootSelector((state) => state.user.isLoggedIn);
  const isPending = useRootSelector((state) => state.user.isPending);
  return [isLoggedIn, isPending];
}

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigate();
  return useCallback(
    async (serviceName: string) => {
      if (await dispatch(login(serviceName))) {
        navigate.replace("/");
      }
    },
    [dispatch]
  );
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigate();
  return useCallback(() => {
    dispatch(logout())
      .unwrap()
      .then(() => navigate.replace("/login"));
  }, []);
}

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useRootSelector } from "~/hooks/store";
import { login, logout } from "~/redux/modules/user";

export function useIsLoggedIn() {
  const isLoggedIn = useRootSelector((state) => state.user.isLoggedIn);
  const isPending = useRootSelector((state) => state.user.isPending);
  return [isLoggedIn, isPending];
}

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return useCallback(
    async (serviceName: string) => {
      if (await dispatch(login(serviceName))) {
        navigate("/", { replace: true });
      }
    },
    [dispatch]
  );
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return useCallback(() => {
    dispatch(logout())
      .unwrap()
      .then(() => navigate("/login", { replace: true }));
  }, []);
}

import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useRootSelector } from "~/hooks/store";
import { checkLogin, logout, tryLogin } from "../redux/modules/gitlab";

export function useIsLoggedIn() {
  const isLoggedIn = useRootSelector((state) => state.gitlab.isLoggedIn);
  const isPending = useRootSelector((state) => state.gitlab.isPending);
  return [isLoggedIn, isPending];
}

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return useCallback(async () => {
    await dispatch(tryLogin());
    navigate("/", { replace: true });
  }, [dispatch]);
}

export function useCheckLogin() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkLogin())
      .unwrap()
      .then(() => navigate("/", { replace: true }))
      .catch(() => navigate("/login", { replace: true }));
  }, []);
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

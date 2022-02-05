import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useRootSelector } from "~/hooks/store";
import { checkLogin, logout, tryLogin } from "../redux/modules/gitlab";

export function useIsLoggedIn() {
  const isLoggedIn = useRootSelector((state) => state.gitlab.isLoggedIn);
  const isPending = useRootSelector((state) => state.gitlab.isPending);
  return [isLoggedIn, isPending];
}

export function useLogin() {
  const dispatch = useAppDispatch();
  return useCallback(async () => {
    const url = await dispatch(tryLogin()).unwrap();
    window.location.href = url;
  }, [dispatch]);
}

export function useCheckLogin() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const response = {
      code: searchParams.get("code"),
      state: searchParams.get("state"),
    };
    dispatch(checkLogin(response))
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

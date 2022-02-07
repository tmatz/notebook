import { useMemo } from "react";
import { NavigateOptions, useNavigate } from "react-router-dom";

export function useAppNavigate() {
  const navigate = useNavigate();
  return useMemo(
    () => ({
      to(to: string, options?: NavigateOptions) {
        navigate(to, options);
      },
      replace(to: string, options?: NavigateOptions) {
        navigate(to, { ...options, replace: true });
      },
      back(delta: number) {
        navigate(delta);
      },
    }),
    [navigate]
  );
}

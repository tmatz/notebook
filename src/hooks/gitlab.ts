import { useMemo } from "react";
import { oauth } from "../redux/modules/gitlab";
import { useAppDispatch } from "./store";

export function useGitlabHooks() {
  const dispatch = useAppDispatch();
  return useMemo(
    () => ({
      oauth: () => dispatch(oauth()),
    }),
    [dispatch]
  );
}

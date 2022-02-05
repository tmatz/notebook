import { useCallback } from "react";
import MarkdownEditor from "~/components/MarkdownEditor";
import { useAppDispatch, useRootSelector } from "~/hooks/store";
import * as markdown from "~/redux/modules/markdown";

function useMarkdownContent() {
  return useRootSelector((state) => state.markdown.content);
}

function useUpdateMarkdownContent() {
  const dispatch = useAppDispatch();
  return useCallback(
    (content: string) => {
      dispatch(markdown.update(content));
    },
    [dispatch]
  );
}

export default function EditMarkdownPage() {
  return (
    <MarkdownEditor
      content={useMarkdownContent()}
      onChange={useUpdateMarkdownContent()}
    />
  );
}

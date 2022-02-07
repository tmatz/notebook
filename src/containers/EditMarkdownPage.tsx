import { useEffect } from "react";
import MarkdownEditor from "~/components/MarkdownEditor";
import { useAppNavigate } from "~/hooks/app-navigate";
import { useAppDispatch, useRootSelector } from "~/hooks/store";
import * as markdown from "~/redux/modules/markdown";
import { useIsLoggedIn } from "../hooks/user";

export default function EditMarkdownPage() {
  const [isLoggedIn] = useIsLoggedIn();
  const navigate = useAppNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate.replace("/login");
    }
  }, [isLoggedIn]);
  return isLoggedIn ? <Connect /> : null;
}

function Connect() {
  const dispatch = useAppDispatch();
  const content = useRootSelector((state) => state.markdown.content);
  const onChange = (content: string) => dispatch(markdown.update(content));
  return (
    <div>
      <MarkdownEditor content={content} onChange={onChange} />
    </div>
  );
}

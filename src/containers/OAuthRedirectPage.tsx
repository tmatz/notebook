import { useSearchParams } from "react-router-dom";
import { useCheckLogin } from "../hooks/gitlab";

export default function OAuthRedirectPage() {
  useCheckLogin();
  const [searchParams] = useSearchParams();
  return null;
}

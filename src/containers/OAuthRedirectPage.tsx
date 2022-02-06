import { useSearchParams } from "react-router-dom";
import { useCheckLogin } from "../hooks/user";

export default function OAuthRedirectPage() {
  useCheckLogin();
  const [searchParams] = useSearchParams();
  return null;
}

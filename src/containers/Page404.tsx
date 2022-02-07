import { useEffect } from "react";
import { useAppNavigate } from "~/hooks/app-navigate";

export default function Page404() {
  const navigate = useAppNavigate();
  useEffect(() => {
    const TIMEOUT = 10 * 1000;
    const timeout = setTimeout(() => {
      navigate.replace("/");
    }, TIMEOUT);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div>
      <h1>404</h1>
    </div>
  );
}

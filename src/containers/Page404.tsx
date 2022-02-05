import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Page404() {
  const navigate = useNavigate();
  useEffect(() => {
    const TIMEOUT = 10 * 1000;
    const timeout = setTimeout(() => {
      navigate("/", { replace: true });
    }, TIMEOUT);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div>
      <h1>404</h1>
    </div>
  );
}

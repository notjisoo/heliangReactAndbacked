import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const location = useLocation();

  // 这里用自己的登录状态判断逻辑
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (!isLoggedIn) {
    // 未登录跳转到 /login 并记录来源地址
    return (
      <>
        <Navigate to="/login" state={{ from: location }} replace></Navigate>
      </>
    );
  }

  return <>{children}</>;
}

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div>Home页面</div>
      <button onClick={() => navigate("/about")}>去关于页面</button>
    </>
  );
}

import { useContext } from "react";
import { useParams } from "react-router-dom";

export default function User() {
  const { id } = useParams();

  return (
    <>
      <div>User页面</div>
      <span>{`this is my ` + id}</span>
    </>
  );
}

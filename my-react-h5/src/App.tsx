import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./router";
import { generateRoutes } from "./router/helper";

function App() {
  // 通过钩子函数。可以直接把路由表转成路由结构 无需在定义 routes route link
  const element = useRoutes(generateRoutes(routes));

  // Suspense异步组件
  return (
    <>
      {/* <Suspense fallback={<div>加载中...</div>}>{element}</Suspense>
       */}

      <Suspense>
        <div>{element}</div>
      </Suspense>
    </>
  );
}

export default App;

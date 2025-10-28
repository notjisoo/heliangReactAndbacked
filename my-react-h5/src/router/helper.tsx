import RequireAuth from "../components/RequireAuth";

export function generateRoutes(config: any[]) {
  return config.map((route) => {
    const newRoute: any = {
      path: route.path,
      element: route.auth ? (
        <RequireAuth>{route.element}</RequireAuth>
      ) : (
        route.element
      ),
    };

    // 循环递归
    if (route.children) {
      newRoute.children = generateRoutes(route.children);
    }

    return newRoute;
  });
}

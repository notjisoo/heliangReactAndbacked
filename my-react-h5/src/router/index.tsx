import { lazy } from "react";
import Layout from "@/layout/Layout";

const lazyLoad = (path: string) => {
  return lazy(() => import(/* @vite-ignore */ `../pages/${path}`));
};

const Home = lazyLoad("Home");
const Login = lazyLoad("Login");
const About = lazyLoad("About");
const Profile = lazyLoad("userPage/Profile");
const Settings = lazyLoad("userPage/Setting");

export const routes = [
  {
    path: "",
    element: <Home />,
  }, // index表示默认子路由
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "profile",
        element: <Profile />,
        auth: true,
        meta: {
          title: "用户信息",
          icon: "user",
        },
      },

      {
        path: "settings",
        element: <Settings />,
        auth: true,
        meta: { title: "设置", icon: "setting" },
      },

      {
        path: "/importTable",
        element: <About />,
      },

      {
        path: "/about",
        element: <About />,
      },
    ],
  },

  {
    path: "*",
    element: <h1>404 页面不存在</h1>,
  },
];

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useRegister } from "@/hooks/useRegister";

export default function LoginPage() {
  // 用户名和密码
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const type = submitter?.value;

    if (type === "login") {
      console.log(type);
      loginMutation.mutate({ username, password });
    } else if (type === "register") {
      console.log(username, password);
      registerMutation.mutate({ username, password });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                登录
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="email"
                  placeholder="请输入邮箱"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="请输入密码"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                disabled={loginMutation.isPending}
                type="submit"
                value="login"
                className="w-full"
              >
                {loginMutation.isPending ? "登录中" : "登录"}
              </Button>
              <Button
                value="register"
                disabled={loginMutation.isPending}
                variant="outline"
                className="w-full"
              >
                注册
              </Button>
              {/* {loginMutation.isError && <p>登录失败</p>} */}
            </CardFooter>
          </Card>
        </div>
      </form>
    </>
  );
}

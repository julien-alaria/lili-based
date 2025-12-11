'use client'

import { login as apiLogin } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Ce n'est pas un mail valide"),
  password: z.string(),
});

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "testUser2@mail.com",
      password: "12345678",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => apiLogin(credentials),
    onSuccess: (data) => {
      // data = { accessToken, refreshToken, user }
      const token = data.accessToken;
      const user = data.user;

      // met à jour localStorage + contexte
      authLogin(token);
      localStorage.setItem("role", user.role);

      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "association":
          navigate("/association");
          break;
        case "restaurateur":
          navigate("/restaurateur");
          break;
        default:
          navigate("/");
      }
    },
  });

  const onSubmit = (formData) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isLoading}
            >
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

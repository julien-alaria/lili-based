'use client'

import { signIn } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import * as z from "zod"

const loginSchema = z.object({
  email: z.string().email("Ce n'est pas un mail valide"),
  password: z.string()
})

export default function Login() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "testUser2@mail.com",
      password: "12345678"

    }
  })

  const loginMutation = useMutation({
    mutationFn: async (credentials) => signIn(credentials),

    onSuccess: (data) => {
    // console.log("LOGIN SUCCESS ===>", data);

      const token = data.data.accessToken;
      const user = data.data.user;

      console.log("token :", token);
      console.log("user :", user);

      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", user.role);

      switch (user.role) {
        case "admin":
          window.location = "/admin";
          break;
        case "association":
          window.location = "/association";
          break;
        case "restaurateur":
          window.location = "/restaurateur";
          break;
        default:
          window.location = "/me";
      }
    }
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                required
              />

              {}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


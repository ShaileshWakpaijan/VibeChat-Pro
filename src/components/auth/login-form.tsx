"use client";

import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loginSchema, LoginSchema } from "@/lib/schemas/auth-schema";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ThemeButton from "../ThemeButton";
import { toast } from "sonner";
import { toastStyles } from "@/lib/ToastStyle";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async ({ username, password }: LoginSchema) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    console.log(res);

    if (res?.error) {
      toast.error(<span>{res?.error}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.success(<span>Login successful.</span>, {
      style: toastStyles.success as React.CSSProperties,
    });
    if (!res?.error) return router.push("/chat");
  };

  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (session.status === "authenticated") router.push("/dashboard");
    inputRef.current?.focus();
  }, [session]);

  if (session?.status === "loading") return <h1>Loading...</h1>;
  return (
    <>
      <Card className="w-full max-w-sm mx-2 shadow-md border-[1px] gap-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Login to VibeChat-Pro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className=" flex flex-col gap-4"
              noValidate
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input
                      {...field}
                      type="username"
                      formNoValidate
                      id="username"
                      placeholder="Enter username"
                      ref={inputRef}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={loading} type="submit" className="w-full">
                {loading ? <Loader2 className=" animate-spin" /> : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className=" text-center w-full cursor-pointer">
            Don't have an account?{" "}
            <Link href={"/signup"} className="font-bold">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
      <ThemeButton />
    </>
  );
};

export default LoginForm;

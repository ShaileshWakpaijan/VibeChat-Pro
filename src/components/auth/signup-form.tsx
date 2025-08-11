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
import { signupSchema, SignupSchema } from "@/lib/schemas/auth-schema";
import { useSignup } from "@/hooks/useSignup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toastStyles } from "@/lib/ToastStyle";
import { VerifyOtp } from "./verify-otp";
import ThemeButton from "../ThemeButton";

const SignupForm = () => {
  const router = useRouter();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      cnfPassword: "",
    },
  });

  const handleSignup = async (data: SignupSchema) => {
    setLoading(true);
    const res = await useSignup(data);

    if (!res.success) {
      toast.error(<span>{res.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    setLoading(false);

    toast.success(
      <span>
        We sent an OTP to <strong>{data.email}</strong>. Verify to continue.
      </span>,
      {
        style: toastStyles.success as React.CSSProperties,
      }
    );
    setIsOpen(true);
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
            Sign Up to VibeChat-Pro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className=" flex flex-col gap-4"
              noValidate
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      {...field}
                      type="email"
                      formNoValidate
                      id="email"
                      placeholder="Enter email"
                      ref={inputRef}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                name="cnfPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="cnfPassword">
                      Confirm Password
                    </FormLabel>
                    <Input
                      {...field}
                      id="cnfPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Send OTP
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className=" text-center w-full cursor-pointer">
            Already have an account?{" "}
            <Link href={"/login"} className="font-bold">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
      <VerifyOtp
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        username={form.getValues("username")}
      />
      <ThemeButton />
    </>
  );
};

export default SignupForm;

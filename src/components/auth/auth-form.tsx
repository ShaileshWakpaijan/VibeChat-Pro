import React, { useEffect, useRef } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthSchema } from "@/lib/schemas/auth-schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AuthFormProps } from "@/lib/types/auth";

const AuthForm = ({
  submitHandler,
  pageName,
  redirectMsg,
  redirectPath,
  redirectPage,
}: AuthFormProps) => {
  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Card className="w-full max-w-sm mx-2 shadow-md border-[1px] gap-4">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {pageName} to VibeChat-Pro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
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
                    placeholder="you@example.com"
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
            <Button type="submit" className="w-full">
              {pageName}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className=" text-center w-full cursor-pointer">
          {redirectMsg}{" "}
          <Link href={redirectPath} className="font-bold">
            {redirectPage}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;

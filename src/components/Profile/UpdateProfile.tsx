"use client";

import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toastStyles } from "@/lib/ToastStyle";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  updatePasswordSchema,
  UpdatePasswordSchema,
  UsernameUpdateSchema,
  usernameUpdateSchema,
} from "@/lib/schemas/profile-update";
import useUpdateUsername from "@/hooks/useUpdateUsername";
import useUpdatePassword from "@/hooks/useUpdatePassword";

const UpdateProfile = () => {
  const router = useRouter();
  const session = useSession();
  const usernameUpdateFn = useUpdateUsername();
  const passwordUpdateFn = useUpdatePassword();
  const [loading, setLoading] = useState(false);

  const updateUsernameForm = useForm<UsernameUpdateSchema>({
    resolver: zodResolver(usernameUpdateSchema),
    defaultValues: {
      username: "",
    },
  });

  const updatePasswordForm = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPass: "",
      newPass: "",
      cnfPass: "",
    },
  });

  const handleUsernameChange = async ({ username }: UsernameUpdateSchema) => {
    setLoading(true);
    const res = await usernameUpdateFn(username);

    if (!res.success) {
      toast.error(<span>{res.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    await session.update({ username });
    setLoading(false);
    updateUsernameForm.reset();
    toast.success(<span>{res.message}</span>, {
      style: toastStyles.success as React.CSSProperties,
    });
  };

  const handlePasswordChange = async ({
    oldPass,
    newPass,
  }: UpdatePasswordSchema) => {
    setLoading(true);
    const res = await passwordUpdateFn(oldPass, newPass);

    if (!res.success) {
      toast.error(<span>{res.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    updatePasswordForm.reset();
    toast.success(<span>{res.message}</span>, {
      style: toastStyles.success as React.CSSProperties,
    });
  };

  useEffect(() => {
    if (session.status === "unauthenticated") router.push("/login");
  }, [session]);

  if (session?.status === "loading") return <h1>Loading...</h1>;
  return (
    <div className="relative">
      <Link href={"/chat"} className="fixed top-10 left-5 sm:hidden">
        <ArrowLeft />
      </Link>
      <Tabs defaultValue="username" className="w-90">
        <TabsList className="mx-2">
          <TabsTrigger value="username" disabled={loading}>
            Username
          </TabsTrigger>
          <TabsTrigger value="password" disabled={loading}>
            Password
          </TabsTrigger>
        </TabsList>
        <div className="min-h-96">
          <TabsContent value="username">
            <Card className="w-full max-w-sm shadow-md border gap-4">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Update Username
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...updateUsernameForm}>
                  <form
                    onSubmit={updateUsernameForm.handleSubmit(
                      handleUsernameChange,
                    )}
                    className=" flex flex-col gap-4"
                    noValidate
                  >
                    <FormField
                      name="username"
                      control={updateUsernameForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="username">Username</FormLabel>
                          <Input
                            {...field}
                            type="text"
                            formNoValidate
                            id="username"
                            placeholder="Enter username"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      disabled={
                        !updateUsernameForm.watch("username")?.trim()?.length ||
                        loading
                      }
                      type="submit"
                      className="w-full"
                    >
                      {loading ? (
                        <Loader2 className=" animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card className="w-full max-w-sm shadow-md border gap-4">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Update Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...updatePasswordForm}>
                  <form
                    onSubmit={updatePasswordForm.handleSubmit(
                      handlePasswordChange,
                    )}
                    className=" flex flex-col gap-4"
                    noValidate
                  >
                    <FormField
                      name="oldPass"
                      control={updatePasswordForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="oldPass">Old Password</FormLabel>
                          <Input
                            {...field}
                            type="password"
                            formNoValidate
                            id="oldPass"
                            placeholder="Enter old password"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="newPass"
                      control={updatePasswordForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="newPass">New Password</FormLabel>
                          <Input
                            {...field}
                            id="newPass"
                            type="password"
                            formNoValidate
                            placeholder="••••••••"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="cnfPass"
                      control={updatePasswordForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="cnfPass">
                            Confirm Password
                          </FormLabel>
                          <Input
                            {...field}
                            id="cnfPass"
                            type="password"
                            formNoValidate
                            placeholder="••••••••"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button disabled={loading} type="submit" className="w-full">
                      {loading ? (
                        <Loader2 className=" animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UpdateProfile;

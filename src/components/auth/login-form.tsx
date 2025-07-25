"use client";

import { AuthSchema } from "@/lib/schemas/auth-schema";
import AuthForm from "./auth-form";

const LoginForm = () => {
  const handleLogin = async (data: AuthSchema) => {
    console.log(data);
  };

  return (
    <AuthForm
      pageName="Login"
      redirectPage="Sign Up"
      redirectMsg="Don't have an account?"
      submitHandler={handleLogin}
      redirectPath="/signup"
    />
  );
};

export default LoginForm;

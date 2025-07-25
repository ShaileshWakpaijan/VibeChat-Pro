"use client";

import { AuthSchema } from "@/lib/schemas/auth-schema";
import AuthForm from "./auth-form";

const SignupForm = () => {
  const handleSignup = async (data: AuthSchema) => {
    console.log(data);
  };

  return (
    <AuthForm
      pageName="Sign Up"
      redirectPage="Login"
      redirectMsg="Already have an account?"
      redirectPath="/login"
      submitHandler={handleSignup}
    />
  );
};

export default SignupForm;

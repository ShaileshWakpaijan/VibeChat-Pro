import { AuthSchema } from "../schemas/auth-schema";

export interface AuthCreds {
    email: string;
    password: string;
}

export interface AuthFormProps {
  submitHandler: (data: AuthSchema) => void;
  pageName: string;
  redirectMsg: string;
  redirectPath: string;
  redirectPage: string;
}
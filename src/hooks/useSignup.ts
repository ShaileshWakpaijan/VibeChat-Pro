import Axios from "@/lib/axios";
import { SignupSchema } from "@/lib/schemas/auth-schema";
import { AxiosError, AxiosResponse } from "axios";

export const useSignup = async (data: SignupSchema) => {
  try {
    const res: AxiosResponse = await Axios.post("/auth/signup", data);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log("error while signup user: ", err.response?.data);
    return err.response?.data;
  }
};

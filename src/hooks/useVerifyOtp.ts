import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useVerifyOtp = () => {
  const verifyOtpFunction = async (data: { username: string; otp: string }) => {
    try {
      const res: AxiosResponse = await Axios.post("/auth/verify-otp", data);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while signup user: ", err.response?.data);
      return err.response?.data;
    }
  };
  return verifyOtpFunction;
};
export default useVerifyOtp;

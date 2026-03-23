import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useUpdatePassword = () => {
  const useUpdatePasswordFn = async (
    oldPassword: string,
    newPassword: string,
  ) => {
    try {
      const res: AxiosResponse = await Axios.post(`/profile/update-password`, {
        oldPassword,
        newPassword,
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while updating username: ", err.response?.data);
      return err.response?.data;
    }
  };
  return useUpdatePasswordFn;
};
export default useUpdatePassword;

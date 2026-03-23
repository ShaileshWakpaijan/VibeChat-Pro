import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useUpdateUsername = () => {
  const useUpdateUsernameFn = async (username: string) => {
    try {
      const res: AxiosResponse = await Axios.post(`/profile/update-username`, {
        newUsername: username,
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while updating username: ", err.response?.data);
      return err.response?.data;
    }
  };
  return useUpdateUsernameFn;
};
export default useUpdateUsername;

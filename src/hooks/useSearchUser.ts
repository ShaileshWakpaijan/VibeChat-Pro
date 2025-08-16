import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useSearchUser = () => {
  const searchUser = async (username: string) => {
    try {
      const res: AxiosResponse = await Axios.get(
        `friend/search?username=${username}`
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while signup user: ", err.response?.data);
      return err.response?.data;
    }
  };
  return searchUser;
};
export default useSearchUser;

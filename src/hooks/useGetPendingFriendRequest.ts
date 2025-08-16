import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useGetPendingFriendRequest = () => {
  const pendingFriendRequest = async () => {
    try {
      const res: AxiosResponse = await Axios.get(`friend/request/pending`);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while signup user: ", err.response?.data);
      return err.response?.data;
    }
  };
  return pendingFriendRequest;
};
export default useGetPendingFriendRequest;

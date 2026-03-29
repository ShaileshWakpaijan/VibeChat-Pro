import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useGetFriendList = () => {
  const getFriendListFn = async () => {
    try {
      const res: AxiosResponse = await Axios.get(`friend/get-friends`);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log(err);
      console.log("error while getting friend list: ", err.response?.data);
      return err.response?.data;
    }
  };
  return getFriendListFn;
};
export default useGetFriendList;

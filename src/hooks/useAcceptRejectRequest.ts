import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useAcceptRejectRequest = () => {
  const acceptRequestFn = async (sender: string) => {
    try {
      const res: AxiosResponse = await Axios.post("/friend/request/accept", {
        sender,
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while accepting friend request: ", err.response?.data);
      return err.response?.data;
    }
  };

  const rejectRequestFn = async (sender: string) => {
    try {
      const res: AxiosResponse = await Axios.post("/friend/request/reject", {
        sender,
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while rejecting friend request: ", err.response?.data);
      return err.response?.data;
    }
  };

  return { acceptRequestFn, rejectRequestFn };
};
export default useAcceptRejectRequest;

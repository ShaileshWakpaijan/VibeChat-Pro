import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useSendCancelRequest = () => {
  const sendRequestFn = async (id: string) => {
    try {
      const res: AxiosResponse = await Axios.post("/friend/request/send", {
        receiver: id,
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while sending friend request: ", err.response?.data);
      return err.response?.data;
    }
  };

  const cancelRequestFn = async (id: string) => {
    try {
      const res: AxiosResponse = await Axios.post("/friend/request/cancel", {
        receiver: id,
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while sending friend request: ", err.response?.data);
      return err.response?.data;
    }
  };
  return { sendRequestFn, cancelRequestFn };
};
export default useSendCancelRequest;

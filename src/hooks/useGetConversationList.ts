import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useGetConversationList = () => {
  const getConversationList = async () => {
    try {
      const res: AxiosResponse = await Axios.get(`/chat/conversation`);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while getting conversation list: ", err.response?.data);
      return err.response?.data;
    }
  };
  return getConversationList;
};
export default useGetConversationList;

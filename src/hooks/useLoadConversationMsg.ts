import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useLoadConversationMsg = () => {
  const loadConversationMsg = async (conversationId: string) => {
    try {
      const res: AxiosResponse = await Axios.get(`/chat/conversation/${conversationId}`);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while getting conversation messages: ", err.response?.data);
      return err.response?.data;
    }
  };
  return loadConversationMsg;
};
export default useLoadConversationMsg;

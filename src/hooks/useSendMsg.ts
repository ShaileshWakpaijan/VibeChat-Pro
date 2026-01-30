import Axios from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

const useSendMsg = () => {
  const sendMsgFn = async (conversationId: string, content: string) => {
    try {
      const res: AxiosResponse = await Axios.post(
        `/chat/message/${conversationId}`,
        {
          content,
        },
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while sending message: ", err.response?.data);
      return err.response?.data;
    }
  };
  return sendMsgFn;
};
export default useSendMsg;

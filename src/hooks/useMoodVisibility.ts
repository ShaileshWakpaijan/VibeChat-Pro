import Axios from "@/lib/axios";
import { MoodVisibilityResponse } from "@/lib/types/serverResponse";
import { AxiosError, AxiosResponse } from "axios";

const useMoodVisibility = () => {
  const getMoodVisibility = async () => {
    try {
      const res: AxiosResponse = await Axios.get(`profile/mood-visibility`);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while getting mood visibility: ", err.response?.data);
      return err.response?.data;
    }
  };

  const updateMoodVisibility = async (payload: MoodVisibilityResponse) => {
    try {
      const res: AxiosResponse = await Axios.post(
        `profile/mood-visibility`,
        payload,
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while updating mood visibility: ", err.response?.data);
      return err.response?.data;
    }
  };

  const updateShowMyMood = async (updateUserId: string) => {
    try {
      const res: AxiosResponse = await Axios.post(
        `profile/mood-visibility/${updateUserId}`,
        {},
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while updating show my mood: ", err.response?.data);
      return err.response?.data;
    }
  };
  return { getMoodVisibility, updateMoodVisibility, updateShowMyMood };
};
export default useMoodVisibility;

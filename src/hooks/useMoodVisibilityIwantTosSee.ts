import Axios from "@/lib/axios";
import { MoodVisibilityResponse } from "@/lib/types/serverResponse";
import { AxiosError, AxiosResponse } from "axios";

const useMoodVisibilityIwantTosSee = () => {
  const getMoodVisibilityIwantTosee = async () => {
    try {
      const res: AxiosResponse = await Axios.get(
        `profile/mood-visibility-i-want-to-see`,
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log(
        "error while getting mood visibility i want to see: ",
        err.response?.data,
      );
      return err.response?.data;
    }
  };

  const updateMoodVisibilityIwantToSee = async (
    payload: MoodVisibilityResponse,
  ) => {
    try {
      const res: AxiosResponse = await Axios.post(
        `profile/mood-visibility-i-want-to-see`,
        payload,
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log(
        "error while updating mood visibility i want to see: ",
        err.response?.data,
      );
      return err.response?.data;
    }
  };

  const updateSeeHisMood = async (updateUserId: string) => {
    try {
      const res: AxiosResponse = await Axios.post(
        `profile/mood-visibility-i-want-to-see/${updateUserId}`,
        {},
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      console.log("error while updating see his mood: ", err.response?.data);
      return err.response?.data;
    }
  };
  return {
    getMoodVisibilityIwantTosee,
    updateMoodVisibilityIwantToSee,
    updateSeeHisMood,
  };
};
export default useMoodVisibilityIwantTosSee;

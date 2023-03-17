import { DateTime } from "luxon";
import api from "./api";
import { AuthProps, Events, Trips } from "./serverTypes";
import { AxiosError, AxiosResponse } from "axios";

export const getToken = async (): Promise<AxiosResponse<AuthProps>> => {
  try {
    const URL = "/login?email=viasulpbi@gmail.com&password=Viapbi@900";

    const { data } = await api.post(URL);
    return data;
  } catch (err) {
    const { error } = (err as AxiosError<any, any>)?.response?.data;
    throw new Error(error);
  }
};

export const getEvents = async (): Promise<AxiosResponse<Events>> => {
  try {
    const URL = "/events-schema?per_page=1000";

    const { data } = await api.get(URL);
    return data;
  } catch (err) {
    const { error } = (err as AxiosError<any, any>)?.response?.data;
    throw new Error(error);
  }
};

export const getTrips = async (
  nextPage = ""
): Promise<AxiosResponse<Trips>> => {
  try {
    const date_consult = DateTime.now()
      .minus({ days: 1 })
      .toFormat("yyyy-MM-dd");

    const URL = `/trips?per_page=100&date=${date_consult}${nextPage}`;

    const { data } = await api.get(URL);
    return data;
  } catch (err) {
    const { error } = (err as AxiosError<any, any>)?.response?.data;
    throw new Error(error);
  }
};

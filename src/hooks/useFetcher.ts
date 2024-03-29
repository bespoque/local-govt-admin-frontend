import useSWR from "swr";
import api from "api";
import {useAppSelector} from "store";
import {handleApiError} from "helpers/errors";

const fetcher = async <T>(url: string) => {
  try {
    const {data} = await api.get<T>(url);
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const useFetchData = <T>(url: string, params?: Record<string, any>) => {
  const queryParams = new URLSearchParams();
  const userData = useAppSelector((state) => state.auth);

  if (params) {
    for (const key in params) {
      queryParams.append(key, params[key]);
    }
  }

  const fullUrl = params ? `${url}?${queryParams.toString()}` : url;

  const {data, error, mutate} = useSWR<T>(fullUrl, fetcher, {
    revalidateIfStale: true,
  });

  if (error) {
    handleApiError(error, userData);
  }
  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

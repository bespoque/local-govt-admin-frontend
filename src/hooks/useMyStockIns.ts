import {IStockIn} from "components/stock-in/stock-in.interfaces";
import {handleApiError} from "helpers/errors";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {fetchStockIns} from "slices/actions/stockInActions";
import {loadStockIns} from "slices/stockIn";
import {RootState, useAppSelector} from "store";

export const useMyStockIns = (): {
  stockIns: IStockIn[];
  loading: boolean;
} => {
  const dispatch = useDispatch();
  const stockIns = useAppSelector((state: RootState) => state.stockIn);
  const userData = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userData) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchStockIns();
        dispatch(loadStockIns(response.data));
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, userData]);

  return {stockIns, loading};
};

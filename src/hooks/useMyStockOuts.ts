import {StockOutStatus} from "components/stock-out/stock-out.interfaces";
import {IStockOut} from "components/stock-out/stock-out.interfaces";
import {TaxOfficeEnum} from "components/tax-office/tax-office.interface";
import {handleApiError} from "helpers/errors";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {fetchStockOuts} from "slices/actions/stockOutActions";
import {loadStockOuts} from "slices/stockOut";
import {RootState, useAppSelector} from "store";

interface IFilter {
  toLocation?: TaxOfficeEnum;
  fromLocation?: TaxOfficeEnum;
  status?: StockOutStatus;
}
export const useMyStockOuts = (
  searchFilter?: IFilter
): {stockOuts: IStockOut[]; loading: boolean} => {
  const dispatch = useDispatch();
  const stockOuts = useAppSelector((state: RootState) => state.stockOut);
  const userData = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userData) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const filter = searchFilter || {
          fromLocation: userData?.taxOffice?.name,
        };
        const response = await fetchStockOuts(filter);
        dispatch(loadStockOuts(response.data));
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, userData]);

  return {stockOuts, loading};
};

import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {RootState, useAppSelector} from "store";
import {fetchAllProcurements} from "slices/actions/procurementActions";
import {IProcurement} from "components/procurement/procurement.interface";
import {loadProcurements} from "slices/procurement";
import {handleApiError} from "helpers/errors";

export const useProcurements = (): {
  procurements: IProcurement[];
  loading: boolean;
} => {
  const dispatch = useDispatch();
  const userData = useAppSelector((state: RootState) => state.auth);
  const procurements = useAppSelector((state: RootState) => state.procurements);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userData) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const {data} = await fetchAllProcurements();
        dispatch(loadProcurements(data));
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, userData]);

  return {procurements, loading};
};

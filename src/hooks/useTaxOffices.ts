import {handleApiError} from "helpers/errors";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {fetchTaxOffices} from "slices/actions/userActions";
import {loadTaxOffices} from "slices/tax-offices";
import {RootState, useAppSelector} from "store";

export const useTaxOffices = () => {
  const dispatch = useDispatch();
  const taxOffices = useAppSelector((state: RootState) => state.taxOffice);
  const userData = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userData) return;
    const fetchTaxOfficesData = async () => {
      try {
        setLoading(true);
        const taxOfficesResponse = await fetchTaxOffices();
        dispatch(loadTaxOffices(taxOfficesResponse.data));
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxOfficesData();
  }, [dispatch, userData]);

  return {taxOffices, loading};
};

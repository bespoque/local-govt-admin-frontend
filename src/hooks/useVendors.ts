import {useEffect, useState} from "react";
import {fetchVendors} from "slices/actions/vendorActions";
import {loadVendors} from "slices/vendor";
import {useDispatch} from "react-redux";
import {IVendor} from "components/vendor/vendor.interface";
import {RootState, useAppSelector} from "store";
import {handleApiError} from "helpers/errors";

export const useVendors = (): {
  vendors: IVendor[];
  loading: boolean;
} => {
  const dispatch = useDispatch();
  const userData = useAppSelector((state: RootState) => state.auth);
  const vendors = useAppSelector((state: RootState) => state.vendor);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userData) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const {data} = await fetchVendors();
        dispatch(loadVendors(data));
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, userData]);

  return {vendors, loading};
};

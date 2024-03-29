import {handleApiError} from "helpers/errors";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {fetchRoles} from "slices/actions/rolesActions";
import {loadRoles} from "slices/roles";
import {RootState, useAppSelector} from "store";

export const useRoles = () => {
  const dispatch = useDispatch();
  const userRoles = useAppSelector((state: RootState) => state.roles);
  const userData = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userData) return;

    const fetchRolesData = async () => {
      try {
        setLoading(true);
        const rolesResponse = await fetchRoles();
        dispatch(loadRoles(rolesResponse.data));
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchRolesData();
  }, [dispatch, userData]);

  return {userRoles, loading};
};

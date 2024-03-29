import {useRouter} from "next/router";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {logoutLoggedInUser} from "slices/auth";

const Logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    const logout = async () => {
      dispatch(logoutLoggedInUser());
      router.push("/");
    };

    logout(); // Call the logout function when the component mounts
  }, [router, dispatch]);

  //   Redirect to the home page after logout
  if (typeof window !== "undefined") {
    router.push("/");
  }

  return;
};

export default Logout;

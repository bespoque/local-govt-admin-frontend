import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {isAuthenticated} from "functions/utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isAuthenticated()) {
        // If the user is not authenticated, redirect to the login page
        await router.push("/");
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    // Render a blank page while checking authentication
    return <div></div>;
  }

  return <>{children}</>;
};

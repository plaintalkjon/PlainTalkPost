import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "../../contexts/UserDataContext";
import Loading from "../Loading/Loading";

// Wrapper component that only renders its children when UserData is ready
const UserDataWrapper = ({ 
  children, 
  requireAuth = false,
  requireFollowing = false 
}) => {
  const { user } = useAuth();
  const { userData, loading } = useUserData();

  if (requireAuth && !user) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  if (requireFollowing && (!userData.following || userData.following.length === 0)) {
    return null;
  }

  return children;
};

export default UserDataWrapper;
import { useEffect, useState } from "react";
import { getUserData } from "../https";
import { useDispatch } from "react-redux";
import { removeUser, setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";


const useLoadData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await getUserData();
                const { _id, name, email, phone, role } = data.data;
                dispatch(setUser({ _id, name, email, phone, role })); 
            } catch (error) {
                dispatch(removeUser());
                // Only navigate if we aren't already on the login page
                if (window.location.pathname !== "/auth") {
                    navigate("/auth");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [dispatch, navigate]);

    return isLoading;
};

export default useLoadData; 

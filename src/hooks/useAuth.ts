import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
} from "@/features/auth/authSlice";
import { authService } from "@/services/auth";
import { LoginPayload, RegisterPayload } from "@/types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginPayload) => {
    try {
      dispatch(loginStart());
      const { user, accessToken } = await authService.login(credentials);
      dispatch(loginSuccess({ user, token: accessToken }));
    } catch (error: any) {
      dispatch(
        loginFailure({
          message: error.response?.data?.message || "Login failed",
          status: error.response?.status || 500,
          data: error.response?.data,
        })
      );
      throw error;
    }
  };

  const register = async (data: RegisterPayload) => {
    try {
      dispatch(registerStart());
      const { user, accessToken } = await authService.register({
        username: data.name,
        email: data.email,
        password: data.password,
      });
      dispatch(registerSuccess({ user, token: accessToken }));
    } catch (error: any) {
      dispatch(
        registerFailure({
          message: error.response?.data?.message || "Registration failed",
          status: error.response?.status || 500,
          data: error.response?.data,
        })
      );
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    ...authState,
    login,
    register,
    logout: handleLogout,
    clearError: handleClearError,
  };
};

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "@/api/auth-api";
import * as userApi from "@/api/user-api";
import { clearStoredSession, getStoredToken, getStoredUserId, setStoredSession } from "@/lib/storage";
import { toAppError, type AppError } from "@/lib/http-error";
import type {
  LoginRequest,
  RegisterRequest,
  UserProfileResponse,
} from "@/types/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  profile: UserProfileResponse | null;
  userId: number | null;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [userId, setUserId] = useState<number | null>(() => getStoredUserId());
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    void refreshProfile().finally(() => setIsBootstrapping(false));
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearStoredSession();
      setToken(null);
      setUserId(null);
      setProfile(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  async function refreshProfile(): Promise<void> {
    try {
      const nextProfile = await userApi.getCurrentUser();
      setProfile(nextProfile);
    } catch (error) {
      const appError = toAppError(error);
      if (appError.status === 401) {
        logout();
        return;
      }

      throw appError;
    }
  }

  async function login(request: LoginRequest): Promise<void> {
    try {
      const response = await authApi.login(request);
      setStoredSession(response.accessToken, response.userId);
      setToken(response.accessToken);
      setUserId(response.userId);
      const nextProfile = await userApi.getCurrentUser();
      setProfile(nextProfile);
    } catch (error) {
      throw toAppError(error);
    }
  }

  async function register(request: RegisterRequest): Promise<void> {
    try {
      await authApi.register(request);
    } catch (error) {
      throw toAppError(error);
    }
  }

  function logout(): void {
    clearStoredSession();
    setToken(null);
    setUserId(null);
    setProfile(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      isBootstrapping,
      profile,
      userId,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [isBootstrapping, profile, token, userId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export type { AppError };

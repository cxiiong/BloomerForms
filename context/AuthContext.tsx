"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Minimal user type — only needed for email checks
interface SimpleUser {
  email?: string;
  name?: string | null;
}

interface UserContextType {
  user: SimpleUser | null;
  isLoading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!session?.user?.email) {
      setUser(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setUser({ email: session.user.email, name: session.user.name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchUser();
    } else if (status === "unauthenticated") {
      setUser(null);
      setIsLoading(false);
    }
  }, [session, status]);

  const refetchUser = async () => {
    await fetchUser();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading: isLoading || status === "loading",
        error,
        refetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const { user, isLoading: userLoading, error, refetchUser } = useUser();

  return {
    session,
    user,
    isLoading: status === "loading" || userLoading,
    isAuthenticated: !!session && !!user,
    error,
    refetchUser,
  };
}

interface AuthContextProps {
  children: ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
  return (
    <SessionProvider>
      <UserProvider>{children}</UserProvider>
    </SessionProvider>
  );
}
import {
  createContext,
  useEffect,
  useState,
} from "react";

type UserRole = "ADMIN" | "SOCIO";

type User = {
  email: string;
  role: UserRole;
  socioId?: number;
};

type AuthContextType = {
  user: User | null;

  login: (
    email: string,
    password: string
  ) => User | null;

  logout: () => void;
};

export const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (
    email: string,
    password: string
  ): User | null => {
    let loggedUser: User | null = null;

    if (
      email === "admin@cef.com" &&
      password === "1234"
    ) {
      loggedUser = {
        email,
        role: "ADMIN",
      };
    }

    if (
      email === "usuario@cef.com" &&
      password === "1234"
    ) {
      loggedUser = {
        email,
        role: "SOCIO",
        socioId: 1,
      };
    }

    if (loggedUser) {
      setUser(loggedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(loggedUser)
      );
    }

    return loggedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
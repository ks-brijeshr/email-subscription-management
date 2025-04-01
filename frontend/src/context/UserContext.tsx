import { createContext, useContext, useState } from "react";

interface User {
  name: string;
  email: string;
  is_owner: boolean;
  email_verified_at: string | null;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem("user") || "null"));

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

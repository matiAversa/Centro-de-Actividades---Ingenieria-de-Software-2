import { createContext, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

type UserRole = "ADMIN" | "SOCIO" | "RECEPCIONISTA";

type User = {
	email: string;
	role: UserRole;
	socioId?: number;
};

type AuthContextType = {
	user: User | null;
	login: (email: string, password: string) => Promise<User | null>;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(() => {
		const savedUser = localStorage.getItem("user");

		return savedUser ? JSON.parse(savedUser) : null;
	});

	const login = async (email: string, password: string): Promise<User | null> => {
		try {
			const response = await fetch(`${API_BASE_URL}/User/Login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				const rolNum = await response.text();

				let role: UserRole;
				switch (rolNum) {
					case "1":
						role = "ADMIN";
						break;
					case "2":
						role = "RECEPCIONISTA";
						break;
					case "5":
						role = "SOCIO";
						break;
					default:
						console.error("Rol desconocido:", rolNum);
						return null;
				}

				const loggedUser: User = { email, role };
				setUser(loggedUser);
				localStorage.setItem("user", JSON.stringify(loggedUser));
				return loggedUser;
			} else {
				const error = await response.text();
				console.log(error)
				return null;
			}
		} catch (error) {
			console.error("Error en el login:", error);
			return null;
		}
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

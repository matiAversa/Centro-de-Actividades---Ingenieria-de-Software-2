import { createContext, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

type UserRole = "ADMINISTRADOR" | "RECEPCIONISTA" | "USUARIO";

type User = {
	email: string;
	role: UserRole;
	usuarioId?: number;
};

type LoginResponse = {
	userId: number;
	rol: string;
};

const normalizeRole = (role?: string): UserRole | null => {
	switch (role) {
		case "1":
		case "ADMIN":
		case "ADMINISTRADOR":
		case "ADMINISTRADOS":
			return "ADMINISTRADOR";
		case "2":
		case "RECEPCIONISTA":
			return "RECEPCIONISTA";
		case "3":
		case "USUARIO":
		case "SOCIO":
			return "USUARIO";
		default:
			return null;
	}
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

		if (!savedUser) {
			return null;
		}

		try {
			const parsedUser = JSON.parse(savedUser) as User & {
				role?: string;
				usuarioId?: number;
				socioId?: number;
			};
			const role = normalizeRole(parsedUser.role);

			if (!role) {
				return null;
			}

			return {
				...parsedUser,
				role,
				usuarioId: parsedUser.usuarioId ?? parsedUser.socioId,
			};
		} catch {
			return null;
		}
	});

	const login = async (
		email: string,
		password: string,
	): Promise<User | null> => {
		try {
			const response: Response = await fetch(`${API_BASE_URL}/User/Login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				const data: LoginResponse = await response.json();
				const role = normalizeRole(data.rol);

				if (!role) {
					console.error("Rol desconocido:", data.rol);
					return null;
				}

				const loggedUser: User = { email, role, usuarioId: data.userId };
				setUser(loggedUser);
				localStorage.setItem("user", JSON.stringify(loggedUser));
				return loggedUser;
			} else {
				console.error(
					"Error en las credenciales o el servidor respondió con error",
				);
				return null;
			}
		} catch (error) {
			console.error("Error de red en el login:", error);
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

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Props = {
	children: React.ReactNode;
	allowedRole: "ADMINISTRADOR" | "USUARIO" | "ANY";
};

const isAdminLikeRole = (role: string) =>
	role === "ADMINISTRADOR" || role === "RECEPCIONISTA" || role === "ADMIN";

const isUsuarioLikeRole = (role: string) =>
	role === "USUARIO" || role === "SOCIO";

function ProtectedRoute({ children, allowedRole }: Props) {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (allowedRole === "ANY") {
		return <>{children}</>;
	}

	if (
		user.role !== allowedRole &&
		!(allowedRole === "ADMINISTRADOR" && isAdminLikeRole(user.role)) &&
		!(allowedRole === "USUARIO" && isUsuarioLikeRole(user.role))
	) {
		// If the user is authenticated but not allowed for this route,
		// redirect them to the appropriate default page instead of login.
		const fallback = isAdminLikeRole(user.role) ? "/dashboard" : "/perfil";

		return <Navigate to={fallback} replace />;
	}

	return <>{children}</>;
}

export default ProtectedRoute;

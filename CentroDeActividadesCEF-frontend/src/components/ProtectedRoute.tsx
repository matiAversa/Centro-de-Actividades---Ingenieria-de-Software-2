import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Props = {
	children: React.ReactNode;
	allowedRole: "ADMIN" | "SOCIO";
};

const isAdminLikeRole = (role: string) =>
	role === "ADMIN" || role === "RECEPCIONISTA";

function ProtectedRoute({ children, allowedRole }: Props) {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (
		user.role !== allowedRole &&
		!(allowedRole === "ADMIN" && isAdminLikeRole(user.role))
	) {
		// If the user is authenticated but not allowed for this route,
		// redirect them to the appropriate default page instead of login.
		const fallback = isAdminLikeRole(user.role) ? "/dashboard" : "/perfil";

		return <Navigate to={fallback} replace />;
	}

	return <>{children}</>;
}

export default ProtectedRoute;

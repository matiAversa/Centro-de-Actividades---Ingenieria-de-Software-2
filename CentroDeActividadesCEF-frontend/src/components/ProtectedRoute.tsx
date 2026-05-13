import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Props = {
	children: React.ReactNode;
	allowedRole: "ADMIN" | "SOCIO";
};

function ProtectedRoute({ children, allowedRole }: Props) {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (user.role !== allowedRole) {
		// If the user is authenticated but not allowed for this route,
		// redirect them to the appropriate default page instead of login.
		const fallback = user.role === "ADMIN" ? "/dashboard" : "/perfil";

		return <Navigate to={fallback} replace />;
	}

	return <>{children}</>;
}

export default ProtectedRoute;

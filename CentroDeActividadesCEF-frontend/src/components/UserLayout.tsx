import Navbar from "./Navbar";
import UserSidebar from "./UserSidebar";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/useAuth";

type Props = {
	children: React.ReactNode;
};

function UserLayout({ children }: Props) {
	const { user } = useAuth();

	const isAdmin = user?.role === "ADMIN";

	return (
		<div className="dashboard-container">
			{isAdmin ? <Sidebar /> : <UserSidebar />}

			<div className="main-content">
				<Navbar />
				{children}
			</div>
		</div>
	);
}

export default UserLayout;

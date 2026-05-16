import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type Props = {
	children: React.ReactNode;
};

function Layout({ children }: Props) {
	return (
		<div className="dashboard-container">
			<Sidebar />

			<div className="main-content">
				<Navbar />

				{children}
			</div>
		</div>
	);
}

export default Layout;

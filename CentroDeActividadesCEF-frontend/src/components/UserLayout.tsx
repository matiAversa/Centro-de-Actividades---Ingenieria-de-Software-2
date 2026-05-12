import Navbar from "./Navbar";
import UserSidebar from "./UserSidebar";

type Props = {
  children: React.ReactNode;
};

function UserLayout({
  children,
}: Props) {
  return (
    <div className="dashboard-container">
      <UserSidebar />

      <div className="main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default UserLayout;
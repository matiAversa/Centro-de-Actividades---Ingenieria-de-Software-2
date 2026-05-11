type DashboardCardProps = {
  title: string;
  value: string;
};

const DashboardCard = ({
  title,
  value,
}: DashboardCardProps) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
};

export default DashboardCard;
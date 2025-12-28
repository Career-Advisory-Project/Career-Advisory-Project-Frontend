import "../../assets/styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper min-h-screen p-8">
      <h1 className="dashboard-title text-3xl font-bold mb-4">Dashboard</h1>

      <div className="dashboard-box global-card">
        <p className="text-gray-700">
          If you see a dashed blue box and gradient background, dashboard.css is
          working ✅
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

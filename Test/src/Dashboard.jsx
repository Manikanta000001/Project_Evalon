
const Dashboard = () => {
  // Get the saved user name (you will store it at login/signup)
  const userName = localStorage.getItem("userName") || "User";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome to the Dashboard, {userName}!
      </h1>
    </div>
  );
};

export default Dashboard;

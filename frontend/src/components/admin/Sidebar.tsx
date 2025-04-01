import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 fixed">
      <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
      <nav>
        <ul>
          <li className="mb-2"><Link to="/admin/dashboard">Dashboard</Link></li>
          <li className="mb-2"><Link to="/admin/subscription-lists">Subscription Lists</Link></li>
          <li className="mb-2"><Link to="/admin/subscribers">Subscribers</Link></li>
          <li className="mb-2"><Link to="/admin/blacklist">Blacklist</Link></li>
          <li className="mb-2"><button onClick={handleLogout} className="w-full text-left">Logout</button></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;


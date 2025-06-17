import { useEffect, useState } from "react";
import axios from "../../routes/axiosInstance";
import apiConfig from "../../api-config";
import Sidebar from "../../components/admin/Sidebar";
import { useNavigate } from "react-router-dom";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role?: string;
  pivot?: {
    role: string;
  };
}

const TeamManagement: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ email: "", role: "member" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  let organizationId: number | null = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      organizationId = parsedUser?.organization_id ?? null;
    }
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
  }

  const fetchTeam = async (orgId: number) => {
    try {
      const response = await axios.get(`${apiConfig.apiUrl}/organizations/${orgId}/users`);
      if (response.data.status === "success" && Array.isArray(response.data.members)) {
        setTeam(response.data.members);
      } else {
        setTeam([]);
        console.warn("⚠️ Unexpected team response format:", response.data);
      }
    } catch (error: any) {
      console.error("❌ Error fetching team members:", error?.response?.data?.message || error.message);
      setTeam([]);
    }
  };

  const addMember = async () => {
    if (!organizationId) {
      console.warn("❌ Cannot add member: organizationId not found");
      return;
    }

    try {
      const response = await axios.post(
        `${apiConfig.apiUrl}/organizations/${organizationId}/add-user`,
        newMember
      );
      console.log("✅ Member Added:", response.data);
      setNewMember({ email: "", role: "member" });
      setShowForm(false);
      fetchTeam(organizationId);
    } catch (error: any) {
      console.error("❌ Error adding team member:", error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchTeam(organizationId);
    } else {
      console.warn("❗ organizationId not found. Cannot fetch team.");
    }
  }, [organizationId]);

  return (
    <div className="flex bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 min-h-screen font-sans text-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        } p-4 lg:p-6`}
      >
        <nav className="bg-white shadow-lg rounded-lg px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Open Sidebar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <h1 className="text-xl lg:text-2xl font-bold text-blue-600">Team Management</h1>
          </div>

          <div className="flex items-center space-x-4">
           
            <a
              href="/admin/dashboard"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7a2 2 0 002 2h4a2 2 0 002-2v-7" />
              </svg>
              Back to Dashboard
            </a>
          </div>
        </nav>

        <div className="mt-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-8 border border-gray-200 relative">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">👥 Team Members</h2>

            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
              >
                + Add Member
              </button>
            </div>

            <div className="space-y-4">
              {team.length > 0 ? (
                team.map((member) => (
                  <div
                    key={member.id}
                    className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
                  >
                    <div className="text-lg font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.email}</div>
                    <div className="text-sm text-gray-500">
                      Role: {member.role || member.pivot?.role || "Unknown"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No team members found.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Add New Team Member</h3>

            <input
              type="email"
              placeholder="Email"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />

            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className="w-full mb-4 px-3 py-2 border rounded-lg"
            >
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";

interface UserProfile {
    id: number;
    name: string;
    email: string;
}

const Profile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editableProfile, setEditableProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string>("");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User not authenticated");
                    return;
                }

                const response = await axios.get("http://localhost:8000/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.user) {
                    setProfile(response.data.user);
                    setEditableProfile(response.data.user);
                }
            } catch (err: any) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile.");
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        if (!editableProfile) return;

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            await axios.put(
                "http://localhost:8000/api/profile/update",
                {
                    name: editableProfile.name,
                    email: editableProfile.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            //Update localStorage so Sidebar reflects changes
            localStorage.setItem("user", JSON.stringify(editableProfile));

            setProfile(editableProfile);
            setEditMode(false);
            alert("Profile updated successfully.");
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };


    const handlePasswordUpdate = async () => {
        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        try {
            setPasswordLoading(true);
            const token = localStorage.getItem("token");

            await axios.put(
                "http://localhost:8000/api/profile/update-password",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            alert("Password updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordForm(false);
        } catch (error: any) {
            console.error("Password update failed:", error);
            alert(error.response?.data?.message || "Failed to update password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {isSidebarOpen && (
                <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
            )}

            <main className={`${isSidebarOpen ? "ml-64" : "ml-0"} w-full transition-all duration-300`}>
                <nav className="bg-gray-900 border-b px-6 py-4 flex justify-between items-center shadow-md">
                    <div className="flex items-center space-x-4">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 rounded-md hover:bg-gray-800"
                            >
                                <img src="/options-icon.png" alt="Menu" className="w-8 h-8" />
                            </button>
                        )}
                        <h1 className="text-2xl font-semibold text-white">Admin Profile</h1>
                    </div>
                    <a href="/admin/dashboard" className="text-white transition item-center ml-auto">Dashboard</a>
                </nav>


                {/* Profile Box */}
                <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            Profile Details
                        </h2>
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Profile"
                        >
                            <img src="/edit-icon.svg" alt="Edit" className="w-6 h-6" />
                        </button>

                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {editableProfile ? (
                        <div className="space-y-4 text-gray-700 text-[17px]">
                            <div>
                                <strong className="text-gray-800">ID:</strong> {editableProfile.id}
                            </div>
                            <div>
                                <strong className="text-gray-800">Name:</strong>{" "}
                                {editMode ? (
                                    <input
                                        type="text"
                                        className="border px-2 py-1 rounded w-full mt-1"
                                        value={editableProfile.name}
                                        onChange={(e) =>
                                            setEditableProfile({
                                                ...editableProfile,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    editableProfile.name
                                )}
                            </div>
                            <div>
                                <strong className="text-gray-800">Email:</strong>{" "}
                                {editMode ? (
                                    <input
                                        type="email"
                                        className="border px-2 py-1 rounded w-full mt-1"
                                        value={editableProfile.email}
                                        onChange={(e) =>
                                            setEditableProfile({
                                                ...editableProfile,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    editableProfile.email
                                )}
                            </div>

                            {editMode && (
                                <div className="pt-4">
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-3"
                                        onClick={handleUpdate}
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                        onClick={() => {
                                            setEditableProfile(profile);
                                            setEditMode(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        !error && <p>Loading profile...</p>
                    )}

                    {/* Password Update Section */}
                    <div className="mt-10 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {showPasswordForm ? "Hide" : "Update Password"}
                            </button>
                        </div>

                        {showPasswordForm && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                    <input
                                        type="password"
                                        className="mt-1 block w-full border px-3 py-2 rounded"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        className="mt-1 block w-full border px-3 py-2 rounded"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="mt-1 block w-full border px-3 py-2 rounded"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-3"
                                        onClick={handlePasswordUpdate}
                                        disabled={passwordLoading}
                                    >
                                        {passwordLoading ? "Saving..." : "Save Password"}
                                    </button>
                                    <button
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setCurrentPassword("");
                                            setNewPassword("");
                                            setConfirmPassword("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>

    );
};

export default Profile;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";

const AddSubscriptionList = () => {
    const [name, setName] = useState<string>("");
    
    const [allowBusinessEmailOnly, setAllowBusinessEmailOnly] = useState<boolean>(false);
    const [blockTemporaryEmail, setBlockTemporaryEmail] = useState<boolean>(false);
    const [requireEmailVerification, setRequireEmailVerification] = useState<boolean>(false);
    const [checkDomainExistence, setCheckDomainExistence] = useState<boolean>(false);
    const [verifyDnsRecords, setVerifyDnsRecords] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false); // For loading state

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("No authentication token found. Please log in.");
            navigate("/login");
            return;
        }

        setLoading(true); // Show loading state

        try {
            const response = await axios.post(
                "http://localhost:8000/api/subscription-list/create",
                {
                    name,
                    allow_business_email_only: allowBusinessEmailOnly,
                    block_temporary_email: blockTemporaryEmail,
                    require_email_verification: requireEmailVerification,
                    check_domain_existence: checkDomainExistence,
                    verify_dns_records: verifyDnsRecords,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Subscription List Created Successfully:", response.data);
            alert("Subscription List created successfully!");
            navigate("/admin/dashboard"); // Navigate to the dashboard after creation
        } catch (error: any) {
            console.error("Error creating subscription list:", error.response?.data || error.message);
            alert(`Failed to create subscription list: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div className="flex">
            <Sidebar setIsSidebarOpen={() => { }} />

            <main className="w-full transition-all duration-300 ml-64">
                <nav className="bg-gray-900 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm space-x-4">
                    <div className="flex space-x-80">
                        <h1 className="text-2xl font-semibold text-white">Add Subscription List</h1>
                    </div>
                    <a href="/admin/dashboard" className="text-white transition item-center ml-auto">Dashboard</a>
                </nav>


                {/* Centering the form */}
                <div className="flex justify-center items-center p-6 bg-gray-50 min-h-screen">
                    <div className="w-full max-w-lg bg-gray-200 shadow-md rounded-lg p-6 relative">
                        <button onClick={() => navigate("/admin/dashboard")} className="absolute top-4 left-4">
                            <img src="/back-icon.png" alt="Back" className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Subscription List</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Input */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Subscription List Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border rounded bg-gray-50"
                                    required
                                />
                            </div>

                            {/* Custom Checkbox Design */}
                            <div className="space-y-4">

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="allowBusinessEmailOnly"
                                        checked={allowBusinessEmailOnly}
                                        onChange={() => setAllowBusinessEmailOnly(!allowBusinessEmailOnly)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor="allowBusinessEmailOnly" className="ml-2 text-gray-700">Allow Business Email Only</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="blockTemporaryEmail"
                                        checked={blockTemporaryEmail}
                                        onChange={() => setBlockTemporaryEmail(!blockTemporaryEmail)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor="blockTemporaryEmail" className="ml-2 text-gray-700">Block Temporary Email</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="requireEmailVerification"
                                        checked={requireEmailVerification}
                                        onChange={() => setRequireEmailVerification(!requireEmailVerification)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor="requireEmailVerification" className="ml-2 text-gray-700">Require Email Verification</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="checkDomainExistence"
                                        checked={checkDomainExistence}
                                        onChange={() => setCheckDomainExistence(!checkDomainExistence)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor="checkDomainExistence" className="ml-2 text-gray-700">Check Domain Existence</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="verifyDnsRecords"
                                        checked={verifyDnsRecords}
                                        onChange={() => setVerifyDnsRecords(!verifyDnsRecords)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor="verifyDnsRecords" className="ml-2 text-gray-700">Verify DNS Records</label>
                                </div>
                            </div>

                            {/* Submit Button with Loading State */}
                            <button
                                type="submit"
                                className={`bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 transition ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>Loading...</span>
                                ) : (
                                    "Add Subscription List"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddSubscriptionList;

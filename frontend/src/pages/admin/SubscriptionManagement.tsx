import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { deleteSubscriber } from "../../services/api";

type Props = {
  listId: string;
};

interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  tags?: string[];
}
interface SubscriberTag {
  id: number;
  tag: string;
}
interface TagProps {
  tag: SubscriberTag;
  subscriberId: number;
  onDelete: (tag: string) => void;
}

interface SubscriptionList {
  id: string | null;
  name: string;
  allow_business_email_only: boolean;
  block_temporary_email: boolean;
  require_email_verification: boolean;
  check_domain_existence: boolean;
  verify_dns_records: boolean;
  created_at: string;
}

const SubscriptionManagement = () => {
  const [subscriptionLists, setSubscriptionLists] = useState<
    SubscriptionList[]
  >([]);
  const [listPage, setListPage] = useState<number>(1);
  const [listTotal, setListTotal] = useState<number>(0);
  const [listTotalPages, setListTotalPages] = useState<number>(1);

  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedListName, setSelectedListName] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<
    string | null
  >(null);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalSubscribers, setTotalSubscribers] = useState<number>(0);

  const [emailSearch, setEmailSearch] = useState<string>("");
  const [tagSearch, setTagSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubscriberDetails, setSelectedSubscriberDetails] =
    useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [metadata, setMetadata] = useState<string>("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editSubscriptionList, setEditSubscriptionList] =
    useState<SubscriptionList | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<null | {
    message: string;
    imported: number;
    failed: number;
    errors: any[];
  }>(null);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [currentListName, setCurrentListName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const [totalStats, setTotalStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const [newList, setNewList] = useState<Omit<SubscriptionList, "id">>({
    name: "",
    allow_business_email_only: false,
    block_temporary_email: false,
    require_email_verification: false,
    check_domain_existence: false,
    verify_dns_records: false,
    created_at: "",
  });
  // For example: tagSearch = "2025 2024"
  const filters = {
    email: emailSearch,
    status: statusFilter,
    tag: tagSearch.trim(), // "2025 2024"
  };

  const handleAddSubscriberClick = () => {
    setShowAddSubscriberModal(true);
  };

  const handleCloseModal = () => {
    setShowAddSubscriberModal(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionLists(listPage);
  }, [listPage]);

  const fetchSubscriptionLists = async (currentPage = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:8000/api/subscription-lists",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, per_page: 5 },
        }
      );

      if (response.data.subscription_lists) {
        setSubscriptionLists(response.data.subscription_lists.data);
        setListPage(response.data.subscription_lists.current_page);
        setListTotalPages(response.data.subscription_lists.last_page);
        setListTotal(response.data.subscription_lists.total);
      }
    } catch (error) {
      console.error("Error fetching subscription lists:", error);
    }
  };

  const handleCopyList = async (list: SubscriptionList) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const newListData = {
      name: `${list.name} (Copy)`,
      allow_business_email_only: list.allow_business_email_only,
      block_temporary_email: list.block_temporary_email,
      require_email_verification: list.require_email_verification,
      check_domain_existence: list.check_domain_existence,
      verify_dns_records: list.verify_dns_records,
    };

    try {
      const createListResponse = await axios.post(
        "http://localhost:8000/api/subscription-list/create",
        newListData,
        { headers }
      );

      const newList = createListResponse.data.subscription_list;

      const subscribersResponse = await axios.get(
        `http://localhost:8000/api/subscriptions/${list.id}/subscribers`,
        { headers }
      );

      const subscribers = subscribersResponse.data.subscribers || [];

      for (const subscriber of subscribers) {
        const payload = {
          name: subscriber.name,
          email: subscriber.email,
          metadata: subscriber.metadata,
          status: subscriber.status,
        };

        try {
          await axios.post(
            `http://localhost:8000/api/subscriptions/${newList.id}/subscribers`,
            payload,
            { headers }
          );
        } catch (error) {
          console.error(`Failed to copy subscriber: ${subscriber.email}`, error);
        }
      }

      setSubscriptionLists((prev) => [...prev, newList]);
      alert(`✅ Subscription list and ${subscribers.length} subscribers copied successfully!`);
    } catch (error) {
      console.error("Error copying subscription list or subscribers:", error);
      alert("❌ Failed to copy subscription list or its subscribers.");
    }
  };

  const handleDelete = async (id: string | null) => {
    if (!id) {
      alert("Invalid subscription list ID.");
      return;
    }

    const confirmed = confirm(
      "Are you sure you want to delete this subscription list?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found.");
        return;
      }

      await axios.delete(`http://localhost:8000/api/subscription-lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubscriptionLists((prev) => prev.filter((list) => list.id !== id));
      setListTotal((prevTotal) => prevTotal - 1);

      if (subscriptionLists.length === 1 && listPage > 1) {
        setListPage((prev) => prev - 1);
        fetchSubscriptionLists(listPage - 1);
      } else {
        fetchSubscriptionLists(listPage);
      }
    } catch (error) {
      console.error("Error deleting subscription list:", error);
      alert("Failed to delete subscription list.");
    }
  };

  useEffect(() => {
    if (selectedListId) {
      fetchSubscribers(selectedListId, selectedListName || "", 1);
    }
  }, [selectedListId, emailSearch, tagSearch, statusFilter]);

  const fetchSubscribers = async (
    listId: string,
    listName: string,
    currentPage = 1,
    filtersOverride?: { email?: string; tag?: string; status?: string }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const params = {
        page: currentPage,
        perPage: perPage,
        email: filtersOverride?.email ?? emailSearch,
        tag: filtersOverride?.tag ?? tagSearch,
        status: filtersOverride?.status ?? statusFilter,
      };

      const response = await axios.get(
        `http://localhost:8000/api/subscribers/${listId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      if (response.data?.subscribers) {
        const subscribers = response.data.subscribers;

        setSubscribers(subscribers); // Update the subscribers state
        setSelectedListId(listId);
        setSelectedListName(listName);

        const pagination = response.data.pagination || {};
        setTotalPages(pagination.lastPage || 1);
        setPage(pagination.currentPage || 1);
        setTotalSubscribers(pagination.total || 0);
        if (currentPage === 1) {
          const stats = response.data.stats || {};
          setTotalStats({
            total: stats.total || 0,
            active: stats.active || 0,
            inactive: stats.inactive || 0,
          });
        }

        // Hide pagination if there are no subscribers
        if (subscribers.length === 0) {
          setTotalPages(0);
        }
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };

  const handleEditClick = (list: SubscriptionList) => {
    setEditingListId(list.id);
    setEditSubscriptionList({
      id: list.id,
      name: list.name,
      allow_business_email_only: list.allow_business_email_only,
      block_temporary_email: list.block_temporary_email,
      require_email_verification: list.require_email_verification,
      check_domain_existence: list.check_domain_existence,
      verify_dns_records: list.verify_dns_records,
      created_at: list.created_at,
    });
  };
  const handleCancelEdit = () => {
    setEditingListId(null);
    setEditSubscriptionList(null);
  };

  const handleEditSubmit = async () => {
    if (!editSubscriptionList || !editingListId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("No token");

      await axios.put(
        `http://localhost:8000/api/subscription-lists/${editingListId}`,
        editSubscriptionList,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubscriptionLists((prev) =>
        prev.map((list) =>
          list.id === editingListId ? { ...editSubscriptionList } : list
        )
      );

      handleCancelEdit(); // close modal
    } catch (error) {
      console.error("Error updating subscription list:", error);
      alert("Update failed");
    }
  };

  const handleNameClick = async (subscriberId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/subscriber/${subscriberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success && data.subscriber) {
        setSelectedSubscriberDetails(data.subscriber);
        setIsModalOpen(true);
      } else {
        alert("Subscriber not found!");
      }
    } catch (error) {
      console.error("Error fetching subscriber details:", error);
      alert("Error fetching subscriber details!");
    }
  };

  const updateSubscriberStatus = async (
    subscriberId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await axios.put(
        `http://localhost:8000/api/subscribers/${subscriberId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (selectedListId) {
        fetchSubscribers(selectedListId, selectedListName || "");
      }
    } catch (error) {
      console.error("Error updating subscriber status:", error);
    }
  };
  const handleAddSubmitList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/subscription-list/create",
        newList,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubscriptionLists((prev) => [
        ...prev,
        response.data.subscription_list,
      ]);
      setShowAddForm(false);
      setSuccessMessage("Subscription List added successfully!");
      setNewList({
        name: "",
        allow_business_email_only: false,
        block_temporary_email: false,
        require_email_verification: false,
        check_domain_existence: false,
        verify_dns_records: false,
        created_at: "",
      });
    } catch (error) {
      console.error("Error adding subscription list:", error);
      alert("Failed to add subscription list.");
    }
  };

  const handleAddTag = async () => {
    if (!selectedSubscriberId || !tagInput.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `http://localhost:8000/api/subscribers/${selectedSubscriberId}/tags`,
        { tags: [tagInput] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTagInput("");
      setSelectedSubscriberId(null);

      if (selectedListId) {
        fetchSubscribers(selectedListId, selectedListName || "");
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const exportSubscribers = async (format: "csv" | "json") => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedListId || !selectedListName) return;

      const response = await axios.get(
        `http://localhost:8000/api/subscriptions/${selectedListId}/export/${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
          validateStatus: (status) => status < 500,
        }
      );

      if (response.status === 204) {
        alert("There are no subscribers to export.");
        return;
      }

      if (response.status !== 200) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const error = JSON.parse(reader.result as string);
            alert(error.message || "Failed to export subscribers.");
          } catch {
            alert("Failed to export subscribers.");
          }
        };
        reader.readAsText(response.data);
        return;
      }

      // proceed with download
      const blob = new Blob([response.data], {
        type: format === "csv" ? "text/csv" : "application/json",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${selectedListName}_subscribers.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting subscribers:", error);
      alert("Something went wrong while exporting.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedListId || !email) {
      alert("❗ Please select a subscription list and enter an email.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      // Format metadata
      let formattedMetadata: Record<string, string> = {};
      if (metadata) {
        metadata.split(",").forEach((item) => {
          const [key, value] = item.split(":").map((str) => str.trim());
          if (key && value) {
            formattedMetadata[key] = value;
          }
        });
      }

      const response = await axios.post(
        `http://localhost:8000/api/subscriptions/${selectedListId}/subscribers`,
        { name, email, metadata: formattedMetadata },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Subscriber Added Successfully!");

      // Clear form
      setName("");
      setEmail("");
      setMetadata("");

    } catch (error: any) {
      console.error(
        "Error adding subscriber:",
        error.response?.data || error.message
      );

      if (error.response?.status === 409) {
        alert(`⚠️ The email "${email}" is already subscribed to this list.`);
      } else if (error.response?.status === 422) {
        const errorData = error.response.data;
        if (
          errorData.message ===
          "Email failed validation and has been blacklisted."
        ) {
          alert(
            `🚫 Email failed validation and has been blacklisted.\nReasons:\n- ${errorData.errors?.join(
              "\n- "
            )}`
          );
        } else {
          alert(
            `❌ Validation Error: ${errorData.message || "Invalid input data."}`
          );
        }
      } else if (error.response?.status === 403) {
        alert(
          "❌ Unauthorized: You do not have permission to perform this action."
        );
      } else if (error.response?.status === 404) {
        alert("❌ Subscription list not found. Please try again.");
      } else {
        alert(
          `❌ Failed to add subscriber. Please try again later.\nError: ${error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter((s) => {
    const emailMatch = s.email
      .toLowerCase()
      .includes(emailSearch.toLowerCase());

    const tagKeywords = tagSearch
      .trim()
      .toLowerCase()
      .split(" ")
      .filter(Boolean);
    const tagMatch =
      tagKeywords.length === 0 ||
      tagKeywords.every((keyword) =>
        s.tags?.some((tag) => tag.toLowerCase().includes(keyword))
      );

    const statusMatch = statusFilter === "all" || s.status === statusFilter;

    return emailMatch && tagMatch && statusMatch;
  });

  const handleDeleteSubscriber = async (id: number) => {
    try {
      await deleteSubscriber(id);
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter(
          (subscriber) => subscriber.id.toString() !== id.toString()
        )
      );
    } catch (error) {
      console.error("Failed to delete subscriber", error);
    }
  };

  const handleCheckboxToggle = (id: string) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete selected subscribers?"
    );
    if (!confirmed || selectedSubscribers.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/subscribers/bulk-delete",
        { ids: selectedSubscribers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Selected subscribers deleted successfully.");
      setSelectedSubscribers([]);
      fetchSubscribers(selectedListId!, selectedListName!, page);
    } catch (error) {
      console.error("Bulk delete failed", error);
      alert("Failed to delete selected subscribers.");
    }
  };

  const handleDeleteTag = async (
    subscriberId: number,
    tag: string // Change tag type from 'number' to 'string'
  ) => {
    try {
      await axios.delete("http://localhost:8000/api/subscriber-tags", {
        data: {
          subscriber_id: subscriberId,
          tag: tag,
        },
      });

      // Remove tag from frontend state
      setSubscribers((prev) =>
        prev.map((s) =>
          Number(s.id) === Number(subscriberId)
            ? {
              ...s,
              tags: (s.tags || []).filter((t) => t !== tag),
            }
            : s
        )
      );
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return alert("Please select a file.");
    if (!currentListId) return alert("No subscription list selected.");

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8000/api/subscriptions/${currentListId}/import`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { message, imported, failed, errors } = response.data;

      let alertMessage = `✅ ${message}\nImported: ${imported}\nFailed: ${failed}`;

      if (errors && errors.length > 0) {
        alertMessage += `\n\n❌ Errors:\n`;
        alertMessage += errors
          .map((err: any) => `${err.email || "Unknown email"} - ${err.reason}`)
          .join("\n");
      }

      alert(alertMessage);
      setSelectedFile(null);
      fetchSubscribers(currentListId, currentListName);
    } catch (error: any) {
      console.error("Import failed", error);
      alert(`❌ Import failed: ${error.response?.data?.error || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main
        className={`w-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"
          }`}
      >
        <nav className="bg-gray-900 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
          {!isSidebarOpen && (
            <button
              className="text-white mr-4 focus:outline-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <img src="/options-icon.png" alt="Menu" className="w-8 h-8" />
            </button>
          )}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-white">
              View All Subscriber
            </h1>
          </div>
          <a
            href="/admin/dashboard"
            className="text-white transition item-center ml-auto"
          >
            Dashboard
          </a>
        </nav>

        <div className="p-4 max-w-7xl mx-auto">
          <div className="relative mb-6 flex items-center">
            {/* Back Button */}
            <button
              onClick={() => {
                selectedListId
                  ? setSelectedListId(null)
                  : navigate("/admin/dashboard");
                selectedListId && setSelectedListName(null);
              }}
              className="absolute left-0 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition duration-300 ml-2"
              title={selectedListId ? "Back" : "Back to Dashboard"}
            >
              <img src="/back.svg" alt="Back" className="w-5 h-5" />
            </button>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-900 mx-auto">
              {selectedListId
                ? `Subscribers for ${selectedListName}`
                : "View All Subscription Lists"}
            </h2>
            <div className="flex items-center justify-between mb-4"></div>
            {successMessage && (
              <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 flex items-center space-x-4">
                {/* Success message */}
                <span>{successMessage}</span>

                {/* Close Button */}
                <button
                  onClick={() => setSuccessMessage("")}
                  className="ml-4 text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
            )}

            {showAddForm && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-xl p-8 shadow-lg w-[500px] max-w-full">
                  <h2 className="text-xl font-semibold mb-4">
                    Add Subscription List
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={newList.name}
                        onChange={(e) =>
                          setNewList({ ...newList, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                      />
                    </div>

                    {[
                      {
                        label: "Allow Business Email Only",
                        key: "allow_business_email_only",
                      },
                      {
                        label: "Block Temporary Email",
                        key: "block_temporary_email",
                      },
                      {
                        label: "Require Email Verification",
                        key: "require_email_verification",
                      },
                      {
                        label: "Check Domain Existence",
                        key: "check_domain_existence",
                      },
                      {
                        label: "Verify DNS Records",
                        key: "verify_dns_records",
                      },
                    ].map((field) => (
                      <div
                        key={field.key}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="checkbox"
                          checked={(newList as any)[field.key]}
                          onChange={(e) =>
                            setNewList({
                              ...newList,
                              [field.key]: e.target.checked,
                            })
                          }
                          className="w-5 h-5"
                        />
                        <label className="text-gray-700">{field.label}</label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSubmitList}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!selectedListId ? (
            <div className="w-full shadow-lg rounded-lg border border-gray-200 bg-white">
              <div className="flex justify-end px-6 pt-6">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Add Subscription List
                </button>
              </div>
              <div className="pt-4 px-4">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-300 text-white">
                    <tr>
                      <th className="px-8 py-4 text-left text-m font-semibold text-black">
                        Name
                      </th>
                      <th className="px-8 py-4 text-left text-m font-semibold text-black">
                        Business Email Only
                      </th>
                      <th className="px-8 py-4 text-left text-m font-semibold text-black">
                        Block Temp Email
                      </th>
                      <th className="px-8 py-4 text-left text-m font-semibold text-black">
                        Email Verification
                      </th>
                      <th className="px-8 py-4 text-left text-m font-semibold text-black">
                        Check Domain
                      </th>
                      <th className="px-8 py-4 text-left text-m font-semibold text-black">
                        Verify DNS
                      </th>
                      <th className="px-8 py-4 text-left text-m font-semibold text-black">
                        Created At
                      </th>
                      <th className="px-8 py-4 text-left text-m font-semibold text-black">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionLists.map((list: SubscriptionList) => (
                      <tr
                        key={list.id}
                        className="transition-all duration-200 ease-in-out hover:bg-blue-50 cursor-default"
                      >
                        <td
                          onClick={() => {
                            if (list.id) {
                              fetchSubscribers(list.id, list.name);
                              setCurrentListId(list.id);
                              setCurrentListName(list.name);
                            } else {
                              alert("Invalid subscription list ID.");
                            }
                          }}
                          className="px-8 py-6 border-t border-b border-gray-300 text-m font-medium text-gray-800 cursor-pointer hover:underline"
                        >
                          {list.name}
                        </td>

                        <td className="px-8 py-6 border-t border-b border-gray-300 text-m font-medium text-gray-800 text-center">
                          {list.allow_business_email_only ? "✔" : "✘"}
                        </td>
                        <td className="px-8 py-6 border-t border-b border-gray-300 text-m font-medium text-gray-800 text-center">
                          {list.block_temporary_email ? "✔" : "✘"}
                        </td>
                        <td className="px-8 py-6 border-t border-b border-gray-300 text-m font-medium text-gray-800 text-center">
                          {list.require_email_verification ? "✔" : "✘"}
                        </td>
                        <td className="px-8 py-6 border-t border-b border-gray-300 text-m font-medium text-gray-800 text-center">
                          {list.check_domain_existence ? "✔" : "✘"}
                        </td>
                        <td className="px-8 py-6 border-t border-b border-gray-300 text-m font-medium text-gray-800 text-center">
                          {list.verify_dns_records ? "✔" : "✘"}
                        </td>
                        <td className="px-8 py-4 border-t border-b border-gray-300">
                          {new Date(list.created_at).toLocaleString()}
                        </td>

                        <td className="px-8 py-6 border-t border-b border-gray-300 text-m font-medium text-gray-800 text-center space-x-2">
                          <button
                            className="px-3 py-1 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(list);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 text-green-600 bg-green-50 hover:bg-green-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyList(list);
                            }}
                          >
                            Copy
                          </button>

                          <button
                            className="px-3 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded"
                            onClick={() => handleDelete(list.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {listTotal > 5 && (
                <div className="flex justify-center items-center mt-4 mb-4 space-x-4">
                  {listPage > 1 && (
                    <button
                      onClick={() => listPage > 1 && setListPage(listPage - 1)}
                      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Previous
                    </button>
                  )}
                  <span className="text-gray-700">
                    Page {listPage} of {listTotalPages}
                  </span>
                  {listPage < listTotalPages && (
                    <button
                      onClick={() =>
                        listPage < listTotalPages && setListPage(listPage + 1)
                      }
                      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}

              {editSubscriptionList && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
                  <div className="bg-white rounded-xl p-8 shadow-lg w-[500px] max-w-full">
                    <h2 className="text-xl font-semibold mb-4">
                      Edit Subscription List
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium mb-1">Name</label>
                        <input
                          type="text"
                          value={editSubscriptionList.name}
                          onChange={(e) =>
                            setEditSubscriptionList({
                              ...editSubscriptionList,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                        />
                      </div>

                      {[
                        {
                          label: "Allow Business Email Only",
                          key: "allow_business_email_only",
                        },
                        {
                          label: "Block Temporary Email",
                          key: "block_temporary_email",
                        },
                        {
                          label: "Require Email Verification",
                          key: "require_email_verification",
                        },
                        {
                          label: "Check Domain Existence",
                          key: "check_domain_existence",
                        },
                        {
                          label: "Verify DNS Records",
                          key: "verify_dns_records",
                        },
                      ].map((field) => (
                        <div
                          key={field.key}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="checkbox"
                            checked={(editSubscriptionList as any)[field.key]}
                            onChange={(e) =>
                              setEditSubscriptionList({
                                ...editSubscriptionList,
                                [field.key]: e.target.checked,
                              })
                            }
                            className="w-5 h-5"
                          />
                          <label className="text-gray-700">{field.label}</label>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEditSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search by Email"
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                  className="border p-2 rounded w-full md:w-1/3"
                />
                <input
                  type="text"
                  placeholder="Search by tags (e.g. 2025 2024)"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  className="border p-2 rounded w-full md:w-1/3"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border p-2 rounded w-full md:w-1/3"
                >
                  <option value="all">All Status</option>
                  <option value="active">Subscribers</option>
                  <option value="inactive">Unsubscribers</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-semibold text-blue-900">
                    Total Subscribers
                  </h3>
                  <p className="text-3xl font-bold">{totalStats.total}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-semibold text-green-900">
                    Subscribers
                  </h3>
                  <p className="text-3xl font-bold">{totalStats.active}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-semibold text-red-900">
                    Unsubscribers
                  </h3>
                  <p className="text-3xl font-bold">{totalStats.inactive}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Subscriber Management
                </h1>


                {/* Add Subscription List Button */}
                <button
                  onClick={handleAddSubscriberClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-9 mr-8"
                >
                  + Add Subscriber
                </button>
              </div>

              {/* Add Subscriber Modal */}
              {showAddSubscriberModal && selectedListId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                  <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5 relative"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                          Add Subscriber
                        </h2>
                        {/* Close Button */}
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                          <span className="text-2xl">&times;</span>
                        </button>
                      </div>

                      {/* Hidden List ID Field */}
                      <input type="hidden" value={selectedListId} />

                      {/* Name Input */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Name (Optional)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 border rounded bg-gray-50"
                        />
                      </div>

                      {/* Email Input */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="Enter Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 border rounded bg-gray-50"
                          required
                        />
                      </div>

                      {/* Metadata Input */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                          Metadata
                        </label>
                        <input
                          type="text"
                          placeholder="Enter metadata (e.g. city: Surat, role: Admin)"
                          value={metadata}
                          onChange={(e) => setMetadata(e.target.value)}
                          className="w-full p-3 border rounded bg-gray-50"
                        />
                        <small className="text-gray-500">
                          Use format: <i>key: value, key: value</i>
                        </small>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-lg bg-gray-900 text-white font-medium ${loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        disabled={loading}
                      >
                        {loading ? "Adding..." : "Add Subscriber"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Subscribers
                </h3>

                {selectedSubscribers.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-2"
                  >
                    Delete Selected ({selectedSubscribers.length})
                  </button>
                )}

                {/* Export Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  {/* Export Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportSubscribers("csv")}
                      className="bg-blue-500 text-white text-ml px-3 py-1.5 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => exportSubscribers("json")}
                      className="bg-green-500 text-white text-ml px-3 py-1.5 rounded-md hover:bg-green-600 transition duration-200"
                    >
                      Export JSON
                    </button>
                  </div>

                  {/* Import Section */}
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <h2 className="text-ml font-medium mb-1">Import Subscribers</h2>
                    <input
                      type="file"
                      accept=".csv,.json,.txt"
                      onChange={handleFileChange}
                      className="mb-2 block text-sm"
                    />
                    <button
                      onClick={handleImport}
                      disabled={!selectedFile || loading}
                      className="bg-blue-600 text-white text-ml px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "Importing..." : "Import"}
                    </button>
                  </div>
                </div>




                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-500">
                    <thead>
                      <tr className="bg-gray-300 text-gray-900 text-left">
                        <th className="border p-3">
                          <input
                            type="checkbox"
                            checked={
                              subscribers.length > 0 &&
                              selectedSubscribers.length === subscribers.length
                            }
                            onChange={(e) =>
                              setSelectedSubscribers(
                                e.target.checked
                                  ? subscribers.map((s) => s.id)
                                  : []
                              )
                            }
                          />
                        </th>

                        <th className="border p-3">Name</th>
                        <th className="border p-3">Email</th>
                        <th className="border p-3">Status</th>
                        <th className="border p-3">Tags</th>
                        <th className="border p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscribers.map((subscriber) => (
                        <tr
                          key={subscriber.id}
                          className="border border-gray-300 text-gray-900 hover:bg-gray-100"
                        >
                          <td className="border p-3">
                            <input
                              type="checkbox"
                              checked={selectedSubscribers.includes(
                                subscriber.id
                              )}
                              onChange={() =>
                                handleCheckboxToggle(subscriber.id)
                              }
                            />
                          </td>

                          <td
                            className="p-2 border text-blue-600 cursor-pointer hover:underline"
                            onClick={() =>
                              handleNameClick(Number(subscriber.id))
                            }
                          >
                            {subscriber.name || "N/A"}
                            {isModalOpen && selectedSubscriberDetails && (
                              <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-white/1 backdrop-blur -sm"
                                onClick={() => setIsModalOpen(false)}
                              >
                                <div
                                  className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 transition-all duration-300"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {/* Modal content */}
                                  <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
                                  >
                                    &times;
                                  </button>
                                  <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                                    Subscriber Details
                                  </h2>
                                  <div className="space-y-3 text-sm text-gray-700">
                                    <p>
                                      <span className="font-medium">ID:</span>{" "}
                                      {selectedSubscriberDetails.id}
                                    </p>
                                    <p>
                                      <span className="font-medium">Name:</span>{" "}
                                      {selectedSubscriberDetails.name || "N/A"}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Email:
                                      </span>{" "}
                                      {selectedSubscriberDetails.email}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Status:
                                      </span>{" "}
                                      {selectedSubscriberDetails.status}
                                    </p>
                                    <p>
                                      <span className="font-medium">Tags:</span>{" "}
                                      {selectedSubscriberDetails.tags?.length >
                                        0
                                        ? selectedSubscriberDetails.tags.map(
                                          (tag: string, index: number) => (
                                            <span
                                              key={index}
                                              className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                                            >
                                              {tag}
                                            </span>
                                          )
                                        )
                                        : "No tags"}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Created At:
                                      </span>{" "}
                                      {selectedSubscriberDetails.created_at}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="border p-3">{subscriber.email}</td>
                          <td className="border p-3">
                            <span
                              className={`px-2 py-1 text-white text-sm rounded-lg ${subscriber.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                                }`}
                            >
                              {subscriber.status === "active"
                                ? "✓ Subscribe"
                                : "✗ Unsubscribe"}
                            </span>
                            <button
                              onClick={() =>
                                updateSubscriberStatus(
                                  subscriber.id,
                                  subscriber.status
                                )
                              }
                              className="ml-2 text-yellow-600 hover:text-yellow-800 text-sm"
                            >
                              🔄 Update Status
                            </button>
                          </td>

                          <td className="border p-3">
                            {/* Tags Display */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {subscriber.tags?.map(
                                (tag: string, index: number) => (
                                  <div
                                    key={`tag-${index}`}
                                    className="relative group bg-gray-200 px-2 py-1 rounded-full text-sm text-gray-700"
                                  >
                                    #{tag}
                                    {/* Delete Icon on Hover */}
                                    <span
                                      className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1 cursor-pointer hidden group-hover:inline"
                                      onClick={async () => {
                                        try {
                                          await handleDeleteTag(
                                            Number(subscriber.id),
                                            tag
                                          );
                                          alert("Tag deleted successfully");
                                        } catch (error) {
                                          console.error(
                                            "Failed to delete tag:",
                                            error
                                          );
                                          alert("Failed to delete tag");
                                        }
                                      }}
                                    >
                                      ×
                                    </span>
                                  </div>
                                )
                              )}
                            </div>

                            {/* Add Tag Input */}
                            {selectedSubscriberId === subscriber.id ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Enter tag"
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  className="border rounded p-1 text-sm"
                                />
                                <button
                                  onClick={handleAddTag}
                                  className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600 text-sm"
                                >
                                  Add
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  setSelectedSubscriberId(subscriber.id)
                                }
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                ➕ Add Tag
                              </button>
                            )}
                          </td>

                          <td className="border p-3">
                            <button
                              onClick={() => {
                                const confirmed = window.confirm(
                                  "Are you sure you want to delete this subscriber?"
                                );
                                if (confirmed) {
                                  handleDeleteSubscriber(Number(subscriber.id));
                                }
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {totalSubscribers > 5 && (
                    <div className="flex justify-center items-center space-x-4 mt-6">
                      <button
                        onClick={() =>
                          page > 1 &&
                          fetchSubscribers(
                            selectedListId!,
                            selectedListName!,
                            page - 1,
                            {
                              email: emailSearch,
                              tag: tagSearch,
                              status: statusFilter,
                            }
                          )
                        }
                        disabled={page === 1}
                        className={`px-4 py-2 rounded ${page === 1
                          ? "bg-gray-400"
                          : "bg-blue-500 hover:bg-blue-600"
                          } text-white`}
                      >
                        Previous
                      </button>

                      <span className="font-semibold">
                        Page {page} of {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          page < totalPages &&
                          fetchSubscribers(
                            selectedListId!,
                            selectedListName!,
                            page + 1,
                            {
                              email: emailSearch,
                              tag: tagSearch,
                              status: statusFilter,
                            }
                          )
                        }
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded ${page === totalPages
                          ? "bg-gray-400"
                          : "bg-blue-500 hover:bg-blue-600"
                          } text-white`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubscriptionManagement;

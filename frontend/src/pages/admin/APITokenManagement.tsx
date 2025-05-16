import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { formatDistanceToNow, isAfter } from "date-fns";

interface APITokenManagementProps {
  onClose?: () => void;
}

const APITokenManagement: React.FC<APITokenManagementProps> = ({ onClose }) => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokenName, setTokenName] = useState("");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await api.get("/api-tokens");
      setTokens(response.data.tokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  const generateToken = async () => {
    if (!tokenName) return alert("Please enter a token name.");

    try {
      const response = await api.post("/api-tokens/create", {
        name: tokenName,
      });
      setGeneratedToken(response.data.token);
      fetchTokens();
    } catch (error) {
      console.error("Error generating token:", error);
    }
  };

  const revokeToken = async (id: number) => {
    if (!window.confirm("Are you sure you want to revoke this token?")) return;

    try {
      await api.delete(`/tokens/${id}`);
      fetchTokens();
    } catch (error) {
      console.error("Error revoking token:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard.");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-[600px] max-w-full relative z-50">
        {onClose && (
          <button
            className="absolute top-2 right-2 text-red-500"
            onClick={onClose}
          >
            X
          </button>
        )}
        <h2 className="text-2xl font-semibold mb-4">API Token Management</h2>

        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="Enter Token Name"
            className="border rounded p-2 w-full"
          />
          <button
            onClick={generateToken}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generate
          </button>
        </div>

        {generatedToken && (
          <div className="mb-4">
            <p className="text-green-600">Generated Token:</p>
            <div className="flex items-center">
              <input
                type="text"
                value={generatedToken}
                readOnly
                className="w-full border rounded p-2"
              />
              <button
                onClick={() => copyToClipboard(generatedToken)}
                className="ml-2 text-blue-500"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <h3 className="text-xl mb-2">Your API Tokens:</h3>
        <ul className="max-h-60 overflow-y-auto">
          {tokens.map((token) => (
            <li key={token.id} className="flex flex-col mb-2">
              <div className="flex justify-between items-center">
                <div>{token.name}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(token.token)}
                    className="text-blue-500"
                  >
                    Copy Token
                  </button>
                  <button
                    onClick={() => revokeToken(token.id)}
                    className="text-red-500"
                  >
                    Revoke
                  </button>
                </div>
              </div>
              <div
                className={`text-sm ${
                  isAfter(new Date(), new Date(token.expires_at))
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {isAfter(new Date(), new Date(token.expires_at))
                  ? "Token is expired. Generate new token."
                  : `Expires in: ${formatDistanceToNow(
                      new Date(token.expires_at)
                    )}`}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default APITokenManagement;

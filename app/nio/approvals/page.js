"use client";
import { useState } from "react";

export default function ApprovalsPage() {
  const [requests, setRequests] = useState([
    { id: 1, user: "Liam Carter", type: "Voice Export", status: "Pending" },
    { id: 2, user: "Amira Solis", type: "Twin Publish", status: "Pending" },
    { id: 3, user: "Noah King", type: "Content Review", status: "Approved" },
  ]);

  const updateStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">Approvals Center</h1>

      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900 border-b border-gray-800">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-400">User</th>
              <th className="text-left py-3 px-4 font-medium text-gray-400">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
              <th className="text-right py-3 px-4 font-medium text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-gray-800">
                <td className="py-3 px-4">{r.user}</td>
                <td className="py-3 px-4">{r.type}</td>
                <td
                  className={`py-3 px-4 ${
                    r.status === "Approved"
                      ? "text-green-400"
                      : r.status === "Rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {r.status}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  {r.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(r.id, "Approved")}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, "Rejected")}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-xs"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

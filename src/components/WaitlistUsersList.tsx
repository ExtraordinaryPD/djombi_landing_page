// src/components/WaitlistUsersList.tsx

import { getWaitlistUsers } from "@/lib/api/waitlist";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface WaitlistUser {
  _id: string;
  email: string;
  fullName: string;
  position: string;
  country: string;
  joinedAt: string;
}

const WaitlistUsersList: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["waitlistUsers"],
    queryFn: () => getWaitlistUsers(),
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading waitlist users...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading users: {(error as any).message}
      </div>
    );
  }

  const users = data?.data || [];

  if (users.length === 0) {
    return (
      <div className="text-center py-8">No users on the waitlist yet.</div>
    );
  }

  // Format position for display (first letter capitalized)
  const formatPosition = (position: string) => {
    const displayName = {
      sales: "Sales",
      admin: "Admin",
      digital: "Digital Marketing",
      manager: "Manager",
      freelancer: "Freelancer",
      intern: "Intern",
      finance: "Finance",
      others: "Others",
    }[position];

    return displayName || position;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Waitlist Users</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: WaitlistUser) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatPosition(user.position)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.country}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(user.joinedAt)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaitlistUsersList;

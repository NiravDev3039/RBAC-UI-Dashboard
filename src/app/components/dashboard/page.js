"use client";
import React, { useState, useEffect } from "react";
import User from "../../components/user/page";
import Navbar from "../../components/navbar/page";
import {
  ChevronDown,
  Edit,
  Trash2,
  PlusCircle,
  Search,
  X,
  Clock,
  Send,
} from "lucide-react";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityLog, setActivityLog] = useState([]);
  const [showActivityLog, setShowActivityLog] = useState(false);
  // New state for modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

  const [users, setUsers] = useState([
    {
      id: "1",
      username: "john_admin",
      email: "john@company.com",
      role: "Administrator",
      status: "active",
    },
    {
      id: "2",
      username: "sarah_editor",
      email: "sarah@company.com",
      role: "Editor",
      status: "active",
    },
  ]);

  const [roles, setRoles] = useState([
    {
      id: "1",
      name: "Administrator",
      description: "Full system access",
      permissions: ["read", "write", "delete"],
    },
    {
      id: "2",
      name: "Editor",
      description: "Content management",
      permissions: ["read", "write"],
    },
  ]);
  // State for create/edit modal

  const [currentRole, setCurrentRole] = useState({
    id: null,
    name: "",
    description: "",
    permissions: [],
  });

  // Handle save role (for both create and update)
  const handleSaveRole = () => {
    if (currentRole.id) {
      // Update existing role
      setRoles(
        roles.map((role) => (role.id === currentRole.id ? currentRole : role))
      );
    } else {
      // Create new role (generate a new ID)
      setRoles([...roles, { ...currentRole, id: Date.now() }]);
    }

    // Reset modal state
    setIsModalsOpen(false);
    setCurrentRole({
      id: null,
      name: "",
      description: "",
      permissions: [],
    });
  };

  // New state for form inputs
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "",
    status: "active",
  });

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  // State to manage the filters
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isModalsOpen, setIsModalsOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4); // Number of users to display per page
  // Function to handle filtering based on selected role and status

  // Calculate which users to display based on the current page and usersPerPage
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    let filtered = users;

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((user) => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [selectedRole, selectedStatus, users]);
  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((user) => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, selectedStatus, users]);

  const handleCreateRole = () => {
    if (!newRole.name || newRole.permissions.length === 0) {
      alert("Please fill in role name and select at least one permission");
      return;
    }

    const roleToAdd = {
      ...newRole,
      id: String(roles.length + 1),
    };

    setRoles([...roles, roleToAdd]);

    // Reset form and close modal
    setNewRole({
      name: "",
      description: "",
      permissions: [],
    });
    setIsCreateRoleModalOpen(false);
  };

  // Handle input changes in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCurrentRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle edit role
  const handleEditRole = (role) => {
    // Pre-fill the modal with existing role data
    setCurrentRole({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setIsModalsOpen(true);
  };

  // Handle permission toggle
  const handlePermissionToggle = (permission) => {
    setCurrentRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  // Modal component (reusable)
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 bg-white">
        <div className="bg-white rounded-lg shadow-xl w-96 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <User />
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="container mx-auto space-y-8">
          {/* Create Role Modal */}
          <Modal
            isOpen={isCreateRoleModalOpen}
            onClose={() => setIsCreateRoleModalOpen(false)}
            title="Create New Role"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role Name
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                  placeholder="Enter role description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Permissions
                </label>
                <div className="mt-2 space-y-2">
                  {[
                    "read:content",
                    "write:content",
                    "delete:content",
                    "read:all",
                    "write:all",
                    "delete:all",
                  ].map((perm) => (
                    <label key={perm} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={newRole.permissions.includes(perm)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRole({
                              ...newRole,
                              permissions: [...newRole.permissions, perm],
                            });
                          } else {
                            setNewRole({
                              ...newRole,
                              permissions: newRole.permissions.filter(
                                (p) => p !== perm
                              ),
                            });
                          }
                        }}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRole}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create Role
                </button>
              </div>
            </div>
          </Modal>

          {/* Roles Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Role Management
              </h2>
              <button
                onClick={() => {
                  setCurrentRole({
                    id: null,
                    name: "",
                    description: "",
                    permissions: [],
                  });
                  setIsModalsOpen(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
              >
                <PlusCircle size={20} />
                Create Role
              </button>
            </div>

            <table className="w-full">
              {/* Table header and body as in your original code */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {role.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {role.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {role.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-blue-600 hover:text-blue-900 transition"
                        title="Edit Role"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => {
                          // Implement delete functionality
                          setRoles(roles.filter((r) => r.id !== role.id));
                        }}
                        className="text-red-600 hover:text-red-900 transition"
                        title="Delete Role"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role Create/Edit Modal */}
          {isModalsOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {currentRole.id ? "Edit Role" : "Create Role"}
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentRole.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter role name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={currentRole.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter role description"
                    rows="3"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["read", "write", "delete", "create", "update"].map(
                      (perm) => (
                        <button
                          key={perm}
                          type="button"
                          onClick={() => handlePermissionToggle(perm)}
                          className={`px-3 py-1 rounded-full text-sm transition ${
                            currentRole.permissions.includes(perm)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {perm}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalsOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRole}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Role
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

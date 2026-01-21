// client/src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  FileText,
  AlertCircle // Added for error handling
} from 'lucide-react';
import { getAllUsers, updateUser, deleteUser } from '../../utils/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState(''); // Added error state
  const [success, setSuccess] = useState(''); // Added success state
  
  const navigate = useNavigate(); // Added for navigation

  useEffect(() => {
    fetchUsers();
  }, [currentPage, selectedRole]);

  useEffect(() => {
    // Only filter locally when we have a search term and haven't already filtered via API
    if (searchTerm) {
      filterUsers();
    } else {
      // If no search term, show all users from current page
      setFilteredUsers(users);
    }
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page: currentPage,
        limit: 20,
        role: selectedRole !== 'all' ? selectedRole : undefined,
        search: searchTerm || undefined // Include search in API call for better performance
      };
      
      console.log('Fetching users with params:', params);
      
      const response = await getAllUsers(params);
      
      if (response.success) {
        setUsers(response.users || []);
        setFilteredUsers(response.users || []);
        setTotalPages(response.totalPages || 1);
        setTotalUsers(response.total || 0);
        
        if (response.users.length === 0) {
          setSuccess('No users found with current filters');
        }
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    // Only filter if we have users and a search term
    if (!searchTerm || users.length === 0) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.phone && user.phone.toLowerCase().includes(searchLower))
      );
    });

    setFilteredUsers(filtered);
    
    // Update pagination for client-side filtered results
    if (filtered.length === 0 && searchTerm) {
      setTotalPages(1);
      setCurrentPage(1);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}? This will give them ${newRole === 'admin' ? 'full admin' : 'regular user'} access.`)) return;

    try {
      setError('');
      setSuccess('');
      
      const response = await updateUser(userId, { role: newRole });
      if (response.success) {
        setSuccess(`User role updated to ${newRole} successfully`);
        
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
        
        setFilteredUsers(prevFiltered => 
          prevFiltered.map(user => 
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      setError(error.message || 'Failed to update user');
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    const action = isActive ? 'deactivate' : 'activate';
    const newStatus = !isActive;
    
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      setError('');
      setSuccess('');
      
      const response = await updateUser(userId, { isActive: newStatus });
      if (response.success) {
        setSuccess(`User ${action}d successfully`);
        
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId ? { ...user, isActive: newStatus } : user
          )
        );
        
        setFilteredUsers(prevFiltered => 
          prevFiltered.map(user => 
            user._id === userId ? { ...user, isActive: newStatus } : user
          )
        );
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      setError(error.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    // Find user for better confirmation message
    const userToDelete = users.find(u => u._id === userId);
    const userName = userToDelete?.fullName || userToDelete?.email || 'this user';
    
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone and will delete all their bookings.`)) return;

    try {
      setError('');
      setSuccess('');
      
      const response = await deleteUser(userId);
      if (response.success) {
        setSuccess('User deleted successfully');
        
        // Remove from local state
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        setFilteredUsers(prevFiltered => prevFiltered.filter(user => user._id !== userId));
        
        // Update total count
        setTotalUsers(prev => prev - 1);
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError(error.message || 'Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle Enter key in search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchUsers();
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setCurrentPage(1);
    // Fetch users without filters
    setTimeout(() => fetchUsers(), 0);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all platform users and their permissions</p>
        </div>
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="all">All Users</option>
              <option value="user">Regular Users</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
            <button
              onClick={() => {
                setCurrentPage(1);
                fetchUsers();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Active filters info */}
        <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
          {(selectedRole !== 'all' || searchTerm) && (
            <>
              <span>Active filters:</span>
              {selectedRole !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Role: {selectedRole}
                </span>
              )}
              {searchTerm && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Bookings</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.fullName || 'No Name'}
                        </div>
                        <div className="text-xs text-gray-500">ID: {user._id?.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-900">{user.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-900">{user.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-4 h-4 ${user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'}`} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Active
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Inactive
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{user.stats?.totalBookings || 0}</span>
                      <span className="text-xs text-gray-500">bookings</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* View Details Button - Optional if you have a user details page */}
                      {false && ( // Change to true if you implement user details page
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      
                      {/* Role Change Dropdown */}
                      <div className="relative group">
                        <button
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Change Role"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => handleRoleChange(user._id, 'user')}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 capitalize ${
                                user.role === 'user' ? 'bg-gray-100 font-medium' : ''
                              }`}
                            >
                              Make Regular User
                            </button>
                            <button
                              onClick={() => handleRoleChange(user._id, 'admin')}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 capitalize ${
                                user.role === 'admin' ? 'bg-gray-100 font-medium' : ''
                              }`}
                            >
                              Make Administrator
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Toggle */}
                      <button
                        onClick={() => handleStatusChange(user._id, user.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.isActive ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                      
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                        disabled={user.role === 'admin'} // Prevent deleting admin accounts
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try changing your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * 20, totalUsers)}</span> of{' '}
              <span className="font-medium">{totalUsers}</span> users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-md text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-8 h-8 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
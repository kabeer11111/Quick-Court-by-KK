// In app/admin/users/page.tsx - Add proper type definitions
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

// Define comprehensive user types
interface BaseUser {
  id: number
  fullName: string
  email: string
  phone: string
  role: 'user' | 'owner' | 'admin'
  status: 'active' | 'banned' | 'inactive'
  joinDate: string
  lastLogin: string
  totalBookings: number
  avatar: string
  address: string
}

interface RegularUser extends BaseUser {
  role: 'user'
  facilities?: undefined
  banReason?: undefined
}

interface OwnerUser extends BaseUser {
  role: 'owner'
  facilities: string[]
  banReason?: undefined
}

interface BannedUser extends BaseUser {
  status: 'banned'
  banReason: string
  facilities?: string[]
}

type User = RegularUser | OwnerUser | BannedUser

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'owner' | 'admin'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned' | 'inactive'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()

  // Mock data with proper typing
  const mockUsers: User[] = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      role: "user",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-01-20",
      totalBookings: 15,
      avatar: "/avatars/john.jpg",
      address: "123 Main St, City"
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      role: "owner",
      status: "active",
      joinDate: "2024-01-10",
      lastLogin: "2024-01-19",
      totalBookings: 8,
      avatar: "/avatars/jane.jpg",
      address: "456 Oak Ave, City",
      facilities: ["Sports Complex A", "Tennis Courts B"]
    },
    {
      id: 3,
      fullName: "Bob Wilson",
      email: "bob@example.com",
      phone: "+1234567892",
      role: "user",
      status: "banned",
      joinDate: "2024-01-05",
      lastLogin: "2024-01-18",
      totalBookings: 3,
      avatar: "/avatars/bob.jpg",
      address: "789 Pine St, City",
      banReason: "Inappropriate behavior"
    }
  ]

  useEffect(() => {
    // In production, fetch from API
    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
  }, [])

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((user: User) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user: User) => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user: User) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  // FIXED: Proper user status update with correct typing
  const handleStatusChange = async (userId: number, newStatus: 'active' | 'banned' | 'inactive', banReason?: string) => {
    setIsLoading(true)
    try {
      // In production, make API call
      setUsers((prev: User[]) => 
        prev.map((user: User) => {
          if (user.id === userId) {
            if (newStatus === 'banned' && banReason) {
              return { ...user, status: newStatus, banReason } as User
            }
            return { ...user, status: newStatus } as User
          }
          return user
        })
      )
    } catch (error) {
      console.error('Error updating user status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
  }

  // Check admin access
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, facility owners, and administrators</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'owner' | 'admin')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="owner">Facility Owners</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'banned' | 'inactive')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleUserClick(user)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={user.avatar || '/default-avatar.png'} 
                            alt={user.fullName} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">Joined {new Date(user.joinDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'banned' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{user.email}</div>
                      <div className="text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.status === 'active' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(user.id, 'banned', 'Banned by admin')
                          }}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          Ban
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(user.id, 'active')
                          }}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Profile */}
                  <div className="flex items-center space-x-4">
                    <img 
                      className="h-20 w-20 rounded-full" 
                      src={selectedUser.avatar || '/default-avatar.png'} 
                      alt={selectedUser.fullName} 
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{selectedUser.fullName}</h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.phone}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Join Date</label>
                      <p className="mt-1 text-sm text-gray-900">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Login</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.address}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.role}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Bookings</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.totalBookings}</p>
                    </div>

                    {selectedUser.role === 'owner' && 'facilities' in selectedUser && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Facilities</label>
                        <div className="mt-1">
                          {selectedUser.facilities?.map((facility: string, index: number) => (
                            <span 
                              key={index}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedUser.status === 'banned' && 'banReason' in selectedUser && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ban Reason</label>
                        <p className="mt-1 text-sm text-red-600">{selectedUser.banReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    {selectedUser.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(selectedUser.id, 'banned', 'Banned by admin')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Ban User
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(selectedUser.id, 'active')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Activate User
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

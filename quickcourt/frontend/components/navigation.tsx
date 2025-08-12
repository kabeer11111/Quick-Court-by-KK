// In components/navigation.tsx - Fix all role references
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Building, User, Settings, LogOut, Calendar, BarChart3 } from 'lucide-react'

export function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const getDashboardLink = () => {
    if (!user) return "/auth/login"
    
    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "owner": // FIXED: Changed from "facility_owner" to "owner"
        return "/owner/dashboard"
      default:
        return "/dashboard"
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              QuickCourt
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Public navigation links */}
            <Link
              href="/venues"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Venues
            </Link>

            {/* Authenticated user navigation */}
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>

                {/* FIXED: Owner-specific navigation - changed from "facility_owner" to "owner" */}
                {user.role === "owner" && (
                  <>
                    <Link
                      href="/owner/venues"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Facilities
                    </Link>
                    <Link
                      href="/owner/bookings"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Bookings
                    </Link>
                  </>
                )}

                {/* Admin-specific navigation */}
                {user.role === "admin" && (
                  <>
                    <Link
                      href="/admin/users"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Users
                    </Link>
                    <Link
                      href="/admin/venues"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Venues
                    </Link>
                  </>
                )}

                {/* User dropdown menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback>
                          {user.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/bookings">
                        <Calendar className="w-4 h-4 mr-2" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>

                    {/* FIXED: Owner-specific dropdown items - changed from "facility_owner" to "owner" */}
                    {user.role === "owner" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/owner/venues">
                            <Building className="w-4 h-4 mr-2" />
                            My Facilities
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/owner/analytics">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/users">
                            <User className="w-4 h-4 mr-2" />
                            User Management
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/venues">
                            <Building className="w-4 h-4 mr-2" />
                            Venue Management
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Guest navigation */
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

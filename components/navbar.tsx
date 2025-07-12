"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  GraduationCap,
  Users,
  Camera,
  Stethoscope,
  MessageCircle,
  Globe,
  BookOpen,
  Shield,
  Heart,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const wings = [
  { name: "Media Wing", href: "/wings", icon: Camera },
  { name: "Medical Wing", href: "/wings", icon: Stethoscope },
  { name: "Discourse Hub", href: "/wings", icon: MessageCircle },
  { name: "English Club", href: "/wings", icon: Globe },
  { name: "Arabic Club", href: "/wings", icon: BookOpen },
  { name: "Malayalam Club", href: "/wings", icon: BookOpen },
  { name: "Urdu Club", href: "/wings", icon: BookOpen },
  { name: "GK Wing", href: "/wings", icon: GraduationCap },
  { name: "White Battalion", href: "/wings", icon: Shield },
  { name: "Tharbiyya Wing", href: "/wings", icon: Heart },
  { name: "Welfare Wing", href: "/wings", icon: Users },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showWingsDropdown, setShowWingsDropdown] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-200",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200" : "bg-white/90 backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">SA'ADA UNION</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/about"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100",
                pathname === "/about" ? "bg-gray-100 text-blue-600" : "text-gray-700",
              )}
            >
              About
            </Link>

            <div className="relative">
              <button
                onMouseEnter={() => setShowWingsDropdown(true)}
                onMouseLeave={() => setShowWingsDropdown(false)}
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 text-gray-700 flex items-center space-x-1"
              >
                <span>Wings</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showWingsDropdown && (
                <div
                  onMouseEnter={() => setShowWingsDropdown(true)}
                  onMouseLeave={() => setShowWingsDropdown(false)}
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 grid grid-cols-2 gap-2"
                >
                  {wings.map((wing) => (
                    <Link
                      key={wing.name}
                      href={wing.href}
                      className="flex items-center space-x-3 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <wing.icon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{wing.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/class-unions"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100",
                pathname === "/class-unions" ? "bg-gray-100 text-blue-600" : "text-gray-700",
              )}
            >
              Class Unions
            </Link>

            <Link
              href="/news"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100",
                pathname === "/news" ? "bg-gray-100 text-blue-600" : "text-gray-700",
              )}
            >
              News
            </Link>

            <Link
              href="/quiz"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100",
                pathname === "/quiz" ? "bg-gray-100 text-blue-600" : "text-gray-700",
              )}
            >
              Live Quiz
            </Link>

            <Link
              href="/blog"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100",
                pathname === "/blog" ? "bg-gray-100 text-blue-600" : "text-gray-700",
              )}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100",
                pathname === "/contact" ? "bg-gray-100 text-blue-600" : "text-gray-700",
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors text-sm"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 p-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <ChevronDown className="w-3 h-3 hidden sm:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(true)} className="text-sm">
                  Sign In
                </Button>
                <Button size="sm" className="text-sm">Sign Up</Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 mobile-menu" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white mobile-menu">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors text-sm"
                />
              </div>
            </div>
            
            <nav className="flex flex-col space-y-1 p-4">
              <Link 
                href="/about" 
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/wings" 
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Wings
              </Link>
              <Link
                href="/class-unions"
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Class Unions
              </Link>
              <Link 
                href="/news" 
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link 
                href="/quiz" 
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Live Quiz
              </Link>
              <Link 
                href="/blog" 
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Wings Dropdown */}
              <div className="mt-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Wings
                </div>
                <div className="grid grid-cols-1 gap-1 mt-2">
                  {wings.slice(0, 6).map((wing) => (
                    <Link
                      key={wing.name}
                      href={wing.href}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <wing.icon className="w-4 h-4 text-blue-600" />
                      <span>{wing.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              {!isLoggedIn && (
                <div className="flex space-x-3 pt-4 border-t border-gray-100 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent text-sm"
                    onClick={() => {
                      setIsLoggedIn(true)
                      setIsMenuOpen(false)
                    }}
                  >
                    Sign In
                  </Button>
                  <Button size="sm" className="flex-1 text-sm">
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

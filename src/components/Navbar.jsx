import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Car, LogOut, Sun, Moon, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, logout, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
              <Car className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">SmartPark</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`${theme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    className={`${theme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition`}
                  >
                    My Bookings
                  </Link>
                </>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100'} transition`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Login
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className={`md:hidden pb-4 ${theme === 'dark' ? 'border-t border-gray-700' : 'border-t'}`}>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`block py-2 ${theme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    className={`block py-2 ${theme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 py-2 mt-2"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block py-2 text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

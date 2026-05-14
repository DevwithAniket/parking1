import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Car, LogOut, Sun, Moon, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { isAuthenticated, logout, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  }

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="sticky top-0 z-40"
    >
      <div className={`${theme === 'dark' ? 'bg-gray-900/80 backdrop-blur-glass border-b border-gray-700/50' : 'bg-white/80 backdrop-blur-glass border-b border-gray-200/50'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="flex items-center gap-2 group"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Car className="w-8 h-8 text-blue-600" />
              </motion.div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                SmartPark
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated && (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/dashboard"
                      className={`${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition font-medium`}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/my-bookings"
                      className={`${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition font-medium`}
                    >
                      My Bookings
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-xl transition ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {isAuthenticated ? (
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-red-500/20"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-blue-500/20 font-medium"
                  >
                    Login
                  </Link>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`md:hidden overflow-hidden ${theme === 'dark' ? 'border-t border-gray-700' : 'border-t'}`}
              >
                <div className="py-4 space-y-2">
                  {isAuthenticated && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Link
                          to="/dashboard"
                          className={`block px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          to="/my-bookings"
                          className={`block px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          My Bookings
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                  {!isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        to="/login"
                        className="block px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  )
}

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
          />
          <span className="text-gray-600 dark:text-gray-400 font-medium">Loading...</span>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

import React from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Toast({ notification, theme }) {
  if (!notification) return null

  const isSuccess = notification.type === 'success'
  const isError = notification.type === 'error'

  const toastVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.8, x: 100 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      x: 100,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={toastVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <motion.div
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border ${
            isSuccess
              ? `${theme === 'dark' ? 'bg-green-900/90 border-green-500/50' : 'bg-green-50/90 border-green-400/50'}`
              : `${theme === 'dark' ? 'bg-red-900/90 border-red-500/50' : 'bg-red-50/90 border-red-400/50'}`
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(12px)',
          }}
          whileHover={{ scale: 1.03 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
          >
            {isSuccess ? (
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
            ) : (
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            )}
          </motion.div>
          <span className={`font-medium flex-1 ${isSuccess ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
            {notification.message}
          </span>
          {notification.type === 'error' && (
            <motion.button
              onClick={() => {}}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-red-800' : 'hover:bg-red-200'} transition`}
            >
              <X size={18} />
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

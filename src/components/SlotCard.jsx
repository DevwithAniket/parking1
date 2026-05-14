import React from 'react'
import { MapPin, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SlotCard({ slot, onBook, theme, isBooked = false }) {
  const getStatusConfig = () => {
    switch (slot.status) {
      case 'available':
        return {
          bgColor: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
          borderColor: theme === 'dark' ? 'border-green-500/50' : 'border-green-300',
          textColor: 'text-green-600 dark:text-green-400',
          badgeBg: 'bg-green-500',
          buttonBg: 'bg-gradient-to-r from-green-600 to-emerald-600',
          buttonHover: 'hover:from-green-700 hover:to-emerald-700',
        }
      case 'booked':
        return {
          bgColor: theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100',
          borderColor: theme === 'dark' ? 'border-yellow-500/50' : 'border-yellow-300',
          textColor: 'text-yellow-600 dark:text-yellow-400',
          badgeBg: 'bg-yellow-500',
          buttonBg: 'bg-gray-400',
          buttonHover: 'hover:bg-gray-500',
        }
      case 'occupied':
        return {
          bgColor: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100',
          borderColor: theme === 'dark' ? 'border-red-500/50' : 'border-red-300',
          textColor: 'text-red-600 dark:text-red-400',
          badgeBg: 'bg-red-500',
          buttonBg: 'bg-gray-400',
          buttonHover: 'hover:bg-gray-500',
        }
      default:
        return {
          bgColor: theme === 'dark' ? 'bg-gray-600/20' : 'bg-gray-100',
          borderColor: theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
          textColor: 'text-gray-600 dark:text-gray-400',
          badgeBg: 'bg-gray-500',
          buttonBg: 'bg-gray-400',
          buttonHover: 'hover:bg-gray-500',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <motion.div
      layout
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`p-6 rounded-2xl backdrop-blur-sm border-2 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group ${
        theme === 'dark' ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/50'
      } ${config.borderColor} border-opacity-60 hover:border-opacity-100`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      }}
    >
      {/* Decorative background gradient */}
      <motion.div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${config.bgColor}`}
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(var(--tw-gradient-stops)) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(var(--tw-gradient-stops)) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(var(--tw-gradient-stops)) 0%, transparent 50%)',
          ],
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className={`p-3 rounded-xl ${config.bgColor}`}
            >
              <MapPin className={`w-6 h-6 ${config.textColor}`} />
            </motion.div>
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Slot No.
              </p>
              <motion.p
                className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {slot.id}
              </motion.p>
            </div>
          </div>

          <motion.div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${config.buttonBg} shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        <div className="mb-6">
          <motion.span
            className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white ${config.badgeBg} shadow-md`}
            whileHover={{ scale: 1.05 }}
          >
            {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
          </motion.span>
        </div>

        {slot.status === 'available' && !isBooked && (
          <motion.button
            onClick={() => onBook(slot.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-200 shadow-lg ${config.buttonBg} ${config.buttonHover}`}
          >
            Book Now
          </motion.button>
        )}

        {isBooked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 p-3 rounded-xl text-center text-sm font-semibold border border-blue-500/30"
          >
            Your Booking
          </motion.div>
        )}

        {slot.status === 'occupied' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-center text-sm font-semibold border border-red-500/30"
          >
            Occupied
          </motion.div>
        )}

        {slot.status === 'booked' && !isBooked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-3 rounded-xl text-center text-sm font-semibold border border-yellow-500/30"
          >
            Reserved
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

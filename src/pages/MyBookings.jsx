import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParking } from '../context/ParkingContext'
import { Calendar, Clock, DollarSign, X, Check, Car } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MyBookings() {
  const { theme } = useAuth()
  const { bookings, completeBooking, showNotification } = useParking()
  const [cancellingId, setCancellingId] = useState(null)

  const activeBookings = bookings.filter(b => b.status === 'active')
  const completedBookings = bookings.filter(b => b.status === 'completed')

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId)
    try {
      await completeBooking(bookingId)
      showNotification('Booking cancelled successfully', 'success')
    } catch {
      showNotification('Failed to cancel booking', 'error')
    } finally {
      setCancellingId(null)
    }
  }

  const formatTime = (timeStr) => {
    return timeStr || '09:00'
  }

  const getEndTime = (startTime, duration) => {
    const [hours, mins] = startTime.split(':').map(Number)
    const endHour = (hours + duration) % 24
    return `${String(endHour).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme === 'dark' ? 'bg-gray-800/60 backdrop-blur-glass border-gray-700/50' : 'bg-white/80 backdrop-blur-glass border-gray-200/50'} border-b shadow-sm sticky top-16 z-30`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-1">
            <Car className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              My Bookings
            </h1>
          </div>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            View and manage your parking bookings
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Active Bookings */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold mb-6 flex items-center gap-2"
          >
            <span className="w-2 h-8 bg-blue-600 rounded-full" />
            Active Bookings
            {activeBookings.length > 0 && (
              <span className="text-sm font-normal text-gray-500">({activeBookings.length})</span>
            )}
          </motion.h2>

          {activeBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}
              style={{ border: '1px solid var(--glass-border)' }}
            >
              <Car className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No active bookings.{' '}
                <motion.a
                  href="/dashboard"
                  className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  whileHover={{ scale: 1.05 }}
                >
                  Book a slot
                </motion.a>
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-6"
            >
              <AnimatePresence>
                {activeBookings.map((booking) => (
                  <motion.div
                    layout
                    key={booking.id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className={`p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/90'
                    } backdrop-blur-sm border-l-4 border-blue-600`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Slot Number
                        </p>
                        <motion.p
                          className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          #{booking.slotId}
                        </motion.p>
                      </div>
                      <motion.span
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                      >
                        Active
                      </motion.span>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-blue-600" size={20} />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
                          <p className="font-semibold">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="text-green-600" size={20} />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</p>
                          <p className="font-semibold">
                            {formatTime(booking.timeStart)} - {getEndTime(formatTime(booking.timeStart), booking.duration)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <DollarSign className="text-yellow-600" size={20} />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Price Paid</p>
                          <p className="font-semibold text-green-600">₹{booking.price}</p>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                    >
                      {cancellingId === booking.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <X size={18} />
                      )}
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Completed Bookings */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-6 flex items-center gap-2"
          >
            <span className="w-2 h-8 bg-green-600 rounded-full" />
            Completed Bookings
            {completedBookings.length > 0 && (
              <span className="text-sm font-normal text-gray-500">({completedBookings.length})</span>
            )}
          </motion.h2>

          {completedBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-8 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}
              style={{ border: '1px solid var(--glass-border)' }}
            >
              <Check className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No completed bookings yet.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-6"
            >
              <AnimatePresence>
                {completedBookings.map((booking) => (
                  <motion.div
                    layout
                    key={booking.id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm border-l-4 border-green-600 ${
                      theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80'
                    } opacity-75`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Slot Number
                        </p>
                        <motion.p
                          className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                        >
                          #{booking.slotId}
                        </motion.p>
                      </div>
                      <motion.span
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Check size={16} />
                        Completed
                      </motion.span>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-blue-600" size={20} />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
                          <p className="font-semibold">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="text-green-600" size={20} />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Duration</p>
                          <p className="font-semibold">{booking.duration} Hour(s)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <DollarSign className="text-yellow-600" size={20} />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Price Paid</p>
                          <p className="font-semibold text-green-600">₹{booking.price}</p>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-blue-500/20"
                    >
                      Book Again
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

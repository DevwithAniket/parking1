import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParking } from '../context/ParkingContext'
import SlotCard from '../components/SlotCard'
import BookingModal from '../components/BookingModal'
import Legend from '../components/Legend'
import Toast from '../components/Toast'
import { ParkingCircle, RefreshCw, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Dashboard() {
  const { user, theme } = useAuth()
  const { slots, bookings, notification, bookSlot, calculatePrice, refreshSlots, showNotification } = useParking()
  const [showModal, setShowModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleBook = (slotId) => {
    setSelectedSlot(slotId)
    setShowModal(true)
  }

  const handleBookingSubmit = async (bookingData) => {
    setIsLoading(true)
    try {
      const booking = await bookSlot(bookingData.slotId, bookingData.duration, bookingData.timeStart)
      showNotification(`Slot ${bookingData.slotId} booked successfully!`, 'success')
      setShowModal(false)
      setSelectedSlot(null)

      setTimeout(() => {
        window.location.href = `/payment?slotId=${bookingData.slotId}&amount=${booking.price}&bookingId=${booking.id}`
      }, 800)
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to book slot', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      await refreshSlots()
      showNotification('Slot status refreshed!', 'success')
    } catch {
      showNotification('Failed to refresh slots', 'error')
    }
  }

  const bookedSlotsByUser = bookings.filter(b => b.status === 'active').map(b => b.slotId)
  const availableCount = slots.filter(s => s.status === 'available').length
  const occupiedCount = slots.filter(s => s.status === 'occupied').length
  const bookedCount = slots.filter(s => s.status === 'booked').length

  const stats = [
    { label: 'AVAILABLE', value: availableCount, color: 'text-green-600', bgColor: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100', borderColor: theme === 'dark' ? 'border-green-700' : 'border-green-200', icon: Sparkles },
    { label: 'BOOKED', value: bookedCount, color: 'text-yellow-600', bgColor: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100', borderColor: theme === 'dark' ? 'border-yellow-700' : 'border-yellow-200', icon: ParkingCircle },
    { label: 'OCCUPIED', value: occupiedCount, color: 'text-red-600', bgColor: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100', borderColor: theme === 'dark' ? 'border-red-700' : 'border-red-200', icon: RefreshCw },
  ]

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
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`${theme === 'dark' ? 'bg-gray-800/60 backdrop-blur-glass border-gray-700/50' : 'bg-white/80 backdrop-blur-glass border-gray-200/50'} border-b shadow-sm sticky top-16 z-30`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold flex items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <ParkingCircle className="text-blue-600" size={32} />
                </motion.div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  Parking Dashboard
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Welcome back, {user?.email || 'User'}!
              </motion.p>
            </div>
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-lg shadow-blue-500/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw size={18} />
              </motion.div>
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mb-10"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={`p-6 rounded-2xl backdrop-blur-sm border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
              style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
              }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="absolute top-0 right-0 w-24 h-24 opacity-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <stat.icon size={96} />
              </motion.div>
              <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
              <motion.p
                className={`text-4xl font-bold ${stat.color}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
              >
                {stat.value}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Legend */}
        <div className="mb-8">
          <Legend theme={theme} />
        </div>

        {/* Slots Grid */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-6 flex items-center gap-2"
          >
            <Sparkles className="text-blue-600" size={24} />
            Available Parking Slots
            <motion.span
              className="text-sm font-normal text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ({slots.length} total slots)
            </motion.span>
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {slots.map((slot) => (
                <motion.div
                  key={slot.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, layout: { duration: 0.3 } }}
                >
                  <SlotCard
                    slot={slot}
                    onBook={handleBook}
                    theme={theme}
                    isBooked={bookedSlotsByUser.includes(slot.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Message if no slots available */}
        {availableCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-yellow-900/40 border-yellow-700/50' : 'bg-yellow-50 border-yellow-200'} border text-center backdrop-blur-sm`}
          >
            <p className={theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}>
              No available slots at the moment. Please check back soon!
            </p>
          </motion.div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && selectedSlot && (
          <BookingModal
            slotId={selectedSlot}
            onClose={() => {
              setShowModal(false)
              setSelectedSlot(null)
            }}
            onSubmit={handleBookingSubmit}
            theme={theme}
            calculatePrice={calculatePrice}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <Toast notification={notification} theme={theme} />
    </div>
  )
}

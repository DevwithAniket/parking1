import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParking } from '../context/ParkingContext'
import SlotCard from '../components/SlotCard'
import BookingModal from '../components/BookingModal'
import Legend from '../components/Legend'
import Toast from '../components/Toast'
import { ParkingCircle, RefreshCw } from 'lucide-react'

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
      showNotification(`Slot ${bookingData.slotId} booked successfully!`)
      setShowModal(false)
      setSelectedSlot(null)

      // Redirect to payment after 1 second
      setTimeout(() => {
        window.location.href = `/payment?slotId=${bookingData.slotId}&amount=${booking.price}&bookingId=${booking.id}`
      }, 1000)
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to book slot', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      await refreshSlots()
      showNotification('Slot status refreshed!')
    } catch {
      showNotification('Failed to refresh slots', 'error')
    }
  }

  const bookedSlotsByUser = bookings.filter(b => b.status === 'active').map(b => b.slotId)
  const availableCount = slots.filter(s => s.status === 'available').length
  const occupiedCount = slots.filter(s => s.status === 'occupied').length
  const bookedCount = slots.filter(s => s.status === 'booked').length

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ParkingCircle className="text-blue-600" size={32} />
                Parking Dashboard
              </h1>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome back, {user?.email || 'User'}!
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              AVAILABLE SLOTS
            </p>
            <p className="text-3xl font-bold text-green-600">{availableCount}</p>
          </div>
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              BOOKED SLOTS
            </p>
            <p className="text-3xl font-bold text-yellow-600">{bookedCount}</p>
          </div>
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              OCCUPIED SLOTS
            </p>
            <p className="text-3xl font-bold text-red-600">{occupiedCount}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-8">
          <Legend theme={theme} />
        </div>

        {/* Slots Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Parking Slots</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onBook={handleBook}
                theme={theme}
                isBooked={bookedSlotsByUser.includes(slot.id)}
              />
            ))}
          </div>
        </div>

        {/* Message if no slots available */}
        {availableCount === 0 && (
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border text-center`}>
            <p className={theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}>
              No available slots at the moment. Please check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
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
        />
      )}

      {/* Toast Notification */}
      <Toast notification={notification} theme={theme} />
    </div>
  )
}

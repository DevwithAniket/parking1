import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParking } from '../context/ParkingContext'
import { Calendar, Clock, DollarSign, X, Check } from 'lucide-react'

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
      showNotification('Booking cancelled successfully')
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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            View and manage your parking bookings
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Active Bookings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Active Bookings</h2>

          {activeBookings.length === 0 ? (
            <div className={`p-8 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No active bookings. <a href="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">Book a slot</a>
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md border-l-4 border-blue-600 hover:shadow-lg transition`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Slot Number
                      </p>
                      <p className="text-3xl font-bold">#{booking.slotId}</p>
                    </div>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
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

                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Completed Bookings</h2>

          {completedBookings.length === 0 ? (
            <div className={`p-8 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No completed bookings yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {completedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md border-l-4 border-green-600 opacity-75`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Slot Number
                      </p>
                      <p className="text-3xl font-bold">#{booking.slotId}</p>
                    </div>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Check size={16} />
                      Completed
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
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

                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Book Again
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

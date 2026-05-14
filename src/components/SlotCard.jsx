import React from 'react'
import { MapPin, Zap } from 'lucide-react'

export default function SlotCard({ slot, onBook, theme, isBooked = false }) {
  const getStatusColor = () => {
    switch (slot.status) {
      case 'available':
        return 'bg-green-500'
      case 'booked':
        return 'bg-yellow-500'
      case 'occupied':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    return slot.status.charAt(0).toUpperCase() + slot.status.slice(1)
  }

  return (
    <div
      className={`slot-card p-6 rounded-xl border-2 transition-all duration-300
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'}
        ${getStatusColor()} bg-opacity-10
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-600" />
          <div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Slot No.
            </p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {slot.id}
            </p>
          </div>
        </div>

        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusColor()}`}>
          <Zap className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white
          ${slot.status === 'available' ? 'bg-green-500' : slot.status === 'booked' ? 'bg-yellow-500' : 'bg-red-500'}
        `}
        >
          {getStatusText()}
        </span>
      </div>

      {slot.status === 'available' && !isBooked && (
        <button
          onClick={() => onBook(slot.id)}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
        >
          Book Now
        </button>
      )}

      {isBooked && (
        <div className="mt-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded-lg text-center text-sm font-medium">
          Booked
        </div>
      )}

      {slot.status === 'occupied' && (
        <div className="mt-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded-lg text-center text-sm font-medium">
          Occupied
        </div>
      )}

      {slot.status === 'booked' && !isBooked && (
        <div className="mt-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded-lg text-center text-sm font-medium">
          Reserved
        </div>
      )}
    </div>
  )
}

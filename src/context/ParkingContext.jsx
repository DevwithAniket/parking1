import React, { createContext, useState, useContext, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { apiService } from '../services/api'

const ParkingContext = createContext()

const MOCK_SLOTS = [
  { id: 1, status: 'available' },
  { id: 2, status: 'occupied' },
  { id: 3, status: 'available' },
  { id: 4, status: 'booked' },
  { id: 5, status: 'available' },
  { id: 6, status: 'available' },
]

export function ParkingProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [slots, setSlots] = useState(MOCK_SLOTS)
  const [bookings, setBookings] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    refreshSlots().catch(() => {
      showNotification('Could not connect to the backend server', 'error')
    })
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      refreshBookings().catch(() => {
        showNotification('Could not load your bookings', 'error')
      })
    } else {
      setBookings([])
    }
  }, [isAuthenticated])

  const refreshSlots = async () => {
    const response = await apiService.getSlots()
    setSlots(response.data)
  }

  const refreshBookings = async () => {
    const response = await apiService.getBookings()
    setBookings(response.data)
  }

  const bookSlot = async (slotId, duration, timeStart) => {
    const response = await apiService.bookSlot(slotId, duration, timeStart)
    const newBooking = response.data

    setSlots(prevSlots =>
      prevSlots.map(s =>
        s.id === slotId ? { ...s, status: 'booked' } : s
      )
    )

    setBookings(prevBookings => [...prevBookings, newBooking])
    return newBooking
  }

  const calculatePrice = (duration) => {
    return Math.ceil(duration * 5) // ₹5 per hour
  }

  const completeBooking = async (bookingId) => {
    const response = await apiService.cancelBooking(bookingId)
    const updatedBooking = response.data

    setBookings(prevBookings =>
      prevBookings.map(b =>
        b.id === bookingId ? updatedBooking : b
      )
    )

    if (updatedBooking) {
      setSlots(prevSlots =>
        prevSlots.map(s =>
          s.id === updatedBooking.slotId ? { ...s, status: 'available' } : s
        )
      )
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <ParkingContext.Provider
      value={{
        slots,
        bookings,
        notification,
        bookSlot,
        calculatePrice,
        completeBooking,
        refreshSlots,
        refreshBookings,
        showNotification,
      }}
    >
      {children}
    </ParkingContext.Provider>
  )
}

export const useParking = () => {
  const context = useContext(ParkingContext)
  if (!context) {
    throw new Error('useParking must be used within ParkingProvider')
  }
  return context
}

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartpark_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const apiService = {
  login: async (email, password) => {
    return api.post('/login', { email, password })
  },

  startRegistration: async (email, password, name) => {
    return api.post('/register/start', { email, password, name })
  },

  verifyRegistration: async (email, otp) => {
    return api.post('/register/verify', { email, otp })
  },

  me: async () => {
    return api.get('/me')
  },

  getSlots: async () => {
    return api.get('/slots')
  },

  bookSlot: async (slotId, duration, timeStart) => {
    return api.post('/bookings', { slotId, duration, timeStart })
  },

  getBookings: async () => {
    return api.get('/bookings')
  },

  processPayment: async (bookingId, amount) => {
    return api.post('/payment', { bookingId, amount })
  },

  cancelBooking: async (bookingId) => {
    return api.post(`/bookings/${bookingId}/cancel`)
  },
}

export default api

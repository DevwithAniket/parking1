import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useParking } from '../context/ParkingContext'
import { apiService } from '../services/api'
import { CreditCard, CheckCircle, Loader, Shield, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Payment() {
  const { theme } = useAuth()
  const { showNotification, bookSlot } = useParking()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  })

  const slotId = searchParams.get('slotId') || '1'
  const amount = searchParams.get('amount') || '50'

  // Get pending booking details from sessionStorage
  const pendingBooking = JSON.parse(sessionStorage.getItem('pendingBooking') || 'null')

  useEffect(() => {
    if (!pendingBooking) {
      navigate('/dashboard')
    }
  }, [pendingBooking, navigate])

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '')
    if (value.length <= 16) {
      value = value.replace(/(\d{4})/g, '$1 ').trim()
      setCardData({ ...cardData, cardNumber: value })
    }
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2)
      }
      setCardData({ ...cardData, expiryDate: value })
    }
  }

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length <= 3) {
      setCardData({ ...cardData, cvv: value })
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()

    if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
      showNotification('Please fill in all payment details', 'error')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Call the API to process payment (just records the payment)
      await apiService.processPayment('pending', amount)

      // Only after payment succeeds, create the actual booking
      const booking = await bookSlot(
        pendingBooking.slotId,
        pendingBooking.duration,
        pendingBooking.timeStart
      )

      setIsProcessing(false)
      setPaymentSuccess(true)
      showNotification('Payment successful! Booking confirmed.', 'success')

      // Clear pending booking from sessionStorage
      sessionStorage.removeItem('pendingBooking')

      // Redirect to my bookings after 3 seconds
      setTimeout(() => {
        navigate('/my-bookings')
      }, 3000)
    } catch (err) {
      setIsProcessing(false)
      showNotification(err.response?.data?.message || 'Payment failed. Please try again.', 'error')
    }
  }

  if (paymentSuccess) {
     return (
       <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Background celebration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-500 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`max-w-md w-full relative ${
            theme === 'dark'
              ? 'bg-gray-800/90 backdrop-blur-glass border border-gray-700/50'
              : 'bg-white/90 backdrop-blur-glass border border-gray-200/50'
          } rounded-3xl shadow-2xl p-8 glass-panel`}
        >
          <div className="mb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg shadow-green-500/30"
            >
              <CheckCircle className="text-white" size={40} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500"
            >
              Payment Successful!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Your booking for Slot {slotId} has been confirmed.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`p-5 rounded-2xl mb-6 ${theme === 'dark' ? 'bg-gray-700/60' : 'bg-blue-50/80'} border ${theme === 'dark' ? 'border-blue-700/50' : 'border-blue-200'}`}
          >
            <div className="flex justify-between mb-3">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Slot Number:</span>
              <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>#{slotId}</span>
            </div>
            <div className="flex justify-between">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Amount Paid:</span>
              <motion.span
                key={amount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="font-bold text-2xl text-green-600"
              >
                ₹{amount}
              </motion.span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-sm mb-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Redirecting to your bookings...
          </motion.p>

          <motion.button
            onClick={() => navigate('/my-bookings')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-blue-500/30"
          >
            View My Bookings
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (!pendingBooking) {
    return null
  }

   return (
     <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} py-8 px-4`}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/90'} backdrop-blur-glass rounded-3xl shadow-2xl p-8 glass-panel`}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CreditCard className="text-blue-600" size={28} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Payment Details
            </span>
          </h2>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            onSubmit={handlePaymentSubmit}
            className="space-y-5"
          >
            {/* Card Holder */}
            <motion.div whileFocus={{ scale: 1.01 }}>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Card Holder Name
              </label>
              <input
                type="text"
                value={cardData.cardHolder}
                onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700/60 border-gray-600/50 text-white placeholder-gray-400'
                    : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </motion.div>

            {/* Card Number */}
            <motion.div whileFocus={{ scale: 1.01 }}>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Card Number
              </label>
              <input
                type="text"
                value={cardData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700/60 border-gray-600/50 text-white placeholder-gray-400'
                    : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </motion.div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div whileFocus={{ scale: 1.01 }}>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardData.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700/60 border-gray-600/50 text-white placeholder-gray-400'
                      : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </motion.div>
              <motion.div whileFocus={{ scale: 1.01 }}>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  CVV
                </label>
                <input
                  type="password"
                  value={cardData.cvv}
                  onChange={handleCVVChange}
                  placeholder="123"
                  maxLength="3"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700/60 border-gray-600/50 text-white placeholder-gray-400'
                      : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </motion.div>
            </div>

            {/* Test Card Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-blue-900/40 border border-blue-700/50' : 'bg-blue-50/80 border border-blue-200'} backdrop-blur-sm`}
            >
              <p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                <Shield size={14} />
                Test Card Details:
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>
                Card: 4532 1234 5678 9010<br />
                Expiry: 12/25<br />
                CVV: 123
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isProcessing}
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Pay ₹{amount}
                </>
              )}
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className={`${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/90'} backdrop-blur-glass rounded-3xl shadow-2xl p-8 glass-panel`}>
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

             <div className={`mb-6 p-5 rounded-2xl ${theme === 'dark' ? 'bg-gray-700/60' : 'bg-gray-50/80'} backdrop-blur-sm`}>
               <div className="flex justify-between mb-4">
                 <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Slot Number</span>
                 <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>#{slotId}</span>
               </div>
               <div className="flex justify-between mb-4">
                 <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Duration</span>
                 <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{pendingBooking.duration} Hour(s)</span>
               </div>
               <div className="flex justify-between mb-4">
                 <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Start Time</span>
                 <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{pendingBooking.timeStart}</span>
               </div>
               <div className="flex justify-between mb-4">
                 <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Booking Amount</span>
                 <span className="font-bold text-blue-600">₹{amount}</span>
               </div>
               <motion.hr
                 initial={{ scaleX: 0 }}
                 animate={{ scaleX: 1 }}
                 transition={{ delay: 0.4, duration: 0.5 }}
                 className={`my-4 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
               />
               <div className="flex justify-between text-lg">
                 <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Total Amount</span>
                 <motion.span
                   key={amount}
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: 'spring', stiffness: 300 }}
                   className="font-bold text-blue-600"
                 >
                   ₹{amount}
                 </motion.span>
               </div>
             </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-700/50' : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'} backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                <Shield className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <p className={`text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
                  Your booking is secure and protected by industry-leading encryption.
                </p>
              </div>
            </motion.div>
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/90'} backdrop-blur-glass rounded-3xl shadow-2xl p-8 glass-panel`}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" size={20} />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                { q: 'Is my payment secure?', a: 'Yes, all transactions are encrypted and secure.' },
                { q: 'Can I cancel my booking?', a: 'Yes, you can cancel up to 30 minutes before your booking time.' },
                { q: 'What if I need extra time?', a: 'You can extend your booking from the My Bookings page.' },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <p className="font-semibold text-blue-600 mb-1">{faq.q}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

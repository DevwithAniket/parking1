import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useParking } from '../context/ParkingContext'
import { apiService } from '../services/api'
import { CreditCard, CheckCircle, Loader } from 'lucide-react'

export default function Payment() {
  const { theme } = useAuth()
  const { showNotification } = useParking()
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
  const bookingId = searchParams.get('bookingId')

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
      await new Promise(resolve => setTimeout(resolve, 1000))
      await apiService.processPayment(bookingId, amount)
      setIsProcessing(false)
      setPaymentSuccess(true)
      showNotification('Payment successful! Booking confirmed.')

      // Redirect to my bookings after 3 seconds
      setTimeout(() => {
        navigate('/my-bookings')
      }, 3000)
    } catch {
      setIsProcessing(false)
      showNotification('Payment failed. Please try again.', 'error')
    }
  }

  if (paymentSuccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 text-center animate-slide-in`}>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 animate-bounce-soft">
              <CheckCircle className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Your booking for Slot {slotId} has been confirmed.
          </p>

          <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <div className="flex justify-between mb-2">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Slot Number:</span>
              <span className="font-bold">#{slotId}</span>
            </div>
            <div className="flex justify-between">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Amount Paid:</span>
              <span className="font-bold text-green-600">₹{amount}</span>
            </div>
          </div>

          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Redirecting to your bookings...
          </p>

          <button
            onClick={() => navigate('/my-bookings')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            View My Bookings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 animate-slide-in`}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CreditCard className="text-blue-600" size={28} />
            Payment Details
          </h2>

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {/* Card Holder */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Card Holder Name
              </label>
              <input
                type="text"
                value={cardData.cardHolder}
                onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                placeholder="John Doe"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Card Number */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Card Number
              </label>
              <input
                type="text"
                value={cardData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardData.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  CVV
                </label>
                <input
                  type="password"
                  value={cardData.cvv}
                  onChange={handleCVVChange}
                  placeholder="123"
                  maxLength="3"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Test Card Info */}
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
              <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                Test Card Details:
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>
                Card: 4532 1234 5678 9010<br />
                Expiry: 12/25<br />
                CVV: 123
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
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
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

            <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between mb-4">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Slot Number</span>
                <span className="font-bold">#{slotId}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Booking Amount</span>
                <span className="font-bold text-blue-600">₹{amount}</span>
              </div>
              <hr className={`my-4 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold text-blue-600">₹{amount}</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
                ✓ Your booking is secure and protected by industry-leading encryption.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 mt-8`}>
            <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-blue-600 mb-1">Is my payment secure?</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Yes, all transactions are encrypted and secure.
                </p>
              </div>
              <div>
                <p className="font-semibold text-blue-600 mb-1">Can I cancel my booking?</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Yes, you can cancel up to 30 minutes before your booking time.
                </p>
              </div>
              <div>
                <p className="font-semibold text-blue-600 mb-1">What if I need extra time?</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  You can extend your booking from the My Bookings page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

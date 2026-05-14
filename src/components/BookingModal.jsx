import React, { useState } from 'react'
import { X, Clock, DollarSign } from 'lucide-react'

export default function BookingModal({ slotId, onClose, onSubmit, theme, calculatePrice }) {
  const [duration, setDuration] = useState(1)
  const [timeStart, setTimeStart] = useState('09:00')
  const [step, setStep] = useState(1)

  const price = calculatePrice(duration)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      onSubmit({ slotId, duration, timeStart, price })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-in`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Book Parking Slot</h2>
          <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              {/* Slot Number */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Slot Number
                </label>
                <input
                  type="text"
                  value={slotId}
                  disabled
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'} cursor-not-allowed`}
                />
              </div>

              {/* Start Time */}
              <div>
                <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Clock size={18} />
                  Start Time
                </label>
                <input
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration (Hours)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 6, 8].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setDuration(h)}
                      className={`flex-1 py-2 rounded-lg font-semibold transition ${
                        duration === h
                          ? 'bg-blue-600 text-white'
                          : `${theme === 'dark' ? 'bg-gray-800 border border-gray-600 hover:border-blue-500' : 'bg-gray-100 border border-gray-300 hover:border-blue-500'}`
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Estimate */}
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'} p-4 rounded-lg`}>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <DollarSign size={18} />
                    Estimated Price
                  </span>
                  <span className="text-2xl font-bold text-blue-600">₹{price}</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'} p-4 rounded-lg space-y-3`}>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Slot Number</p>
                  <p className="text-xl font-bold">{slotId}</p>
                </div>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Start Time</p>
                  <p className="text-xl font-bold">{timeStart}</p>
                </div>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Duration</p>
                  <p className="text-xl font-bold">{duration} Hour(s)</p>
                </div>
                <hr className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} />
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Price
                  </p>
                  <p className="text-2xl font-bold text-blue-600">₹{price}</p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {step === 1 ? 'Continue' : 'Proceed to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

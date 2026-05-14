import React, { useState } from 'react'
import { X, Clock, DollarSign, Calendar, Timer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BookingModal({ slotId, onClose, onSubmit, theme, calculatePrice, isLoading = false }) {
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

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${
            theme === 'dark'
              ? 'bg-gray-900/95 border border-gray-700/50'
              : 'bg-white/95 border border-gray-200/50'
          } backdrop-blur-xl`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255,255,255,0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex justify-between items-center p-6 border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
            >
              Book Parking Slot
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`p-2 rounded-xl transition ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
                  {/* Slot Number */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Calendar size={18} />
                      Slot Number
                    </label>
                    <motion.input
                      type="text"
                      value={slotId}
                      disabled
                      className={`w-full px-4 py-3 rounded-xl border text-lg font-bold text-center ${
                        theme === 'dark'
                          ? 'bg-gray-800/60 border-gray-600/50 text-gray-400'
                          : 'bg-gray-50 border-gray-300 text-gray-500'
                      } cursor-not-allowed`}
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Clock size={18} />
                      Start Time
                    </label>
                    <motion.input
                      type="time"
                      value={timeStart}
                      onChange={(e) => setTimeStart(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-lg ${
                        theme === 'dark'
                          ? 'bg-gray-800/60 border-gray-600/50 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className={`block text-sm font-semibold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Timer size={18} />
                      Duration (Hours)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 6, 8].map((h) => (
                        <motion.button
                          key={h}
                          type="button"
                          onClick={() => setDuration(h)}
                          className={`py-3 rounded-xl font-bold text-lg transition ${
                            duration === h
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                              : `${theme === 'dark' ? 'bg-gray-800/60 border border-gray-600/50 hover:border-blue-500' : 'bg-gray-100 border border-gray-300 hover:border-blue-500'}`
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {h}h
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Price Estimate */}
                  <motion.div
                    className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/40 to-cyan-900/40' : 'bg-gradient-to-r from-blue-50 to-cyan-50'} p-5 rounded-2xl border ${
                      theme === 'dark' ? 'border-blue-700/50' : 'border-blue-200'
                    }`}
                    layout
                  >
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-2 font-semibold text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <DollarSign size={20} />
                        Estimated Price
                      </span>
                      <motion.span
                        key={price}
                        initial={{ scale: 1.3, color: '#3b82f6' }}
                        animate={{ scale: 1, color: theme === 'dark' ? '#22d3ee' : '#3b82f6' }}
                        className="text-3xl font-bold text-blue-600"
                      >
                        ₹{price}
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30' : 'bg-gradient-to-r from-blue-50 to-cyan-50'} p-6 rounded-2xl border ${
                    theme === 'dark' ? 'border-blue-700/50' : 'border-blue-200'
                  } space-y-4`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Slot Number</p>
                      <p className="text-2xl font-bold">{slotId}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Start Time</p>
                      <p className="text-2xl font-bold">{timeStart}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Duration</p>
                      <p className="text-2xl font-bold">{duration} Hour(s)</p>
                    </motion.div>
                    <motion.hr
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-between"
                    >
                      <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total Price
                      </p>
                      <p className="text-3xl font-bold text-blue-600">₹{price}</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              {step === 2 && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Back
                </motion.button>
              )}
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all shadow-lg ${
                  step === 1
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                } shadow-blue-500/30 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                whileHover={{ scale: isLoading ? 1 : 1.03 }}
                whileTap={{ scale: isLoading ? 1 : 0.97 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </span>
                ) : step === 1 ? (
                  'Continue'
                ) : (
                  'Proceed to Payment'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

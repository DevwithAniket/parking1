import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, Car } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { login, startRegistration, verifyRegistration, theme } = useAuth()
  const navigate = useNavigate()

  const resetSignupState = () => {
    setOtp('')
    setOtpSent(false)
    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      setIsSubmitting(true)

      if (!isRegister) {
        if (!email || !password) {
          setError('Please fill in all fields')
          return
        }

        await login(email, password)
        navigate('/dashboard')
        return
      }

      if (!otpSent) {
        if (!email || !password || !name) {
          setError('Please fill in all fields')
          return
        }

        const response = await startRegistration(email, password, name)
        setOtpSent(true)
        setMessage(response.message || 'Verification OTP sent to your email.')

        if (response.devOtp) {
          setOtp(response.devOtp)
        }
        return
      }

      if (!otp) {
        setError('Please enter the OTP sent to your email')
        return
      }

      await verifyRegistration(email, otp)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
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

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`max-w-md w-full relative ${
          theme === 'dark'
            ? 'bg-gray-800/80 backdrop-blur-glass border border-gray-700/50'
            : 'bg-white/80 backdrop-blur-glass border border-gray-200/50'
        } rounded-3xl shadow-2xl p-8 glass-panel`}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        }}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex justify-center mb-4"
          >
            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50' : 'bg-gradient-to-br from-blue-100 to-cyan-100'}`}>
              <Car className="w-10 h-10 text-blue-600" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {isRegister && otpSent ? 'Verify your email to finish signup' : isRegister ? 'Join SmartPark today' : 'Log in to your account'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-red-500/20 border border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-green-500/20 border border-green-500/50 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {isRegister && !otpSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700/60 border-gray-600/50 text-white placeholder-gray-400'
                    : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </motion.div>
          )}

          {!otpSent && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700/60 border-gray-600/50 text-white placeholder-gray-400'
                      : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Lock size={16} />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700/60 border-gray-600/50 text-white placeholder-gray-400'
                        : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}

          {otpSent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email OTP
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700/60 border-gray-600/50 text-white placeholder-gray-400'
                    : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                We sent the OTP to {email}.
              </p>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-6"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Processing...
              </span>
            ) : isRegister && !otpSent ? (
              'Send OTP'
            ) : isRegister ? (
              'Verify & Create Account'
            ) : (
              'Sign In'
            )}
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <motion.button
            onClick={() => {
              setIsRegister(!isRegister)
              resetSignupState()
            }}
            whileHover={{ scale: 1.05 }}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </motion.button>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mt-8 p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-700/60 border border-gray-600/50' : 'bg-blue-50/80 border border-blue-200'} backdrop-blur-sm`}
        >
          <p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-blue-700'}`}>
            <Car size={14} />
            Demo Credentials:
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Email: demo@smartpark.com<br />
            Password: demo123
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

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

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4`}>
      <div
        className={`max-w-md w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 animate-slide-in`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {isRegister && otpSent ? 'Verify your email to finish signup' : isRegister ? 'Join SmartPark today' : 'Log in to your account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 bg-green-100 dark:bg-green-900 border border-green-400 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && !otpSent && (
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          )}

          {!otpSent && (
            <>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-3 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    ) : (
                      <Eye className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {otpSent && (
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email OTP
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                We sent the OTP to {email}.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition mt-6"
          >
            {isSubmitting
              ? 'Please wait...'
              : isRegister && !otpSent
                ? 'Send OTP'
                : isRegister
                  ? 'Verify & Create Account'
                  : 'Sign In'}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister)
              resetSignupState()
            }}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <div className={`mt-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-blue-200'}`}>
          <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Demo Credentials:
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Email: demo@smartpark.com<br />
            Password: demo123
          </p>
        </div>
      </div>
    </div>
  )
}

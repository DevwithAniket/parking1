import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Car, MapPin, Clock, CreditCard, Zap } from 'lucide-react'

export default function Landing() {
  const { theme } = useAuth()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <Car className="w-16 h-16 text-blue-600" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-blue-600">SmartPark</span>
          </h1>

          <p className={`text-xl mb-8 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            The future of parking is here. Smart, Fast, and Convenient IoT-powered parking management system.
          </p>

          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose SmartPark?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <MapPin className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Availability</h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Check available parking slots in real-time with live updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <Clock className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Book a parking slot in just a few clicks with flexible time options.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <CreditCard className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Multiple payment options with 100% secure transactions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <Zap className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Technology</h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                IoT sensors and intelligent algorithms for optimal parking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-600'} text-white text-center`}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Perfect Spot?</h2>
          <p className="text-lg mb-8">Join thousands of users who trust SmartPark for their parking needs.</p>
          <Link
            to="/login"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} py-8 text-center`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          © 2024 SmartPark. All rights reserved. | IoT Smart Parking System
        </p>
      </footer>
    </div>
  )
}

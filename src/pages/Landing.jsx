import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Car, MapPin, Clock, CreditCard, Zap } from 'lucide-react'
import { motion, useInView, useAnimation } from 'framer-motion'

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Availability',
    description: 'Check available parking slots in real-time with live updates.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    icon: Clock,
    title: 'Easy Booking',
    description: 'Book a parking slot in just a few clicks with flexible time options.',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Multiple payment options with 100% secure transactions.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
  {
    icon: Zap,
    title: 'Smart Technology',
    description: 'IoT sensors and intelligent algorithms for optimal parking.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

function FeatureCard({ feature, index }) {
  const controls = useAnimation()
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  React.useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={itemVariants}
      className={`p-6 rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group ${
        index % 2 === 0 ? 'lg:translate-y-0' : 'lg:translate-y-4'
      }`}
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
      }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <motion.div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${feature.bgColor}`}
        whileHover={{ rotate: 10, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      >
        <feature.icon className={feature.color} size={28} />
      </motion.div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
        {feature.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function Landing() {
  const { theme } = useAuth()
  const heroControls = useAnimation()
  const featuresControls = useAnimation()
  const ctaControls = useAnimation()
  const heroRef = React.useRef(null)
  const featuresRef = React.useRef(null)
  const ctaRef = React.useRef(null)

  const isHeroInView = useInView(heroRef, { once: true })
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: '-100px' })
  const isCtaInView = useInView(ctaRef, { once: true })

  React.useEffect(() => {
    if (isHeroInView) {
      heroControls.start('visible')
    }
  }, [isHeroInView, heroControls])

  React.useEffect(() => {
    if (isFeaturesInView) {
      featuresControls.start('visible')
    }
  }, [isFeaturesInView, featuresControls])

  React.useEffect(() => {
    if (isCtaInView) {
      ctaControls.start('visible')
    }
  }, [isCtaInView, ctaControls])

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`py-20 ${theme === 'dark' ? 'bg-gradient-radial from-blue-900/20 via-gray-900 to-gray-900' : 'bg-gradient-radial from-blue-50 via-white to-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate={heroControls}
            variants={heroVariants}
            className="flex justify-center mb-8"
          >
            <motion.div
              className={`p-6 rounded-3xl backdrop-blur-lg shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-700/30'
                  : 'bg-gradient-to-br from-blue-100/80 to-cyan-100/80 border border-blue-200/50'
              }`}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Car className="w-20 h-20 text-blue-600" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate={heroControls}
            variants={heroVariants}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Welcome to{' '}
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              SmartPark
            </motion.span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate={heroControls}
            variants={heroVariants}
            className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            The future of parking is here. Smart, Fast, and Convenient IoT-powered parking management system.
          </motion.p>

          <motion.div
            initial="hidden"
            animate={heroControls}
            variants={heroVariants}
          >
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg px-10 py-4 rounded-2xl transition transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial="hidden"
            animate={featuresControls}
            variants={heroVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Why Choose <span className="text-blue-600">SmartPark</span>?
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={featuresControls}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className={`py-16 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600'} text-white text-center relative overflow-hidden`}
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <motion.h2
            initial="hidden"
            animate={ctaControls}
            variants={ctaVariants}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Find Your Perfect Spot?
          </motion.h2>
          <motion.p
            initial="hidden"
            animate={ctaControls}
            variants={ctaVariants}
            className="text-lg md:text-xl mb-8 opacity-90"
          >
            Join thousands of users who trust SmartPark for their parking needs.
          </motion.p>
          <motion.div
            initial="hidden"
            animate={ctaControls}
            variants={ctaVariants}
          >
            <Link
              to="/login"
              className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-4 rounded-2xl transition shadow-xl shadow-black/10"
            >
              Sign Up Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} py-8 text-center border-t`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          © 2024 SmartPark. All rights reserved. | IoT Smart Parking System
        </p>
      </footer>
    </div>
  )
}

import React from 'react'
import { Circle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Legend({ theme }) {
  const items = [
    { color: 'green', fill: 'fill-green-500', text: 'text-green-500', label: 'Available - Ready to book' },
    { color: 'yellow', fill: 'fill-yellow-500', text: 'text-yellow-500', label: 'Booked - Reserved by user' },
    { color: 'red', fill: 'fill-red-500', text: 'text-red-500', label: 'Occupied - Currently in use' },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl backdrop-blur-sm shadow-lg border ${
        theme === 'dark'
          ? 'bg-gray-800/60 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
      } glass-panel`}
    >
      <motion.h3
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-lg font-bold mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-6 bg-blue-600 rounded-full" />
        Parking Status Legend
      </motion.h3>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <Circle className={`w-6 h-6 ${item.fill} ${item.text}`} />
            </motion.div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

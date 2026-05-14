import React from 'react'
import { Circle } from 'lucide-react'

export default function Legend({ theme }) {
  return (
    <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className="text-lg font-bold mb-4">Parking Status Legend</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Circle className="w-6 h-6 fill-green-500 text-green-500" />
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Available - Ready to book</span>
        </div>
        <div className="flex items-center gap-3">
          <Circle className="w-6 h-6 fill-yellow-500 text-yellow-500" />
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Booked - Reserved by user</span>
        </div>
        <div className="flex items-center gap-3">
          <Circle className="w-6 h-6 fill-red-500 text-red-500" />
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Occupied - Currently in use</span>
        </div>
      </div>
    </div>
  )
}

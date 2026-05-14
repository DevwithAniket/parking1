import React from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export default function Toast({ notification, theme }) {
  if (!notification) return null

  const isSuccess = notification.type === 'success'

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          isSuccess
            ? `${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'} border border-green-400`
            : `${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} border border-red-400`
        }`}
      >
        {isSuccess ? (
          <CheckCircle className="text-green-600" size={20} />
        ) : (
          <AlertCircle className="text-red-600" size={20} />
        )}
        <span className={isSuccess ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
          {notification.message}
        </span>
      </div>
    </div>
  )
}

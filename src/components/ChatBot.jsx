import React, { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, Bot, User, Minimize2, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const botResponses = {
  greetings: [
    "Hi there! 👋 I'm SmartBot, your parking assistant. How can I help you today?",
    "Hello! Welcome to SmartPark. What can I do for you?",
    "Hey! Need help with parking? I'm here for you!"
  ],
  booking: [
    "To book a parking slot:\n1. Go to Dashboard\n2. Select an available (green) slot\n3. Choose your duration and start time\n4. Complete payment\n\nIt's that simple! 🚗",
    "Booking is easy! Just pick a green slot on the dashboard, set your time, and pay. Need help with a specific step?",
  ],
  cancel: [
    "You can cancel a booking from the 'My Bookings' page. Just click the 'Cancel Booking' button on your active reservation.\n\nNote: Cancellations are free up to 30 minutes before your booking time.",
    "To cancel: Go to My Bookings → Find the active booking → Click 'Cancel Booking'. Easy!",
  ],
  payment: [
    "We accept all major credit/debit cards. Payment is secure and encrypted. After payment, your booking is confirmed instantly! 💳",
    "Payment is processed through our secure gateway. Once you complete payment, you'll see a success screen and your booking will appear in 'My Bookings'.",
  ],
  slots: [
    "🟢 Green = Available (ready to book)\n🟡 Yellow = Booked (reserved by someone)\n🔴 Red = Occupied (currently in use)\n\nOnly available slots can be booked!",
    "Green slots are free to book, yellow ones are taken by other users, and red means the spot is currently occupied.",
  ],
  default: [
    "I can help you with:\n• Booking a parking slot\n• Cancelling a reservation\n• Payment questions\n• Understanding slot statuses\n\nWhat would you like to know?",
    "I'm here to assist! You can ask me about:\n- How to book\n- How to cancel\n- Payment process\n- Slot colors meaning",
    "I'm SmartBot 🤖 Try asking:\n- 'How do I book?'\n- 'How to cancel?'\n- 'What do the colors mean?'",
  ]
}

function getBotResponse(userMessage) {
  const msg = userMessage.toLowerCase()

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('help')) {
    return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)]
  }
  if (msg.includes('book')) {
    return botResponses.booking[Math.floor(Math.random() * botResponses.booking.length)]
  }
  if (msg.includes('cancel')) {
    return botResponses.cancel[Math.floor(Math.random() * botResponses.cancel.length)]
  }
  if (msg.includes('pay') || msg.includes('payment') || msg.includes('card')) {
    return botResponses.payment[Math.floor(Math.random() * botResponses.payment.length)]
  }
  if (msg.includes('color') || msg.includes('slot') || msg.includes('status') || msg.includes('mean')) {
    return botResponses.slots[Math.floor(Math.random() * botResponses.slots.length)]
  }

  return botResponses.default[Math.floor(Math.random() * botResponses.default.length)]
}

export default function ChatBot({ theme }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm SmartBot 🤖\nAsk me anything about SmartPark!", sender: 'bot' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = { id: Date.now() + 1, text: getBotResponse(inputValue), sender: 'bot' }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const chatVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-colors ${isOpen ? 'hidden' : ''}`}
        aria-label="Open chatbot"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
              isMaximized ? 'w-[90vw] h-[80vh]' : 'w-96 h-[500px]'
            }`}
          >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SmartBot</h3>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className={`p-2 rounded-lg transition ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${
                    msg.sender === 'user' ? 'flex-row-reverse gap-2' : ''
                  }`}>
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600'
                        : theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                    } shadow-md`}>
                      {msg.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : theme === 'dark'
                          ? 'bg-gray-800 text-gray-200 rounded-tl-sm'
                          : 'bg-white text-gray-800 rounded-tl-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2"
                >
                  <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className={`p-3 rounded-2xl rounded-tl-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSend}
              className={`p-4 rounded-b-2xl ${
                theme === 'dark'
                  ? 'bg-gray-800 border-t border-gray-700'
                  : 'bg-white border-t border-gray-200'
              } shadow-lg`}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

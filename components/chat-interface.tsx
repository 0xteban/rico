"use client"

import { useState, useRef, useEffect } from "react"
import { AccountSelector } from "./account-selector"
import { ProfileMenu } from "./profile-menu"
import { MessageList } from "./message-list"
import { CameraOverlay } from "./camera-overlay"
import { ChatInput } from "./chat-input"
import { NewAccountModal } from "./new-account-modal"
import type { Message, Account } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function ChatInterface() {
  const { language, t } = useLanguage()
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account>({
    id: "1",
    name: "Manuel Barrantes",
    avatar: "M",
    type: "personal",
  })
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      name: "Manuel Barrantes",
      avatar: "M",
      type: "personal",
    },
    { id: "3", name: "Family Budget", avatar: "F", type: "shared" },
  ])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: {
        amount: 19.72,
        description: "Gym membership",
        vendor: "Smart Fit Guadalupe",
        date: "2025-03-19",
        categories: ["Health", "Fitness"],
      },
      timestamp: new Date("2025-03-19"),
      type: "expense",
    },
    {
      id: "2",
      content: {
        amount: 69.0,
        description: "Cancha 1 Hora 30 Min Padel, Alquiler Pala Padel",
        vendor: "Volea Padel & Pickleball Club",
        date: "2025-01-14",
        categories: ["Sports", "Recreation"],
      },
      timestamp: new Date("2025-01-14"),
      type: "expense",
    },
  ])
  const [showCamera, setShowCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize theme on component mount
  useEffect(() => {
    // Check if user has a saved preference or use system preference
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark")
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else if (prefersDark) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Save theme preference when it changes
  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    if (showCamera && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    }

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [showCamera, cameraStream])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: { text: message },
        timestamp: new Date(),
        type: "text",
        sender: "user",
      }
      setMessages([...messages, newMessage])

      // Simulate assistant response
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: {
            text:
              language === "en"
                ? "I've analyzed your spending patterns. Would you like to see a breakdown of your expenses by category?"
                : "He analizado tus patrones de gasto. ¿Te gustaría ver un desglose de tus gastos por categoría?",
          },
          timestamp: new Date(),
          type: "text",
          sender: "assistant",
        }
        setMessages((prev) => [...prev, responseMessage])
      }, 1000)
    }
  }

  const handleFileUpload = (file: File) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: { imageUrl: event.target?.result as string },
          timestamp: new Date(),
          type: "image",
          sender: "user",
        }
        setMessages([...messages, newMessage])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        setCameraStream(stream)
        setShowCamera(true)
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageUrl = canvas.toDataURL("image/png")
        const newMessage: Message = {
          id: Date.now().toString(),
          content: { imageUrl },
          timestamp: new Date(),
          type: "image",
          sender: "user",
        }

        setMessages([...messages, newMessage])
        setShowCamera(false)

        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop())
          setCameraStream(null)
        }
      }
    }
  }

  const closeCamera = () => {
    setShowCamera(false)
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  const handleCreateAccount = (accountData: {
    name: string
    description: string
    type: "personal" | "shared"
  }) => {
    const newAccount: Account = {
      id: (accounts.length + 1).toString(),
      name: accountData.name,
      avatar: accountData.name.charAt(0).toUpperCase(),
      type: accountData.type,
    }

    setAccounts([...accounts, newAccount])
    setSelectedAccount(newAccount)

    // Modal will handle closing itself for shared accounts (to show the invite link)
    if (accountData.type === "personal") {
      setIsNewAccountModalOpen(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-card rounded-b-xl shadow-md max-w-6xl mx-auto w-full">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
              Rico
            </h1>
          </Link>
        </div>

        <AccountSelector
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelectAccount={setSelectedAccount}
          onCreateAccount={() => setIsNewAccountModalOpen(true)}
        />

        <ProfileMenu selectedAccount={selectedAccount} theme={theme} onToggleTheme={toggleTheme} />
      </header>

      {/* Messages Container */}
      <MessageList messages={messages} />

      {/* Input Area */}
      <div className="max-w-6xl mx-auto w-full">
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          onCameraCapture={handleCameraCapture}
        />
      </div>

      {/* Camera Overlay */}
      {showCamera && (
        <CameraOverlay videoRef={videoRef} canvasRef={canvasRef} onClose={closeCamera} onCapture={capturePhoto} />
      )}

      {/* New Account Modal */}
      <NewAccountModal
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  )
}


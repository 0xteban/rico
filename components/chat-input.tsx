"use client"

import type * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Camera, Mic, Image, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onFileUpload?: (file: File) => void
  onCameraCapture?: () => void
}

export function ChatInput({ onSendMessage, onFileUpload, onCameraCapture }: ChatInputProps) {
  const { t } = useLanguage()
  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null) // Reference to store animation frame ID

  const quickOptions = [
    t("howMuchDidISpend"),
    t("showMyExpenses"),
    t("addATransaction"),
    t("mySpendingThisMonth"),
    t("budgetSummary"),
    t("recentTransactions"),
    t("savingsGoals"),
    t("investmentOverview"),
  ]

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputValue])

  // Enable horizontal scrolling with mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (suggestionsRef.current && e.deltaY !== 0) {
        e.preventDefault()
        suggestionsRef.current.scrollLeft += e.deltaY
        setIsUserInteracting(true)

        // Clear any existing timeout and set a new one to resume auto-scroll
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          setIsUserInteracting(false)
        }, 2000) // Increased timeout to 2 seconds
      }
    }

    // Track other user interactions
    const handleMouseDown = () => {
      setIsUserInteracting(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setIsUserInteracting(false)
      }, 2000)
    }

    const suggestionsEl = suggestionsRef.current
    if (suggestionsEl) {
      suggestionsEl.addEventListener("wheel", handleWheel, { passive: false })
      suggestionsEl.addEventListener("mousedown", handleMouseDown)
    }

    return () => {
      if (suggestionsEl) {
        suggestionsEl.removeEventListener("wheel", handleWheel)
        suggestionsEl.removeEventListener("mousedown", handleMouseDown)
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Auto-scroll the suggestions
  useEffect(() => {
    const suggestionsEl = suggestionsRef.current
    if (!suggestionsEl || inputValue.length > 0 || isUserInteracting) {
      // Cancel animation if already running
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return;
    }

    let scrollPosition = suggestionsEl.scrollLeft
    const scrollWidth = suggestionsEl.scrollWidth
    const clientWidth = suggestionsEl.clientWidth
    const maxScroll = scrollWidth - clientWidth
    const scrollSpeed = 0.5 // pixels per frame

    // Only scroll if there's overflow content
    if (scrollWidth <= clientWidth) return;

    const scroll = () => {
      if (!suggestionsEl) return;

      scrollPosition += scrollSpeed;

      // Check if we've reached the end and need to reset
      if (scrollPosition >= maxScroll) {
        // Loop back to the beginning
        scrollPosition = 0;
      }

      suggestionsEl.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(scroll);
    }

    // Start the animation
    animationRef.current = requestAnimationFrame(scroll);

    // Clean up
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [inputValue, isUserInteracting])

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue("")
      if (textareaRef.current) textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (inputValue.trim()) {
        onSendMessage(inputValue)
        setInputValue("")
        if (textareaRef.current) textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onFileUpload) onFileUpload(file)
  }

  const handleQuickOption = (option: string) => {
    setInputValue(option)
    if (textareaRef.current) textareaRef.current.focus()
  }

  return (
    <div className="p-4 bg-card rounded-t-xl shadow-inner">
      {inputValue.length === 0 && (
        <div className="mb-3 overflow-hidden relative">
          <div
            ref={suggestionsRef}
            className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {quickOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-sm rounded-full flex-shrink-0"
                onClick={() => handleQuickOption(option)}
              >
                {option} +
              </Button>
            ))}
            {quickOptions.map((option, index) => (
              <Button
                key={`duplicate-${index}`}
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-sm rounded-full flex-shrink-0"
                onClick={() => handleQuickOption(option)}
              >
                {option} +
              </Button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
        <div className="relative">
          <div className="flex flex-col w-full bg-background rounded-lg border border-input overflow-hidden">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("typeYourMessage")}
              className="w-full px-3 py-3 bg-transparent border-none focus:outline-none focus:ring-0 resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
              rows={1}
            />
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center space-x-4">
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <Mic className="h-5 w-5" />
                </button>
                <button type="button" className="text-muted-foreground hover:text-foreground" onClick={onCameraCapture}>
                  <Camera className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Image className="h-5 w-5" />
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="*/*" className="hidden" />
                </button>
              </div>
              <Button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-md px-4"
              >
                {t("send")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Search, Trash2, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

interface Memory {
  id: string
  text: string
  createdAt: Date
  isUserCreated?: boolean
}

export default function MemoriesPage() {
  const { t, language } = useLanguage()

  const [memories, setMemories] = useState<Memory[]>([
    {
      id: "1",
      text:
        language === "en"
          ? "I prefer to save 20% of my income each month"
          : "Prefiero ahorrar el 20% de mis ingresos cada mes",
      createdAt: new Date("2025-03-15"),
      isUserCreated: true,
    },
    {
      id: "2",
      text:
        language === "en"
          ? "My monthly budget for dining out is $300"
          : "Mi presupuesto mensual para comer fuera es de $300",
      createdAt: new Date("2025-03-10"),
      isUserCreated: true,
    },
  ])

  const [allSuggestedMemories] = useState<Memory[]>([
    {
      id: "s1",
      text:
        language === "en"
          ? "I want to be notified when I spend more than $100 in a single transaction"
          : "Quiero ser notificado cuando gaste más de $100 en una sola transacción",
      createdAt: new Date(),
    },
    {
      id: "s2",
      text:
        language === "en"
          ? "My salary is deposited on the 15th of each month"
          : "Mi salario se deposita el día 15 de cada mes",
      createdAt: new Date(),
    },
    {
      id: "s3",
      text:
        language === "en"
          ? "I'm saving for a vacation to Japan next year"
          : "Estoy ahorrando para unas vacaciones a Japón el próximo año",
      createdAt: new Date(),
    },
    {
      id: "s4",
      text:
        language === "en"
          ? "My rent payment is due on the 1st of each month"
          : "Mi pago de alquiler vence el día 1 de cada mes",
      createdAt: new Date(),
    },
  ])

  const [suggestedMemories, setSuggestedMemories] = useState<Memory[]>(allSuggestedMemories)
  const [newMemory, setNewMemory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  // Update memories text when language changes
  useEffect(() => {
    setMemories((prev) =>
      prev.map((memory) => ({
        ...memory,
        text:
          memory.id === "1"
            ? language === "en"
              ? "I prefer to save 20% of my income each month"
              : "Prefiero ahorrar el 20% de mis ingresos cada mes"
            : language === "en"
              ? "My monthly budget for dining out is $300"
              : "Mi presupuesto mensual para comer fuera es de $300",
      })),
    )
  }, [language])

  // Filter out suggested memories that have already been added
  useEffect(() => {
    const memoryTexts = memories.map((memory) => memory.text.toLowerCase())
    const filteredSuggestions = allSuggestedMemories.filter(
      (suggestion) => !memoryTexts.includes(suggestion.text.toLowerCase()),
    )
    setSuggestedMemories(filteredSuggestions)
  }, [memories, allSuggestedMemories, language])

  const addMemory = () => {
    if (newMemory.trim()) {
      const memory: Memory = {
        id: Date.now().toString(),
        text: newMemory.trim(),
        createdAt: new Date(),
        isUserCreated: true,
      }
      setMemories([memory, ...memories])
      setNewMemory("")
      setIsAdding(false)
    }
  }

  const addSuggestedMemory = (memory: Memory) => {
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
      isUserCreated: true,
    }
    setMemories([newMemory, ...memories])
  }

  const deleteMemory = (id: string) => {
    setMemories(memories.filter((memory) => memory.id !== id))
  }

  const filteredMemories = memories.filter((memory) => memory.text.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-card shadow-sm">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{t("memories")}</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchMemories")}
            className="pl-10 bg-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Add Memory Form */}
        {isAdding && (
          <div className="bg-card rounded-lg p-4 mb-4 shadow-sm">
            <h3 className="font-medium mb-2">{t("addNewMemory")}</h3>
            <div className="space-y-3">
              <Input
                placeholder={
                  language === "en"
                    ? "Enter something you want Rico to remember..."
                    : "Ingresa algo que quieras que Rico recuerde..."
                }
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={addMemory}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {t("save")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Your Memories */}
        {filteredMemories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">{t("yourMemories")}</h2>
            <div className="space-y-3">
              {filteredMemories.map((memory) => (
                <motion.div
                  key={memory.id}
                  className="bg-card rounded-lg p-4 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between">
                    <p>{memory.text}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMemory(memory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("addedOn")} {memory.createdAt.toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Memories */}
        {!searchQuery && suggestedMemories.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <h2 className="text-lg font-medium">{t("suggestedMemories")}</h2>
              <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
            </div>
            <div className="space-y-3">
              {suggestedMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="bg-muted/50 rounded-lg p-4 border border-dashed border-muted-foreground/30"
                >
                  <div className="flex justify-between">
                    <p>{memory.text}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80"
                      onClick={() => addSuggestedMemory(memory)}
                    >
                      {t("add")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredMemories.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("noMemoriesMatch")}</p>
          </div>
        )}

        {filteredMemories.length === 0 && !searchQuery && !isAdding && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("noMemoriesYet")}</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("addYourFirstMemory")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


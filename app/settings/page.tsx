"use client"

import { useState } from "react"
import { ArrowLeft, HelpCircle, Moon, Sun, Send, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/contexts/language-context"

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const [darkMode, setDarkMode] = useState(true)

  const toggleTheme = () => {
    const newTheme = !darkMode
    setDarkMode(newTheme)
    document.documentElement.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center p-4 bg-card shadow-sm">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">{t("settings")}</h1>
      </header>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="space-y-4">
          {/* Appearance */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <h3 className="font-medium p-4 border-b border-border">{t("appearance")}</h3>

            <div className="divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-muted-foreground mr-3" />
                  ) : (
                    <Moon className="h-5 w-5 text-muted-foreground mr-3" />
                  )}
                  <span>{darkMode ? t("lightTheme") : t("darkTheme")}</span>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleTheme} />
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <span className="h-5 w-5 text-muted-foreground mr-3 flex items-center justify-center">
                    {language === "en" ? "🇺🇸" : "🇪🇸"}
                  </span>
                  <span>{t("language")}</span>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                    <span className="mr-2">{language === "en" ? "English" : "Español"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <h3 className="font-medium p-4 border-b border-border">{t("helpSupport")}</h3>

            <div className="divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-muted-foreground mr-3" />
                  <span>{t("helpCenter")}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Bug className="h-5 w-5 text-muted-foreground mr-3" />
                  <span>{t("reportBug")}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Send className="h-5 w-5 text-muted-foreground mr-3" />
                  <span>{t("sendFeedback")}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">Rico v1.0.0</p>
            <p className="text-muted-foreground text-xs mt-1">© 2025 Rico Financial</p>
          </div>
        </div>
      </div>
    </div>
  )
}


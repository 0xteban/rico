"use client"

import { useState } from "react"
import { ArrowLeft, Camera, Edit2, LogOut, Mail, Phone, User } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function ProfilePage() {
  const { t } = useLanguage()
  const [user] = useState({
    name: "Manuel Barrantes",
    email: "manuel@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "M",
  })

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
          <h1 className="text-xl font-bold">{t("profile")}</h1>
        </div>
        <Button variant="ghost" size="sm" className="text-red-500">
          <LogOut className="h-4 w-4 mr-2" />
          {t("logout")}
        </Button>
      </header>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center mb-8 mt-6">
          <div className="relative">
            <Avatar className="h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
              <span>{user.avatar}</span>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-bold mt-4">{user.name}</h2>
          <p className="text-muted-foreground">Personal Account</p>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">{t("personalInformation")}</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <Edit2 className="h-4 w-4 mr-2" />
                {t("edit")}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("name")}</p>
                  <p>{user.name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("email")}</p>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("phone")}</p>
                  <p>{user.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-4">{t("accountSecurity")}</h3>
            <Button variant="outline" className="w-full justify-start">
              {t("changePassword")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


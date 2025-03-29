"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "es"

type Translations = {
  [key: string]: {
    en: string
    es: string
  }
}

// Common translations
const translations: Translations = {
  // Navigation and headers
  profile: { en: "Profile", es: "Perfil" },
  settings: { en: "Settings", es: "Configuración" },
  memories: { en: "Memories", es: "Recuerdos" },
  personalize: { en: "Personalize", es: "Personalizar" },
  logout: { en: "Logout", es: "Cerrar sesión" },

  // Settings
  appearance: { en: "Appearance", es: "Apariencia" },
  darkTheme: { en: "Dark theme", es: "Tema oscuro" },
  lightTheme: { en: "Light theme", es: "Tema claro" },
  language: { en: "Language", es: "Idioma" },
  english: { en: "English", es: "Inglés" },
  spanish: { en: "Spanish", es: "Español" },
  notifications: { en: "Notifications", es: "Notificaciones" },
  pushNotifications: { en: "Push Notifications", es: "Notificaciones push" },
  privacySecurity: { en: "Privacy & Security", es: "Privacidad y seguridad" },
  privacySettings: { en: "Privacy Settings", es: "Configuración de privacidad" },
  security: { en: "Security", es: "Seguridad" },
  helpSupport: { en: "Help & Support", es: "Ayuda y soporte" },
  helpCenter: { en: "Help Center", es: "Centro de ayuda" },
  reportBug: { en: "Report a bug", es: "Reportar un error" },
  sendFeedback: { en: "Send feedback", es: "Enviar comentarios" },
  faq: { en: "FAQ", es: "Preguntas frecuentes" },

  // Profile
  personalInformation: { en: "Personal Information", es: "Información personal" },
  edit: { en: "Edit", es: "Editar" },
  name: { en: "Name", es: "Nombre" },
  email: { en: "Email", es: "Correo electrónico" },
  phone: { en: "Phone", es: "Teléfono" },
  accountSecurity: { en: "Account Security", es: "Seguridad de la cuenta" },
  changePassword: { en: "Change Password", es: "Cambiar contraseña" },

  // Memories
  addNewMemory: { en: "Add New Memory", es: "Añadir nuevo recuerdo" },
  yourMemories: { en: "Your Memories", es: "Tus recuerdos" },
  suggestedMemories: { en: "Suggested Memories", es: "Recuerdos sugeridos" },
  searchMemories: { en: "Search memories...", es: "Buscar recuerdos..." },
  noMemoriesYet: { en: "No memories yet", es: "Aún no hay recuerdos" },
  addYourFirstMemory: { en: "Add Your First Memory", es: "Añade tu primer recuerdo" },
  noMemoriesMatch: { en: "No memories match your search", es: "Ningún recuerdo coincide con tu búsqueda" },
  addedOn: { en: "Added on", es: "Añadido el" },
  add: { en: "Add", es: "Añadir" },
  cancel: { en: "Cancel", es: "Cancelar" },
  save: { en: "Save", es: "Guardar" },

  // Chat
  typeYourMessage: { en: "Type your message here...", es: "Escribe tu mensaje aquí..." },
  send: { en: "Send", es: "Enviar" },
  takeAPhoto: { en: "Take a photo", es: "Tomar una foto" },

  // Placeholders
  askMeAnything: { en: "Ask me anything...", es: "Pregúntame lo que quieras..." },
  howMuchDidISpend: { en: "How much did I spend?", es: "¿Cuánto gasté?" },
  showMyExpenses: { en: "Show my expenses", es: "Muestra mis gastos" },
  addATransaction: { en: "Add a transaction", es: "Añadir una transacción" },
  mySpendingThisMonth: { en: "My spending this month", es: "Mis gastos este mes" },
  budgetSummary: { en: "Budget summary", es: "Resumen de presupuesto" },
  recentTransactions: { en: "Recent transactions", es: "Transacciones recientes" },
  savingsGoals: { en: "Savings goals", es: "Objetivos de ahorro" },
  investmentOverview: { en: "Investment overview", es: "Resumen de inversiones" },

  // Account Management
  createNewAccount: { en: "Create New Account", es: "Crear Nueva Cuenta" },
  createNewAccountDescription: {
    en: "Create a new account to manage your finances separately.",
    es: "Crea una nueva cuenta para gestionar tus finanzas por separado.",
  },
  accountType: { en: "Account Type", es: "Tipo de Cuenta" },
  personal: { en: "Personal", es: "Personal" },
  shared: { en: "Shared", es: "Compartida" },
  accountName: { en: "Account Name", es: "Nombre de la Cuenta" },
  description: { en: "Description", es: "Descripción" },
  optional: { en: "optional", es: "opcional" },
  createAccount: { en: "Create Account", es: "Crear Cuenta" },
  personalAccountDescription: {
    en: "Personal accounts are for individual use only. All data is private to you.",
    es: "Las cuentas personales son solo para uso individual. Todos los datos son privados para ti.",
  },
  sharedAccountDescription: {
    en: "Shared accounts allow multiple users to collaborate. Perfect for couples sharing expenses and group trips.",
    es: "Las cuentas compartidas permiten la colaboración de múltiples usuarios. Perfectas para parejas que comparten gastos y viajes en grupo.",
  },
  personalAccountNamePlaceholder: { en: "e.g. My Personal Account", es: "ej. Mi Cuenta Personal" },
  sharedAccountNamePlaceholder: { en: "e.g. Family Expenses", es: "ej. Gastos Familiares" },
  personalAccountDescriptionPlaceholder: { en: "e.g. My personal finances", es: "ej. Mis finanzas personales" },
  sharedAccountDescriptionPlaceholder: {
    en: "e.g. Shared expenses with family",
    es: "ej. Gastos compartidos con la familia",
  },
  sharedAccountNote: {
    en: "After creating the account, you'll get a shareable link to invite others.",
    es: "Después de crear la cuenta, obtendrás un enlace para invitar a otros.",
  },
  inviteMembers: { en: "Invite Members", es: "Invitar Miembros" },
  accountCreatedSuccessfully: {
    en: "Account created successfully! Share this link with others to invite them to this account.",
    es: "¡Cuenta creada con éxito! Comparte este enlace con otros para invitarlos a esta cuenta.",
  },
  shareThisLink: { en: "Share this link", es: "Comparte este enlace" },
  copy: { en: "Copy", es: "Copiar" },
  copied: { en: "Copied!", es: "¡Copiado!" },
  done: { en: "Done", es: "Listo" },
  inviteLinkDescription: {
    en: "Anyone with this link can join this account. The link will expire in 7 days for security.",
    es: "Cualquier persona con este enlace puede unirse a esta cuenta. El enlace caducará en 7 días por seguridad.",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Initialize language from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language]
    }
    console.warn(`Translation missing for key: ${key}`)
    return key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}


"use client";

import React, { createContext, useContext, useState } from "react";

type Language = "en" | "es";

interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

export const translations: Translations = {
  "nav.store": {
    en: "Store",
    es: "Tienda",
  },
  "nav.dashboard": {
    en: "Dashboard",
    es: "Panel de Control",
  },
  "store.title": {
    en: "Our Products",
    es: "Nuestros Productos",
  },
  "store.cart": {
    en: "Cart",
    es: "Carrito",
  },
  "store.cart.empty": {
    en: "Your cart is empty",
    es: "Tu carrito está vacío",
  },
  "store.cart.total": {
    en: "Total",
    es: "Total",
  },
  "store.cart.checkout": {
    en: "Checkout",
    es: "Pagar",
  },
  "store.cart.remove": {
    en: "Remove",
    es: "Eliminar",
  },
  "store.product.addToCart": {
    en: "Add to Cart",
    es: "Añadir al Carrito",
  },
  "store.product.platonic.title": {
    en: "Platonic Solids Set",
    es: "Set de Sólidos Platónicos",
  },
  "store.product.platonic.description": {
    en: "A complete set of all five Platonic solids: tetrahedron, cube, octahedron, dodecahedron, and icosahedron.",
    es: "Un set completo de los cinco sólidos platónicos: tetraedro, cubo, octaedro, dodecaedro e icosaedro.",
  },
  "store.product.rose.title": {
    en: "Rose Essence",
    es: "Esencia de Rosa",
  },
  "store.product.rose.description": {
    en: "Pure rose flower essence for emotional balance and heart healing.",
    es: "Esencia pura de rosa para el equilibrio emocional y la sanación del corazón.",
  },
  "store.product.sacred.title": {
    en: "Sacred Geometry Set",
    es: "Set de Geometría Sagrada",
  },
  "store.product.sacred.description": {
    en: "Advanced geometric shapes including the Merkaba, Flower of Life, and more.",
    es: "Formas geométricas avanzadas incluyendo Merkaba, Flor de la Vida y más.",
  },
  "store.product.lavender.title": {
    en: "Lavender Essence",
    es: "Esencia de Lavanda",
  },
  "store.product.lavender.description": {
    en: "Calming lavender essence for relaxation and stress relief.",
    es: "Esencia calmante de lavanda para relajación y alivio del estrés.",
  },
  "store.category.geometry": {
    en: "3D Geometry",
    es: "Geometría 3D",
  },
  "store.category.essence": {
    en: "Flower Essence",
    es: "Esencia Floral",
  },
  "hero.title": {
    en: "Sacred Geometry & Healing Essences",
    es: "Geometría Sagrada & Esencias Sanadoras",
  },
  "hero.subtitle": {
    en: "Discover the perfect harmony between sacred geometric forms and the healing power of flower essences.",
    es: "Descubre la perfecta armonía entre las formas geométricas sagradas y el poder sanador de las esencias florales.",
  },
  "hero.cta": {
    en: "Explore Our Collection",
    es: "Explora Nuestra Colección",
  },
  "features.title": {
    en: "Why Choose Us",
    es: "Por Qué Elegirnos",
  },
  "features.geometry.title": {
    en: "Sacred Geometry",
    es: "Geometría Sagrada",
  },
  "features.geometry.description": {
    en: "Handcrafted geometric forms that embody universal patterns of creation.",
    es: "Formas geométricas artesanales que encarnan patrones universales de la creación.",
  },
  "features.essences.title": {
    en: "Flower Essences",
    es: "Esencias Florales",
  },
  "features.essences.description": {
    en: "Pure, natural essences that promote emotional and spiritual well-being.",
    es: "Esencias naturales puras que promueven el bienestar emocional y espiritual.",
  },
  "features.harmony.title": {
    en: "Holistic Harmony",
    es: "Armonía Holística",
  },
  "features.harmony.description": {
    en: "The perfect blend of form and essence for complete spiritual alignment.",
    es: "La mezcla perfecta de forma y esencia para un alineamiento espiritual completo.",
  },
  "cta.title": {
    en: "Ready to Begin Your Journey?",
    es: "¿Listo para Comenzar tu Viaje?",
  },
  "cta.description": {
    en: "Join us in exploring the intersection of sacred geometry and natural healing.",
    es: "Únete a nosotros en la exploración de la intersección entre la geometría sagrada y la sanación natural.",
  },
  "cta.shop": {
    en: "Shop Now",
    es: "Comprar Ahora",
  },
  "cta.signin": {
    en: "Sign In",
    es: "Iniciar Sesión",
  },
  "auth.register.title": {
    en: "Register",
    es: "Registrarse",
  },
  "auth.register.description": {
    en: "Create a new account to start shopping",
    es: "Crea una nueva cuenta para empezar a comprar",
  },
  "auth.register.name": {
    en: "Full Name",
    es: "Nombre Completo",
  },
  "auth.register.email": {
    en: "Email",
    es: "Correo Electrónico",
  },
  "auth.register.password": {
    en: "Password",
    es: "Contraseña",
  },
  "auth.register.confirmPassword": {
    en: "Confirm Password",
    es: "Confirmar Contraseña",
  },
  "auth.register.submit": {
    en: "Create Account",
    es: "Crear Cuenta",
  },
  "auth.register.haveAccount": {
    en: "Already have an account?",
    es: "¿Ya tienes una cuenta?",
  },
  "auth.register.login": {
    en: "Login here",
    es: "Inicia sesión aquí",
  },
  "validation.nameRequired": {
    en: "Name is required",
    es: "El nombre es requerido",
  },
  "validation.emailRequired": {
    en: "Email is required",
    es: "El correo electrónico es requerido",
  },
  "validation.invalidEmail": {
    en: "Invalid email format",
    es: "Formato de correo electrónico inválido",
  },
  "validation.passwordRequired": {
    en: "Password is required",
    es: "La contraseña es requerida",
  },
  "validation.passwordLength": {
    en: "Password must be at least 6 characters",
    es: "La contraseña debe tener al menos 6 caracteres",
  },
  "validation.passwordsMatch": {
    en: "Passwords do not match",
    es: "Las contraseñas no coinciden",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (languageCode: string) => void;
  translate: (key: string, fallback?: string) => string;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation cache
const translationCache: Record<string, Record<string, string>> = {};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguageCode = localStorage.getItem('preferredLanguage');
    if (savedLanguageCode) {
      const savedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguageCode);
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      }
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('preferredLanguage', languageCode);
    }
  };

  // Synchronous translate function for immediate use (uses cache or fallback)
  const translateSync = (key: string, fallback: string = key): string => {
    if (currentLanguage.code === 'en') {
      return fallback;
    }

    const cacheKey = `${key}_${currentLanguage.code}`;
    return translationCache[cacheKey] || fallback;
  };

  // Async function to load translations (can be called later)
  const loadTranslation = async (text: string, targetLanguage: string = currentLanguage.code): Promise<string> => {
    // Return original text if it's English or no translation needed
    if (targetLanguage === 'en' || !text.trim()) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${targetLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      setIsTranslating(true);
      
      // Use OpenAI for translation
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          context: 'crypto_trading_education'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const translation = data.translation || text;
        
        // Cache the translation
        translationCache[cacheKey] = translation;
        
        return translation;
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }

    return text; // Fallback to original text
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        changeLanguage, 
        translate: translateSync, 
        isTranslating 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
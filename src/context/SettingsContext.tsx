
import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'PKR' | 'USD';

interface SettingsContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number;
  formatPrice: (price: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('craftroot_currency') as Currency) || 'PKR';
  });

  const exchangeRate = 0.0036; // Mock rate: 1 PKR = 0.0036 USD

  useEffect(() => {
    localStorage.setItem('craftroot_currency', currency);
  }, [currency]);

  const formatPrice = (price: number) => {
    if (currency === 'USD') {
      const usdPrice = price * exchangeRate;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(usdPrice);
    }
    return `Rs. ${new Intl.NumberFormat('en-PK').format(price)}`;
  };

  return (
    <SettingsContext.Provider value={{ currency, setCurrency, exchangeRate, formatPrice }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'electric' | 'midnight' | 'solar' | 'boreal';

interface ThemeColors {
    primary: string;
    secondary: string;
    logoBg: string;
}

const themes: Record<ThemeType, ThemeColors> = {
    electric: { primary: '#8b5cf6', secondary: '#84cc16', logoBg: '#1e1b4b' },
    midnight: { primary: '#2563eb', secondary: '#22d3ee', logoBg: '#0f172a' },
    solar: { primary: '#f97316', secondary: '#facc15', logoBg: '#431407' },
    boreal: { primary: '#059669', secondary: '#2dd4bf', logoBg: '#064e3b' },
};

interface ThemeContextType {
    currentTheme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [currentTheme, setCurrentThemeState] = useState<ThemeType>('electric');

    useEffect(() => {
        const savedTheme = localStorage.getItem('myarc-theme') as ThemeType;
        if (savedTheme && themes[savedTheme]) {
            setCurrentThemeState(savedTheme);
        }
    }, []);

    const setTheme = (theme: ThemeType) => {
        setCurrentThemeState(theme);
        localStorage.setItem('myarc-theme', theme);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme, colors: themes[currentTheme] }}>
            <div
                style={{
                    '--primary': themes[currentTheme].primary,
                    '--secondary': themes[currentTheme].secondary,
                    '--logo-bg': themes[currentTheme].logoBg,
                } as any}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

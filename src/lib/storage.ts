export interface UserSettings {
    kaineEmail: string;
    kelvinEmail: string;
}

export interface Declaration {
    id: number;
    text: string;
    author: 'Kaine' | 'Kelvin';
    timestamp: string;
}

const SETTINGS_KEY = 'kake_settings';
const DECLARATIONS_KEY = 'kake_declarations_local'; // For local history cache

export function getSettings(): UserSettings {
    if (typeof window === 'undefined') return { kaineEmail: '', kelvinEmail: '' };

    const stored = localStorage.getItem(SETTINGS_KEY);
    const defaults = {
        kaineEmail: 'kaine.vic.kg@gmail.com',
        kelvinEmail: 'kelvinedimeh@gmail.com'
    };

    if (!stored) return defaults;

    try {
        const parsed = JSON.parse(stored);
        return {
            kaineEmail: parsed.kaineEmail || defaults.kaineEmail,
            kelvinEmail: parsed.kelvinEmail || defaults.kelvinEmail
        };
    } catch {
        return defaults;
    }
}

export function saveSettings(settings: UserSettings) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Helper to cache declarations locally for the HistoryList component
// In a real app, this might come from the API, but the user's code implies a synchronous getDeclarations
export function getDeclarations(): Declaration[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(DECLARATIONS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function getLatestDeclaration(): Declaration | null {
    const declarations = getDeclarations();
    return declarations.length > 0 ? declarations[0] : null;
}

export function saveDeclaration(text: string, author: 'Kaine' | 'Kelvin'): Declaration {
    const newDecl: Declaration = {
        id: Date.now(),
        text,
        author,
        timestamp: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
        const current = getDeclarations();
        const updated = [newDecl, ...current].slice(0, 50);
        localStorage.setItem(DECLARATIONS_KEY, JSON.stringify(updated));
    }

    return newDecl;
}

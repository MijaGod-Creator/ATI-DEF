/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#3b82f6",      // Blue-500
                "primary-hover": "#2563eb", // Blue-600
                "background-light": "#f8fafc", // Slate-50
                "background-dark": "#0f172a",  // Slate-900
                "card-dark": "#1e293b",        // Slate-800
                "text-secondary": "#94a3b8",   // Slate-400
                "border-dark": "#334155",      // Slate-700
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}

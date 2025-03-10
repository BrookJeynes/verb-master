/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            "blue": "#0BABF5",
            "red": "#FF2A2E",
            "lightred": "#FFF3F4",
            "redhover": "#F80004",
            "green": "#61E220",
            "darkgreen": "#50BE19",
            "lightgreen": "#F6FDF2",
            "greenhover": "#58D11B",
            "platinum": "#D5D5D5",
            "lightgray": "#FAFAFA",
            "darkgray": "#4B4B4B",
            "black": "#000000",
            "offblack": "#1A1A1A",
            "jet": "#282828",
            "yellow": "#FFE437",
            "white": "#FFFFFF",
            "whitehover": "#FDFBFB",
        },
        extend: {
            animation: {
                shake: 'shake 0.4s ease-in-out',
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-5px)' },
                    '50%': { transform: 'translateX(5px)' },
                    '75%': { transform: 'translateX(-5px)' },
                },
            },
        },
    },
    plugins: [],
}


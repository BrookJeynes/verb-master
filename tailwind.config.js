/** @type {import('tailwindcss').Config} */
export default {
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
            "platinum": "#E6E6E6",
            "lightgray": "#FAFAFA",
            "darkgray": "#4B4B4B",
            "black": "#000000",
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


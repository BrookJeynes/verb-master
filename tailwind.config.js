/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            "blue": "#1CB0F6",
            "red": "#FF5B5D",
            "redhover": "#FF2A2E",
            "green": "#7CE745",
            "greenhover": "#61E220",
            "platinum": "#E6E6E6",
            "lightgray": "#FAFAFA",
            "darkgray": "#4B4B4B",
            "black": "#000000",
            "white": "#FFFFFF",
            "whitehover": "#FDFDFD",
        },
        extend: {},
    },
    plugins: [],
}


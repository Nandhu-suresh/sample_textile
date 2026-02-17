/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#f8f5f2',    // --primary-color
                'secondary': '#2c2c2c',  // --secondary-color
                'accent': '#d4af37',     // --accent-color
                'text': '#333333',       // --text-color
                'light-gray': '#ecf0f1', // --light-gray
            },
            fontFamily: {
                'playfair': ['"Playfair Display"', 'serif'], // --font-heading
                'lato': ['"Lato"', 'sans-serif'],            // --font-body
                'dancing': ['"Dancing Script"', 'cursive'],
            }
        },
    },
    plugins: [],
}

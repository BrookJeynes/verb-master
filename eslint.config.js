import js from '@eslint/js'
import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tailwind from "eslint-plugin-tailwindcss";

export default tseslint.config(
    { ignores: ['dist', 'external'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-refresh': reactRefresh,
        },
        rules: {
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "semi": ["error", "always"],
            "quotes": [2, "double"],
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
    ...tailwind.configs["flat/recommended"],
)

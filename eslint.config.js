import js from '@eslint/js';  
import globals from 'globals';  
import babelParser from '@babel/eslint-parser';  
import react from 'eslint-plugin-react';  
import reactHooks from 'eslint-plugin-react-hooks';  
import reactRefresh from 'eslint-plugin-react-refresh';  
import jest from 'eslint-plugin-jest'; // Import Jest plugin  

export default [  
  {  
    ignores: ['dist'],  
  },  
  {  
    files: ['**/*.{js,jsx}'],  
    languageOptions: {  
      ecmaVersion: 2020,  
      globals: {  
        ...globals.browser,  
        ...globals.node,  
        ...globals.jest, // Add Jest globals  
      },  
      parser: babelParser,  
      parserOptions: {  
        ecmaVersion: 'latest',  
        ecmaFeatures: { jsx: true },  
        sourceType: 'module',  
        requireConfigFile: false,  
        babelOptions: {  
          presets: ['@babel/preset-env', '@babel/preset-react'],  
        },  
      },  
    },  
    settings: {  
      react: { version: '18.3' },  
    },  
    plugins: {  
      react,  
      'react-hooks': reactHooks,  
      'react-refresh': reactRefresh,  
      jest, // Add Jest plugin  
    },  
    rules: {  
      ...js.configs.recommended.rules,  
      ...react.configs.recommended.rules,  
      ...react.configs['jsx-runtime'].rules,  
      ...reactHooks.configs.recommended.rules,  
      ...jest.configs.recommended.rules, // Add Jest recommended rules  
      'react/jsx-no-target-blank': 'off',  
      'react-refresh/only-export-components': [  
        'warn',  
        { allowConstantExport: true },  
      ], // Custom rule for react-refresh  
    },  
  },  
];  
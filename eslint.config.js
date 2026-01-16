import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import securityPlugin from 'eslint-plugin-security';
import globals from 'globals';
import tslint from 'typescript-eslint';

const conf = {
    languageOptions: {
        parserOptions: {
            project: ['tsconfig.json'],
            ecmaVersion: 2021,
            sourceType: 'module',
        },
        globals: {
            ...globals.browser,
            ...globals.node,
        },
    },
    rules: {
        'security/detect-object-injection': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/no-empty-function': 1,
        '@typescript-eslint/no-magic-numbers': 0,
        'no-magic-numbers': 0,
        'no-use-before-define': 0,
        '@typescript-eslint/no-use-before-define': 0,
        'no-dupe-class-members': 1,
        'no-unused-vars': 0,
        '@typescript-eslint/consistent-type-imports': 'error',
        'no-console': 'warn',
        'indent': ['warn', 4, { 'flatTernaryExpressions': true }],
        '@typescript-eslint/consistent-type-imports': 'error',
        '@stylistic/multiline-ternary': 'off',
        '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '?': 'ignore', ':': 'ignore' } }],
        '@stylistic/indent': [
            'error',
            4,
            {
                flatTernaryExpressions: true,
            },
        ],
        '@stylistic/semi': ['error', 'always'],
        '@stylistic/arrow-parens': ['error', 'as-needed'],
        '@stylistic/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],
        'import/no-unresolved': 'off',
    },
};

export default tslint.config(
    {
        rules: {
          'no-duplicate-imports': 'error',
        },
    },
    stylistic.configs.recommended,
    eslint.configs.recommended,
    securityPlugin.configs.recommended,
    importPlugin.flatConfigs.recommended,
    ...tslint.configs.strict,
    ...tslint.configs.stylistic,
    conf,
    {
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts'],
            },
        },
        files: [
            'src/ts/**/*.ts',
        ],
        ignores: [
            'dist',
            'node_modules'
        ]
    },
);

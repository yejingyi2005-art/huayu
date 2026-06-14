import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strict],
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    // shadcn/ui library components use patterns we shouldn't modify
    files: ["src/app/components/ui/**"],
    rules: {
      "react-refresh/only-export-components": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    // Data-fetching hooks + pages with localStorage effects:
    // useEffect calling setState is a standard React pattern;
    // this rule is overly strict for these cases.
    files: ["src/hooks/**", "src/pages/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
);

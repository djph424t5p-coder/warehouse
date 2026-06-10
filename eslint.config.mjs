import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    /* JSX-пропсы React Three Fiber (args, attach, position…) */
    files: ["components/three/**"],
    rules: {
      "react/no-unknown-property": "off",
    },
  },
];

export default eslintConfig;

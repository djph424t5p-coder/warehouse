import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

/*
  Дисплейный шрифт: Playfair Display — высокий контраст, кириллица.
  (Fraunces из ТЗ не содержит кириллицы; премиум-замена позже —
  PP Editorial New / Canela через переменную --font-display.)
*/
const playfair = Playfair_Display({
  subsets: ["cyrillic", "latin"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "МЕРИДИАН — клубный дом на Остоженке",
  description:
    "Шестнадцать резиденций над Москвой-рекой. Клубный дом суперпремиум-класса в историческом квартале Остоженки. Приватные лифтовые холлы, SPA, сервис пять звёзд.",
  openGraph: {
    title: "МЕРИДИАН — клубный дом на Остоженке",
    description:
      "Шестнадцать резиденций над Москвой-рекой. Клубный дом суперпремиум-класса.",
    locale: "ru_RU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0D0B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${playfair.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}

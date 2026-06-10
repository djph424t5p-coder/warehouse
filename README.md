# МЕРИДИАН — лендинг клубного дома

Одностраничный кинематографичный лендинг жилого комплекса суперпремиум-класса.
Главный приём — процедурная 3D-«стройка»: дом собирается снизу вверх по мере
скролла первого экрана.

## Стек

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** — токены дизайн-системы в `app/globals.css` (`@theme`)
- **React Three Fiber + drei + postprocessing** — 3D-сцены
- **GSAP + ScrollTrigger + SplitText + DrawSVG** — скролл-анимации
- **Lenis** — инерционный плавный скролл (общий тикер с GSAP)
- **Framer Motion** — зарезервирован для микро-интеракций

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # продакшн-сборка
npm run lint
```

## Где что лежит

| Путь | Назначение |
| --- | --- |
| `lib/constants.ts` | **Весь контент** (тексты, планировки, точки на карте). Замена названий и текстов — только здесь |
| `app/globals.css` | Палитра, типографика, утилиты дизайн-системы |
| `app/layout.tsx` | Шрифты, метатеги, провайдеры, курсор, зерно, прелоадер |
| `components/sections/` | Секции S1–S10 + футер |
| `components/three/` | 3D: процедурная башня, hero-сцена, интерактивная модель |
| `components/ui/` | Reveal, MagneticButton, Cursor, Preloader, карта, график… |
| `hooks/`, `lib/` | Переиспользуемые хуки, настройка GSAP/Lenis, математика стройки |

## Замена плейсхолдеров

- Фото интерьеров/архитектуры: ищите комментарии `TODO` в
  `components/ui/PlaceholderImage.tsx` и `components/sections/Section5Interiors.tsx` —
  градиентные заглушки меняются на `next/image` без правки сетки.
- Дисплейный шрифт: Playfair Display (у Fraunces из ТЗ нет кириллицы).
  Премиум-замена (PP Editorial New / Canela) подключается через переменную
  `--font-display` в `app/layout.tsx` + `app/globals.css`.
- Отправка формы: `components/sections/Section10Contact.tsx`, `handleSubmit` —
  подключите CRM/эндпоинт.

## Производительность и fallback'и

- Окна башни — один InstancedMesh с HDR-шейдером под Bloom (1 draw call).
- `frameloop` канвасов выключается вне вьюпорта (IntersectionObserver).
- Качество: `high` / `low` (мобильные: без постобработки, меньше этажей) /
  `static` (нет WebGL2 или `prefers-reduced-motion` — SVG-постер вместо сцены).
- Все анимации уважают `prefers-reduced-motion`.

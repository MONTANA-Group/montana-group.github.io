# MONTANA group — сайт (пробная версия)

Прокат, аренда авто для такси и выкуп. Astro, статические страницы.

## Запуск
```
npm install
npm run dev      # http://localhost:4321
npm run build    # готовый сайт в dist/
```

## Где что править
- `src/data/cars.js` — машины: цены, характеристики, условия, шкала срока, фото.
- `src/data/site.js` — телефон, мессенджеры, адрес, юрлицо, отзывы.
- `public/cars/<машина>/` — фотографии (01.jpg — обложка).
- `public/brand/` — логотип и иконка.

## Перед запуском заменить
- Телефон, ссылки на Telegram / WhatsApp / MAX, юрлицо и ИНН (`site.js`).
- Текст политики конфиденциальности (`src/pages/politika.astro`).
- Подключить отправку заявок (сейчас формы помечены `data-demo` и никуда не отправляют).
- Убрать жёлтую плашку «Пробная версия» в `src/layouts/Base.astro`.

## GitHub Pages
Workflow лежит в `.github/workflows/deploy.yml`. В Settings → Pages → Source выбрать GitHub Actions.
Адрес подставляется сам: репозиторий `<org>.github.io` открывается без хвоста, любой другой — по адресу `/<имя-репозитория>/`.

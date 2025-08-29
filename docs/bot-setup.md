# Полная настройка бота @illara_game_bot

## Текущий статус:
- ✅ Бот создан: @illara_game_bot
- ✅ Menu Button настроен
- ✅ URL правильный: https://illara-camp-webapp.vercel.app
- ❌ WebApp не передает данные пользователя

## Решения:

### 1. Проверьте настройки Menu Button:
```
@BotFather → /mybots → @illara_game_bot → Bot Settings → Menu Button
```
Убедитесь, что URL: `https://illara-camp-webapp.vercel.app`

### 2. Добавьте команды:
```
@BotFather → /setcommands
start - Начать игру
play - Открыть WebApp
```

### 3. Проверьте способ открытия:
1. Найдите @illara_game_bot в Telegram
2. Нажмите кнопку меню (не открывайте ссылку напрямую)
3. WebApp должен открыться внутри Telegram

### 4. Альтернативный тест:
Откройте в браузере:
```
https://illara-camp-webapp.vercel.app?user={"id":123456,"first_name":"Real","last_name":"User"}
```
Должно показать "Real User"

## Если WebApp все еще не работает:
Возможно, проблема в настройках Telegram. Попробуйте:
1. Переустановить Telegram
2. Очистить кэш
3. Открыть WebApp в другом устройстве

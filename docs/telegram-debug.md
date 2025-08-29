# Telegram WebApp Debugging

## Проблема: WebApp не передает данные пользователя

### Возможные причины:

1. **WebApp не включен в настройках бота**
2. **Неправильный URL**
3. **Открытие не через Telegram**

### Решения:

#### 1. Проверьте настройки бота:
```
@BotFather → /mybots → ваш бот → Bot Settings → Menu Button
```

#### 2. Включите WebApp:
```
@BotFather → /setmenubutton
Выберите бота
Text: 🎮 Играть
URL: https://illara-camp-webapp.vercel.app
```

#### 3. Проверьте команды:
```
@BotFather → /setcommands
start - Начать игру
```

#### 4. Альтернативный URL для тестирования:
```
https://illara-camp-webapp.vercel.app?user={"id":123456,"first_name":"Test","last_name":"User"}
```

### Тестирование:

1. Откройте бота в Telegram
2. Нажмите кнопку меню
3. Проверьте консоль браузера
4. Должны быть логи о Telegram WebApp

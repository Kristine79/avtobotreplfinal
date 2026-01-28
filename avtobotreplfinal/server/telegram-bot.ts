import TelegramBot from 'node-telegram-bot-api';
import { calculateCarValue, type CarValuationInput } from './carValuation';
import { analyzeVehicleDamage, analyzeMultipleImages } from './openai';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.log('⚠️ TELEGRAM_BOT_TOKEN не установлен. Бот не запущен.');
  console.log('Для запуска бота добавьте TELEGRAM_BOT_TOKEN в секреты.');
} else {
  const bot = new TelegramBot(token, { polling: true });

  console.log('🤖 Telegram бот AutoValue Pro запущен!');

  // Set up menu commands
  bot.setMyCommands([
    { command: 'start', description: 'Главное меню' },
    { command: 'valuation', description: 'Оценка по параметрам (бесплатно)' },
    { command: 'photo', description: 'Оценка по фото (ИИ анализ)' },
    { command: 'help', description: 'Справка и помощь' },
    { command: 'cancel', description: 'Отменить текущую операцию' }
  ]);

  type SessionStep = 
    | 'brand' | 'model' | 'year' | 'mileage' | 'condition' | 'complete'
    | 'photo_waiting' | 'photo_analyzing';

  interface UserSession {
    mode: 'valuation' | 'photo';
    step: SessionStep;
    data: Partial<CarValuationInput & { model?: string }>;
    photos: string[];
  }

  const sessions: Map<number, UserSession> = new Map();

  const BRANDS = [
    'Toyota', 'Honda', 'Nissan', 'Mazda', 'Mitsubishi', 'Subaru', 'Suzuki',
    'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche',
    'Lexus', 'Infiniti', 'Acura',
    'Hyundai', 'Kia', 'Genesis',
    'Lada', 'GAZ', 'UAZ',
    'Ford', 'Chevrolet', 'Jeep', 'Dodge',
    'Volvo', 'Jaguar', 'Land Rover', 'Mini',
    'Peugeot', 'Renault', 'Citroen',
    'Skoda', 'SEAT', 'Opel',
    'Fiat', 'Alfa Romeo', 'Ferrari', 'Lamborghini', 'Maserati',
    'Bentley', 'Rolls-Royce', 'Aston Martin', 'McLaren',
    'Tesla', 'BYD', 'Chery', 'Haval', 'Geely', 'Changan', 'Tank'
  ];

  const CONDITIONS: { value: CarValuationInput['condition']; label: string }[] = [
    { value: 'excellent', label: '🌟 Отличное' },
    { value: 'good', label: '👍 Хорошее' },
    { value: 'fair', label: '👌 Среднее' },
    { value: 'poor', label: '⚠️ Плохое' }
  ];

  const SEVERITY_LABELS: Record<string, string> = {
    minor: '🟢 Незначительные',
    moderate: '🟡 Умеренные', 
    severe: '🔴 Серьёзные',
    critical: '⛔ Критические'
  };

  const DECISION_LABELS: Record<string, string> = {
    'auto-approve': '✅ Авто-одобрение',
    'human-review': '👤 Требуется проверка',
    'escalate': '🚨 Эскалация'
  };

  const formatPrice = (n: number) => n.toLocaleString('ru-RU');

  // Escape special Markdown characters to prevent parse errors
  const escapeMarkdown = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/_/g, '\\_')
      .replace(/\*/g, '\\*')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/~/g, '\\~')
      .replace(/`/g, '\\`')
      .replace(/>/g, '\\>')
      .replace(/#/g, '\\#')
      .replace(/\+/g, '\\+')
      .replace(/-/g, '\\-')
      .replace(/=/g, '\\=')
      .replace(/\|/g, '\\|')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\./g, '\\.')
      .replace(/!/g, '\\!');
  };

  const PHOTO_ANALYSIS_PRICE = 299; // Price in rubles

  // Main menu keyboard
  const mainMenuKeyboard = {
    inline_keyboard: [
      [
        { text: '📊 По параметрам (бесплатно)', callback_data: 'menu_valuation' }
      ],
      [
        { text: '📷 По фото (ИИ анализ)', callback_data: 'menu_photo' }
      ],
      [
        { text: '❓ Справка', callback_data: 'menu_help' }
      ]
    ]
  };

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    sessions.delete(chatId);
    
    bot.sendMessage(chatId, 
      `🚗 *AutoValue Pro*\n\n` +
      `Мгновенная оценка автомобиля на основе данных авторынка России 2024-2025.\n\n` +
      `Выберите способ оценки:`,
      { 
        parse_mode: 'Markdown',
        reply_markup: mainMenuKeyboard
      }
    );
  });

  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    sendHelpMessage(chatId);
  });

  const sendHelpMessage = (chatId: number) => {
    bot.sendMessage(chatId,
      `🔍 *Справка AutoValue Pro*\n\n` +
      `*📊 Оценка по параметрам* (бесплатно)\n` +
      `Введите характеристики авто и получите рыночную стоимость:\n` +
      `• Марка и модель\n` +
      `• Год выпуска\n` +
      `• Пробег\n` +
      `• Техническое состояние\n\n` +
      `*📷 Оценка по фото* (ИИ анализ)\n` +
      `Отправьте фотографии автомобиля (до 10 штук) и ИИ определит:\n` +
      `• Все повреждения (вмятины, царапины, сколы)\n` +
      `• Стоимость ремонта каждого дефекта\n` +
      `• Общую оценку состояния\n` +
      `• Рекомендации по ремонту\n\n` +
      `*Команды:*\n` +
      `/start - Главное меню\n` +
      `/valuation - Оценка по параметрам\n` +
      `/photo - Оценка по фото\n` +
      `/cancel - Отменить текущую операцию`,
      { 
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '◀️ Назад в меню', callback_data: 'menu_back' }
          ]]
        }
      }
    );
  }

  bot.onText(/\/cancel/, (msg) => {
    const chatId = msg.chat.id;
    sessions.delete(chatId);
    bot.sendMessage(chatId, '❌ Операция отменена.', {
      reply_markup: {
        inline_keyboard: [[
          { text: '◀️ В главное меню', callback_data: 'menu_back' }
        ]]
      }
    });
  });

  bot.onText(/\/valuation/, (msg) => {
    const chatId = msg.chat.id;
    startValuation(chatId);
  });

  bot.onText(/\/photo/, (msg) => {
    const chatId = msg.chat.id;
    startPhotoAnalysis(chatId);
  });

  const startValuation = (chatId: number) => {
    sessions.set(chatId, { mode: 'valuation', step: 'brand', data: {}, photos: [] });

    const brandButtons = [];
    for (let i = 0; i < BRANDS.length; i += 3) {
      brandButtons.push(
        BRANDS.slice(i, i + 3).map(brand => ({ text: brand, callback_data: `brand_${brand}` }))
      );
    }
    brandButtons.push([{ text: '❌ Отмена', callback_data: 'menu_back' }]);

    bot.sendMessage(chatId, '📊 *Оценка по параметрам*\n\n🚗 *Шаг 1/5: Выберите марку автомобиля*', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: brandButtons
      }
    });
  }

  const startPhotoAnalysis = (chatId: number) => {
    sessions.set(chatId, { mode: 'photo', step: 'photo_waiting', data: {}, photos: [] });

    bot.sendMessage(chatId, 
      `📷 Оценка по фото\n\n` +
      `💰 Стоимость услуги: ${PHOTO_ANALYSIS_PRICE} ₽\n\n` +
      `Отправьте фотографии автомобиля для анализа повреждений.\n\n` +
      `• Загрузите от 1 до 10 фотографий\n` +
      `• Снимайте повреждения крупным планом\n` +
      `• После загрузки нажмите "Анализировать"\n\n` +
      `ИИ определит все повреждения и рассчитает стоимость ремонта`,
      { 
        reply_markup: {
          inline_keyboard: [[
            { text: '❌ Отмена', callback_data: 'menu_back' }
          ]]
        }
      }
    );
  }

  bot.on('callback_query', async (query) => {
    if (!query.message || !query.data) return;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    // Menu navigation
    if (query.data === 'menu_back') {
      sessions.delete(chatId);
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageText(
        `🚗 *AutoValue Pro*\n\n` +
        `Мгновенная оценка автомобиля на основе данных авторынка России 2024-2025.\n\n` +
        `Выберите способ оценки:`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: mainMenuKeyboard
        }
      );
      return;
    }

    if (query.data === 'menu_valuation') {
      await bot.answerCallbackQuery(query.id);
      await bot.deleteMessage(chatId, messageId);
      startValuation(chatId);
      return;
    }

    if (query.data === 'menu_photo') {
      await bot.answerCallbackQuery(query.id);
      await bot.deleteMessage(chatId, messageId);
      startPhotoAnalysis(chatId);
      return;
    }

    if (query.data === 'menu_help') {
      await bot.answerCallbackQuery(query.id);
      await bot.deleteMessage(chatId, messageId);
      sendHelpMessage(chatId);
      return;
    }

    const session = sessions.get(chatId);
    if (!session) {
      await bot.answerCallbackQuery(query.id, { text: 'Сессия истекла. Нажмите /start' });
      return;
    }

    // Valuation flow
    if (query.data.startsWith('brand_')) {
      const brand = query.data.replace('brand_', '');
      session.data.brand = brand;
      session.step = 'model';
      sessions.set(chatId, session);

      await bot.answerCallbackQuery(query.id);
      await bot.editMessageText(
        `📊 *Оценка по параметрам*\n\n` +
        `✅ Марка: *${brand}*\n\n` +
        `📝 *Шаг 2/5: Введите модель автомобиля*\n\nНапример: Camry, X5, Polo`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown'
        }
      );
      return;
    }

    if (query.data.startsWith('condition_')) {
      const condition = query.data.replace('condition_', '') as CarValuationInput['condition'];
      session.data.condition = condition;
      session.step = 'complete';
      sessions.set(chatId, session);

      await bot.answerCallbackQuery(query.id);

      const conditionLabel = CONDITIONS.find(c => c.value === condition)?.label || condition;

      const result = calculateCarValue({
        brand: session.data.brand!,
        model: session.data.model,
        year: session.data.year,
        mileage: session.data.mileage,
        condition: condition
      });

      await bot.editMessageText(
        `🎉 *Результат оценки*\n\n` +
        `🚗 *${session.data.brand} ${session.data.model || ''}*\n` +
        `📅 Год: ${session.data.year || 'не указан'}\n` +
        `📏 Пробег: ${session.data.mileage ? formatPrice(session.data.mileage) + ' км' : 'не указан'}\n` +
        `⭐ Состояние: ${conditionLabel}\n` +
        `${result.isPremiumBrand ? '💎 Премиум-бренд\n' : ''}\n` +
        `━━━━━━━━━━━━━━━━━\n` +
        `💰 *Рыночная стоимость:*\n\n` +
        `📉 Минимум: *${formatPrice(result.estimatedValueMin)} ₽*\n` +
        `📊 Средняя: *${formatPrice(result.averageValue)} ₽*\n` +
        `📈 Максимум: *${formatPrice(result.estimatedValueMax)} ₽*\n` +
        `━━━━━━━━━━━━━━━━━`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: '🔄 Новая оценка', callback_data: 'menu_valuation' },
              { text: '◀️ Меню', callback_data: 'menu_back' }
            ]]
          }
        }
      );

      sessions.delete(chatId);
      return;
    }

    // Photo analysis - payment confirmation
    if (query.data === 'confirm_payment') {
      await bot.answerCallbackQuery(query.id, { text: 'Оплата подтверждена!' });
      // Continue to analysis
      await processPhotoAnalysis(chatId, messageId, session);
      return;
    }

    // Photo analysis - analyze button
    if (query.data === 'analyze_photos') {
      if (session.photos.length === 0) {
        await bot.answerCallbackQuery(query.id, { text: 'Сначала отправьте фотографии!' });
        return;
      }

      await bot.answerCallbackQuery(query.id);
      
      // Show payment confirmation (plain text to avoid markdown issues)
      await bot.editMessageText(
        `💳 Оплата услуги\n\n` +
        `Загружено фото: ${session.photos.length}\n` +
        `Стоимость анализа: ${PHOTO_ANALYSIS_PRICE} ₽\n\n` +
        `Для оплаты используйте один из способов:\n\n` +
        `💳 Карта: 2200 0000 0000 0000\n` +
        `📱 СБП: +7 999 123-45-67\n` +
        `₿ USDT (TRC-20): TXxx...xxx\n\n` +
        `После оплаты нажмите "Оплачено"`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: '✅ Оплачено', callback_data: 'confirm_payment' }],
              [{ text: '❌ Отмена', callback_data: 'menu_back' }]
            ]
          }
        }
      );
      return;
    }
  });

  const processPhotoAnalysis = async (chatId: number, messageId: number, session: UserSession) => {
      session.step = 'photo_analyzing';
      sessions.set(chatId, session);

      await bot.editMessageText(
        `🔄 Анализ фотографий...\n\n` +
        `Загружено: ${session.photos.length} фото\n` +
        `ИИ анализирует повреждения, подождите...`,
        {
          chat_id: chatId,
          message_id: messageId
        }
      );

      try {
        const result = session.photos.length > 1 
          ? await analyzeMultipleImages(session.photos)
          : await analyzeVehicleDamage(session.photos[0]);

        let damagesText = '';
        if (result.damages && result.damages.length > 0) {
          damagesText = result.damages.slice(0, 5).map((d, i) => 
            `${i + 1}. ${escapeMarkdown(d.type)} - ${escapeMarkdown(d.severity)}\n   📍 ${escapeMarkdown(d.location)}\n   💰 ${formatPrice(d.estimatedCost)} ₽`
          ).join('\n\n');
          
          if (result.damages.length > 5) {
            damagesText += `\n\nи ещё ${result.damages.length - 5} повреждений`;
          }
        } else {
          damagesText = 'Повреждения не обнаружены';
        }

        const vehicleInfo = result.vehicleInfo 
          ? `🚗 ${escapeMarkdown(result.vehicleInfo.make || '')} ${escapeMarkdown(result.vehicleInfo.model || '')}\n` +
            `${result.vehicleInfo.year ? `📅 Год: ~${result.vehicleInfo.year}\n` : ''}` +
            `${result.vehicleInfo.color ? `🎨 Цвет: ${escapeMarkdown(result.vehicleInfo.color)}\n` : ''}`
          : '';

        const severity = SEVERITY_LABELS[result.overallSeverity] || escapeMarkdown(result.overallSeverity);
        const decision = DECISION_LABELS[result.decision] || escapeMarkdown(result.decision);

        let valuationText = '';
        if (result.vehicleValuation) {
          const v = result.vehicleValuation;
          valuationText = `\n━━━━━━━━━━━━━━━━━\n` +
            `💰 Оценка стоимости:\n` +
            `До ремонта: ${formatPrice(v.estimatedValueMin)} - ${formatPrice(v.estimatedValueMax)} ₽\n` +
            `После ремонта: ${formatPrice((v as any).afterRepairValue || v.averageValue)} ₽`;
        }

        const recommendations = (result.repairRecommendations || ['Обратитесь в автосервис для детальной оценки'])
          .slice(0, 3)
          .map(r => `• ${escapeMarkdown(r)}`)
          .join('\n');

        // Send result without markdown to avoid parsing issues
        await bot.editMessageText(
          `📷 Результат анализа\n\n` +
          vehicleInfo +
          `\n📊 Общая оценка:\n` +
          `• Состояние: ${severity}\n` +
          `• Решение: ${decision}\n` +
          `• Качество фото: ${(result as any).imageQuality === 'good' ? '✅ Хорошее' : (result as any).imageQuality === 'acceptable' ? '👌 Приемлемое' : '⚠️ Плохое'}\n\n` +
          `💰 Общая стоимость ремонта: ${formatPrice(result.totalEstimatedCost)} ₽\n\n` +
          `━━━━━━━━━━━━━━━━━\n` +
          `🔍 Обнаруженные повреждения:\n\n` +
          damagesText +
          valuationText +
          `\n\n━━━━━━━━━━━━━━━━━\n` +
          `📋 Рекомендации:\n` +
          recommendations,
          {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
              inline_keyboard: [[
                { text: '📷 Новый анализ', callback_data: 'menu_photo' },
                { text: '◀️ Меню', callback_data: 'menu_back' }
              ]]
            }
          }
        );
      } catch (error: any) {
        console.error('Photo analysis error:', error);
        await bot.editMessageText(
          `❌ Ошибка анализа\n\n` +
          `Не удалось проанализировать фотографии.\n` +
          `Попробуйте загрузить другие снимки.\n\n` +
          `${escapeMarkdown(error.message || 'Неизвестная ошибка')}`,
          {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
              inline_keyboard: [[
                { text: '🔄 Попробовать снова', callback_data: 'menu_photo' },
                { text: '◀️ Меню', callback_data: 'menu_back' }
              ]]
            }
          }
        );
      }

      sessions.delete(chatId);
  };

  // Handle photos
  bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const session = sessions.get(chatId);

    if (!session || session.mode !== 'photo' || session.step !== 'photo_waiting') {
      return;
    }

    if (session.photos.length >= 10) {
      bot.sendMessage(chatId, '⚠️ Максимум 10 фотографий. Нажмите "Анализировать" для продолжения.');
      return;
    }

    const photo = msg.photo![msg.photo!.length - 1]; // Get highest resolution
    
    try {
      const file = await bot.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
      
      // Download and convert to base64
      const response = await fetch(fileUrl);
      const buffer = await response.arrayBuffer();
      const base64 = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
      
      session.photos.push(base64);
      sessions.set(chatId, session);

      bot.sendMessage(chatId, 
        `✅ Фото ${session.photos.length}/10 загружено\n\n` +
        `Отправьте ещё фотографии или нажмите "Анализировать"`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: `🔍 Анализировать (${session.photos.length} фото)`, callback_data: 'analyze_photos' }],
              [{ text: '❌ Отмена', callback_data: 'menu_back' }]
            ]
          }
        }
      );
    } catch (error) {
      console.error('Photo download error:', error);
      bot.sendMessage(chatId, '❌ Ошибка загрузки фото. Попробуйте ещё раз.');
    }
  });

  // Handle text messages for valuation flow
  bot.on('message', async (msg) => {
    if (!msg.text || msg.text.startsWith('/') || msg.photo) return;

    const chatId = msg.chat.id;
    const session = sessions.get(chatId);

    if (!session || session.mode !== 'valuation') return;

    const text = msg.text.trim();

    switch (session.step) {
      case 'model':
        session.data.model = text;
        session.step = 'year';
        sessions.set(chatId, session);

        bot.sendMessage(chatId,
          `📊 *Оценка по параметрам*\n\n` +
          `✅ Марка: *${session.data.brand}*\n` +
          `✅ Модель: *${text}*\n\n` +
          `📅 *Шаг 3/5: Введите год выпуска*\n\nНапример: 2020`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'year':
        const year = parseInt(text);
        if (isNaN(year) || year < 1970 || year > new Date().getFullYear() + 1) {
          bot.sendMessage(chatId, '⚠️ Введите корректный год (1970-2026)');
          return;
        }
        session.data.year = year;
        session.step = 'mileage';
        sessions.set(chatId, session);

        bot.sendMessage(chatId,
          `📊 *Оценка по параметрам*\n\n` +
          `✅ Марка: *${session.data.brand}*\n` +
          `✅ Модель: *${session.data.model}*\n` +
          `✅ Год: *${year}*\n\n` +
          `📏 *Шаг 4/5: Введите пробег в километрах*\n\nНапример: 85000`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'mileage':
        const mileage = parseInt(text.replace(/\s/g, ''));
        if (isNaN(mileage) || mileage < 0 || mileage > 2000000) {
          bot.sendMessage(chatId, '⚠️ Введите корректный пробег (0-2000000 км)');
          return;
        }
        session.data.mileage = mileage;
        session.step = 'condition';
        sessions.set(chatId, session);

        const conditionButtons = CONDITIONS.map(c => ([
          { text: c.label, callback_data: `condition_${c.value}` }
        ]));
        conditionButtons.push([{ text: '❌ Отмена', callback_data: 'menu_back' }]);

        bot.sendMessage(chatId,
          `📊 *Оценка по параметрам*\n\n` +
          `✅ Марка: *${session.data.brand}*\n` +
          `✅ Модель: *${session.data.model}*\n` +
          `✅ Год: *${session.data.year}*\n` +
          `✅ Пробег: *${formatPrice(mileage)} км*\n\n` +
          `⭐ *Шаг 5/5: Оцените состояние автомобиля*`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: conditionButtons
            }
          }
        );
        break;
    }
  });

  bot.on('polling_error', (error) => {
    console.error('Telegram polling error:', error.message);
  });
}

export {};

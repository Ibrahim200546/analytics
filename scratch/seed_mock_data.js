/**
 * Seed script: 100 organizations + 100 projects + 100 articles into Supabase
 * Run: node scratch/seed_mock_data.js
 */
const { createClient } = require('c:/Users/user/Desktop/1/exchange-rates/frontend/node_modules/@supabase/supabase-js');

const url = 'https://znxpazaraxtnnixgdbbd.supabase.co';
const key = 'sb_publishable_9YQ-e-rmBN_vM4WfgdxJKw_OtBXp7ij';
const supabase = createClient(url, key);

// ─── Data pools ─────────────────────────────────────────────────────────────
const CITIES = ['Алматы','Нур-Султан','Шымкент','Актобе','Атырау','Павлодар','Семей','Тараз','Костанай','Петропавловск','Оскемен','Кызылорда','Актау','Туркестан','Уральск'];

const ORG_NAMES = [
  'Казмунайгаз',                    // 1
  'Казатомпром',                     // 2
  'Самрук-Казына',                   // 3
  'Air Astana',                      // 4
  'Каз­пром',                        // 5
  'Народный банк Казахстана',        // 6
  'Банк ЦентрКредит',                // 7
  'ForteBank',                       // 8
  'Kaspi Bank',                      // 9
  'Jusan Bank',                      // 10
  'Банк Развития Казахстана',        // 11
  'АТФ Банк',                        // 12
  'Евразийский Банк',                // 13
  'Шинхан Банк Казахстан',           // 14
  'Цеснабанк',                       // 15
  'Kcell',                           // 16
  'Tele2 Казахстан',                  // 17
  'Beeline Казахстан',               // 18
  'Алтел',                           // 19
  'КазТелеком',                      // 20
  'KEGOC',                           // 21
  'АлЭС',                            // 22
  'Казцинк',                         // 23
  'ENRC',                            // 24
  'АрселорМиттал Темиртау',          // 25
  'Алюминий Казахстана',             // 26
  'Казфосфат',                       // 27
  'КазАзот',                         // 28
  'ШНОС (Шымкентский НПЗ)',          // 29
  'ПКОП (Павлодарский НПЗ)',         // 30
  'КМГ Переработка',                 // 31
  'Тенгизшевройл',                   // 32
  'Карачаганак Петролеум',           // 33
  'Аджип ККО',                       // 34
  'Total E&P Казахстан',             // 35
  'Казахтелеком',                    // 36
  'Транстелеком',                    // 37
  'Казтрансойл',                     // 38
  'КТЖ (Казахстан Темир Жолы)',      // 39
  'Кazpost',                         // 40
  'QazaqGaz',                        // 41
  'Казтрансгаз',                     // 42
  'Интергаз Центральная Азия',       // 43
  'КазТрансСервис',                  // 44
  'Экибастузская ГРЭС-1',           // 45
  'ДЗНХ',                            // 46
  'Медиа Корпорация «Мир»',          // 47
  'Tengri Media',                    // 48
  'Kazakh TV',                       // 49
  '31 Канал',                        // 50
  'Khabar Agency',                   // 51
  'МТРК «Хабар»',                   // 52
  'BNews.kz',                        // 53
  'Informburo.kz',                   // 54
  'Forbes Kazakhstan',               // 55
  'Kursiv.media',                    // 56
  'Kapital.kz',                      // 57
  'Деловой Казахстан',               // 58
  'Market.kz',                       // 59
  'Chocofamily Holding',             // 60
  'Kolesa.kz',                       // 61
  'OLX Казахстан',                   // 62
  'Homsters.kz',                     // 63
  'Arbuz.kz',                        // 64
  'Jmart',                           // 65
  'Sulpak',                          // 66
  'Technodom',                       // 67
  'Fix Price Казахстан',             // 68
  'MEGA Centers',                    // 69
  'Magnum Cash&Carry',               // 70
  'Small.kz',                        // 71
  'Rakhat',                          // 72
  'Баян Сулу',                       // 73
  'Зерновой Альянс',                 // 74
  'КазАгро',                         // 75
  'Казагрофинанс',                   // 76
  'Байер Казахстан',                 // 77
  'Агросервис Казахстан',            // 78
  'Экодар',                          // 79
  'Нур Металл',                      // 80
  'Казмедь',                         // 81
  'GlobeCore Казахстан',             // 82
  'Казатомсервис',                   // 83
  'НАК Казатомпром Трейдинг',        // 84
  'QazCarbon',                       // 85
  'GreenEnergy Solutions KZ',        // 86
  'SmartGrid Казахстан',             // 87
  'AiLabs.kz',                       // 88
  'Cerebra AI Kazakhstan',           // 89
  'DataHub KZ',                      // 90
  'CloudKaz',                        // 91
  'SecureKaz',                       // 92
  'BioTech KZ',                      // 93
  'MedService Казахстан',            // 94
  'Казфармация',                     // 95
  'Нобель AFF',                      // 96
  'Kimyager DM',                     // 97
  'Astana Expo Holdings',            // 98
  'Qazaq LNG',                       // 99
  'Казинформ',                       // 100
];

const TAGS = [
  ['мониторинг','сми','аналитика'],
  ['pr','репутация','медиа'],
  ['новости','медиамониторинг'],
  ['финансы','аналитика','отчёты'],
  ['конкуренты','рынок','анализ'],
  ['социальные сети','smm','бренд'],
  ['нефть','газ','энергетика'],
  ['технологии','ИТ','цифровизация'],
  ['экология','esg','устойчивость'],
  ['политика','регулирование','право'],
];

const PROJECT_TEMPLATES = [
  'Мониторинг СМИ',
  'PR Аналитика',
  'Репутационный анализ',
  'Конкурентная разведка',
  'Медиаотчёты',
  'Социальные сети',
  'Антикризисный PR',
  'Бренд-мониторинг',
  'Отраслевые новости',
  'ESG-мониторинг',
];

const ARTICLE_DATA = [
  { title: 'Нацбанк снизил базовую ставку до 14,25%', announce: 'Решение принято на фоне замедления инфляции.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/economics/stavka-14-25' },
  { title: 'Казахстан занял 28-е место в рейтинге WEF', announce: 'Страна улучшила позиции в рейтинге глобальной конкурентоспособности.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/news/wef-28' },
  { title: 'ПИИ выросли на 18% за первое полугодие', announce: 'Объём прямых иностранных инвестиций — $14,2 млрд.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/pii-2026' },
  { title: 'Запуск программы «Цифровая индустрия 2030»', announce: 'Правительство выделило 1,2 трлн тенге на цифровизацию.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/digital-industry' },
  { title: 'КТК установил рекорд прокачки нефти', announce: '6,4 млн тонн — рекорд за всю историю трубопровода.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ktk-record' },
  { title: 'Новые правила господдержки МСБ', announce: 'Субсидии до 7% и гранты на цифровизацию 5 млн тенге.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/msb-2026' },
  { title: 'Air Astana открывает рейсы в Берлин, Рим и Варшаву', announce: 'Три новых европейских маршрута с октября 2026 года.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/air-astana-eu' },
  { title: 'KASE зафиксировала рекордный оборот — 8,9 трлн тенге', announce: 'Рост числа частных инвесторов втрое за два года.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kase-record' },
  { title: 'Казатомпром наращивает производство урана на 12%', announce: 'Переговоры с АЭС США, Франции и Южной Кореи.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kazatomprom' },
  { title: 'Открытие Центральноазиатского логистического хаба в Туркестане', announce: '120 000 м², 15 млн тонн грузов, 3 000 рабочих мест.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/logistic-hub' },
  { title: 'Минфин предложил снизить НДС для IT до 8%', announce: 'Льгота охватит более 4 000 IT-компаний.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/nds-it' },
  { title: 'Самрук-Казына выплатит рекордные дивиденды — 1,8 трлн тенге', announce: 'Рост на 22% по сравнению с 2025 годом.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/samruk-dividends' },
  { title: 'Запуск крупнейшей СЭС в Центральной Азии — 500 МВт', announce: 'TotalEnergies и Казахстан открыли солнечную станцию.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ces-500' },
  { title: 'Алматы вошёл в топ-30 умных городов мира', announce: 'Smart Cities Index 2026: 28-я строчка из 150 городов.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/smart-almaty' },
  { title: 'Экспорт пшеницы вырос на 25%', announce: 'Казахстан экспортировал 6,1 млн тонн за 8 месяцев.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/wheat-export' },
  { title: 'Казахстан и ЕС подписали соглашение о «зелёной» экономике', announce: 'Совместные инвестиции — 3 млрд евро до 2031 года.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/eu-green-deal' },
  { title: 'Открытие QazTech Hub в Нур-Султане', announce: '120 IT-компаний, 3 венчурных фонда, лаборатории ИИ.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/qaztech-hub' },
  { title: 'Банк ЦентрКредит объявил об IPO на KASE', announce: 'Объём размещения — 150 млрд тенге в Q4 2026.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/tsentrkredyt-ipo' },
  { title: 'Tele2 инвестирует 45 млрд тенге в расширение 5G', announce: 'Покрытие 5G появится в Шымкенте, Актобе, Павлодаре.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/tele2-5g' },
  { title: 'Казахстан вводит безвизовый режим для 15 стран ЕС', announce: 'Безвизовый въезд на 30 дней с 1 октября 2026 года.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/visa-free-eu' },
  { title: 'Kaspi Bank занял первое место среди банков по активам', announce: 'Активы Kaspi превысили 15 трлн тенге.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kaspi-assets' },
  { title: 'Казахстан вошёл в топ-10 стран по добыче урана', announce: 'Доля РК в мировой добыче — 43%.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/uran-top10' },
  { title: 'КТЖ запускает скоростной поезд Алматы–Нур-Султан', announce: 'Время в пути сократится до 2 часов 40 минут.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ktj-train' },
  { title: 'ЕНПФ показал доходность 9,7% за 2025 год', announce: 'Пенсионные накопления казахстанцев выросли на 8,2 трлн.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/enpf-2025' },
  { title: 'Закон о защите персональных данных подписан Президентом', announce: 'Новые правила вступают в силу с 2027 года.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/personal-data-law' },
  { title: 'Форум «Digital Almaty 2026» собрал 15 000 участников', announce: 'Обсуждались ИИ, квантовые технологии и метавселенная.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/digital-almaty-2026' },
  { title: 'Правительство создаёт Агентство по развитию ИИ', announce: 'Бюджет агентства — 200 млрд тенге до 2030 года.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ai-agency' },
  { title: 'Казахстан нарастил добычу нефти до 90 млн тонн в год', announce: 'Рост обусловлен расширением Тенгизского месторождения.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/oil-90mln' },
  { title: 'Стартап GreenFarm.kz привлёк $5 млн инвестиций', announce: 'Компания разрабатывает умные системы полива для фермеров.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/greenfarm-5mln' },
  { title: 'Рынок электромобилей в Казахстане вырос в 4 раза', announce: 'Продажи EV достигли 12 000 единиц за 8 месяцев 2026.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/ev-market' },
  { title: 'Халык Банк запустил суперприложение Onai', announce: 'Новое приложение объединяет банкинг, страхование и маркетплейс.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/halyk-onai' },
  { title: 'Казахстан лидирует в ЕАЭС по темпам роста ВВП', announce: 'Рост ВВП за полугодие — 5,3% — лучший показатель в союзе.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/gdp-eaeu' },
  { title: 'Открытие первой в ЦА фабрики по производству микрочипов', announce: 'Совместный проект Казахстана и Южной Кореи.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/chip-factory' },
  { title: 'Qazaq Airlines возобновляет международные рейсы', announce: 'Маршруты в Стамбул, Дубай и Москву с ноября 2026.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/qazaq-airlines' },
  { title: 'В Казахстане введён углеродный налог', announce: 'Ставка — 5 000 тенге за тонну CO₂ с 2027 года.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/carbon-tax' },
  { title: 'ForteBank завершил цифровую трансформацию за 3 года', announce: '95% операций клиентов — полностью онлайн.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/forte-digital' },
  { title: 'Казахстан и Китай строят новый железнодорожный коридор', announce: 'Пропускная способность — 50 млн тонн в год.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/kz-cn-railway' },
  { title: 'Объём рынка e-commerce Казахстана достиг $5 млрд', announce: 'Рост — 35% год к году, лидер — Kaspi.kz.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/ecommerce-5bln' },
  { title: 'Казфармация завершает строительство фармзавода в Алматы', announce: 'Мощность завода — 200 млн упаковок медикаментов в год.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kazpharm' },
  { title: 'Новый аэропорт Туркестана принял первых пассажиров', announce: 'Терминал рассчитан на 3 млн пассажиров в год.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/turkestan-airport' },
  { title: 'Казахстан запускает национальную облачную инфраструктуру GovCloud', announce: 'Все государственные IT-системы переходят в единое облако.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/govcloud' },
  { title: 'ЕНРЦ (Нац. расчётный центр) переходит на систему ISO 20022', announce: 'Новый стандарт упростит международные платежи.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/iso-20022' },
  { title: 'Казахстан войдёт в число ядерных энергодержав к 2035 году', announce: 'Строительство АЭС вынесено на референдум в ноябре 2026.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/aes-referendum' },
  { title: 'Экспорт IT-услуг вырос до $1,5 млрд за полугодие', announce: 'Казахстанские IT-компании активно расширяются в ЕС и СНГ.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/it-export-1-5' },
  { title: 'Магнум Cash&Carry открывает 10 новых супермаркетов', announce: 'Расширение в Нур-Султане, Шымкенте и Актобе.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/magnum-expand' },
  { title: 'Казцинк получил сертификацию LME Good Delivery', announce: 'Продукция признана соответствующей мировым стандартам качества.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kazcinc-lme' },
  { title: 'МТРК «Хабар» переходит на производство контента в 4K', announce: 'Инвестиции в оборудование — 3 млрд тенге.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/habar-4k' },
  { title: 'Колеса.кз собрал рекордную аудиторию — 5 млн уникальных пользователей', announce: 'Платформа занимает 80% рынка авторекламы в Казахстане.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kolesa-5mln' },
  { title: 'Chocofamily Holding объявил о листинге на AIX', announce: 'Размещение акций на Astana International Exchange — Q1 2027.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/choco-aix' },
  { title: 'В Казахстане создадут Фонд поддержки медиаотрасли', announce: 'Государство выделит 10 млрд тенге на поддержку редакций.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/media-fund' },
  { title: 'Байер Казахстан выводит новую линейку агропрепаратов', announce: 'Инновационные средства защиты растений для казахстанского климата.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/bayer-agro' },
  { title: 'Нур-Султан вошёл в топ-20 городов по уровню жизни', announce: 'Рейтинг Mercer Quality of Living 2026.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/nur-sultan-mercer' },
  { title: 'Казахстан увеличил объём ВИЭ в энергобалансе до 7%', announce: 'Ветроэнергетика и СЭС выработали 12 ТВт·ч за год.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/renewable-energy-7' },
  { title: 'Арселор Миттал инвестирует $2 млрд в модернизацию Темиртауского завода', announce: 'Переход на «зелёную» технологию выплавки стали.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/arcelormittal-2bln' },
  { title: 'Казахстан занял 3-е место в ЦА по индексу развития ИИ', announce: 'Выше только Узбекистан и Кыргызстан по числу AI-стартапов.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ai-index-ca' },
  { title: 'Единый транспортный пропуск для ЕАЭС будет запущен в 2027 году', announce: 'Казахстан выступает инициатором проекта единого транспортного документа.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/eaeu-transport-pass' },
  { title: 'KEGOC завершает строительство ЛЭП «Север–Юг»', announce: 'Линия позволит балансировать энергосистему всей страны.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/kegoc-north-south' },
  { title: 'ВВП Казахстана превысит $300 млрд по итогам 2026 года', announce: 'Прогноз МВФ — рост экономики на 5,1%.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/gdp-300bln' },
  { title: 'Введены новые требования к ESG-отчётности для компаний на KASE', announce: 'Листинговые компании обязаны раскрывать климатические риски с 2027 года.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/esg-reporting' },
  { title: 'Первая казахстанская компания вошла в Fortune Global 500', announce: 'Казмунайгаз занял 487-ю строчку в глобальном рейтинге.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kmg-fortune-500' },
  { title: 'Казахстан открывает первый центр кибербезопасности класса SOC 2', announce: 'Центр будет защищать критическую инфраструктуру государства.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/soc2-center' },
  { title: 'EXPO-2030 подтвердила заявку Казахстана на проведение выставки', announce: 'Алматы примет Всемирную выставку EXPO в 2030 году.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/expo-2030' },
  { title: 'Jusan Bank внедряет биометрическую верификацию клиентов', announce: 'Идентификация займёт 10 секунд без посещения офиса.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/jusan-biometric' },
  { title: 'Казахстан и Саудовская Аравия договорились об инвестициях на $10 млрд', announce: 'Приоритеты — энергетика, АПК и туризм.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kz-sa-10bln' },
  { title: 'Нур-Султан открывает 5 новых станций метро', announce: 'Протяжённость метрополитена достигнет 18 км.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/nursultan-metro-5' },
  { title: 'Рейтинг кредитоспособности Казахстана повышен до BBB+', announce: 'Standard & Poor\'s улучшило прогноз с «нейтрального» до «позитивного».', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/sp-bbb-plus' },
  { title: 'Казахстан станет хабом для экспорта «зелёного» водорода в Европу', announce: 'Меморандум с ЕС о строительстве водородного трубопровода подписан.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/hydrogen-hub' },
  { title: 'Казахстанский стартап HealthAI привлёк $3 млн', announce: 'Платформа использует ИИ для ранней диагностики онкологии.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/healthai-3mln' },
  { title: 'Интегрированная платёжная система ЦА будет запущена в 2027 году', announce: 'Казахстан, Кыргызстан и Таджикистан договорились о совместном проекте.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/ca-payment-system' },
  { title: 'QazaqGaz завершает строительство газопровода в Южный Казахстан', announce: 'Газификация 150 населённых пунктов к 2027 году.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/qazaqgaz-south' },
  { title: 'Forbes Kazakhstan назвал топ-50 богатейших людей страны', announce: 'Совокупное состояние топ-50 превысило $60 млрд.', source_name: 'Forbes Kazakhstan', source_url: 'https://forbes.kz/rating/top50-2026' },
  { title: 'Государственная программа «100 школ» завершена досрочно', announce: 'Построены школы в сёлах с острой нехваткой учебных мест.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/100-schools' },
  { title: 'Медиа Корпорация «Мир» запускает новый новостной стриминг', announce: 'MIRTV.kz — ежедневное вещание 24/7 на русском и казахском.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/mirtv-streaming' },
  { title: 'Чемпионат мира по боксу 2027 пройдёт в Алматы', announce: 'Казахстан выиграл право на проведение чемпионата у Бразилии.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/boxing-wc-2027' },
  { title: 'КазТелеком выводит на рынок IoT-платформу для умных городов', announce: 'Платформа интегрирует 500+ городских IoT-устройств.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/kaztelekom-iot' },
  { title: 'В Казахстане принят новый Налоговый кодекс', announce: 'Кодекс снижает налоговую нагрузку на бизнес на 15%.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/tax-code-2026' },
  { title: 'Казахстан запускает спутник для мониторинга экологии', announce: 'KazEcoSat будет наблюдать за состоянием Арала и степей.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kazecosat' },
  { title: 'Рынок недвижимости Алматы: цены стабилизировались', announce: 'Средняя цена за м² — 750 000 тенге, рост 2% за квартал.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/realty-almaty' },
  { title: 'Kcell переходит на eSIM для всех тарифных планов', announce: 'eSIM доступна через мобильное приложение с ноября 2026.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/kcell-esim' },
  { title: 'Kazakh TV International расширяется на аудиторию Европы', announce: 'Новое вещание охватит 15 стран ЕС с декабря 2026.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kazakhtv-eu' },
  { title: 'Sulpak открывает 20 новых магазинов техники', announce: 'Расширение в малых городах — Талды-Курган, Рудный, Жезказган.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/sulpak-20' },
  { title: 'Первый Казахстанский форум по кибербезопасности собрал 2 000 участников', announce: 'Алматы стал площадкой для обмена опытом в области InfoSec.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/cybersec-forum' },
  { title: 'Baiterek Holding наращивает портфель инфраструктурных проектов', announce: 'Инвестиции — 800 млрд тенге в дороги и больницы.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/baiterek-infra' },
  { title: 'Казахстан и Германия запускают совместный «зелёный» фонд', announce: 'Объём фонда — €500 млн, приоритет — ВИЭ-проекты.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kz-de-green-fund' },
  { title: 'ЕНПФ запускает личный пенсионный кабинет с ИИ-советником', announce: 'Пользователи получат персональные рекомендации по накоплениям.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/enpf-ai' },
  { title: 'Нур-Султан занял 1-е место среди городов ЦА по качеству воздуха', announce: 'Индекс AQI снизился на 18% после перехода на газовое отопление.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/aqi-nur-sultan' },
  { title: 'Казахстан выделяет $1 млрд на развитие квантовых технологий', announce: 'Создаётся национальный квантовый центр на базе НИИ.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/quantum-center' },
  { title: 'AiLabs.kz выпустил казахстанскую LLM-модель KazGPT', announce: 'Языковая модель обучена на казахских и русских текстах.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kazgpt' },
  { title: 'Казахстан подписал Конвенцию ООН по цифровому налогообложению', announce: 'Страна будет обмениваться данными о налогоплательщиках цифровых платформ.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/digital-tax-un' },
  { title: 'Колеса.кз запускает маркетплейс запчастей и услуг', announce: 'Новый раздел охватит более 5 000 автосервисов страны.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/kolesa-marketplace' },
  { title: 'Казахстан стал председателем ШОС в 2027 году', announce: 'Страна примет саммит ШОС в Алматы в июне 2027 года.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/sco-2027-almaty' },
  { title: 'Банк развития Казахстана профинансировал 200 проектов за год', announce: 'Общий объём кредитования — 1,5 трлн тенге.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/brk-200-projects' },
  { title: 'Казахстан откроет 5 новых технопарков в регионах', announce: 'Технопарки появятся в Актобе, Павлодаре, Костанае, Таразе и Семее.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/technopark-5-regions' },
  { title: 'OLX Казахстан — 10 млн объявлений за месяц', announce: 'Платформа установила рекорд активности пользователей.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/olx-10mln' },
  { title: 'QazCarbonBank открыл первую биржу углеродных кредитов', announce: 'Листинг 50 компаний-эмитентов углеродных единиц.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/carbon-bank' },
  { title: 'Казахстан увеличил субсидии на электромобили до 2 млн тенге', announce: 'Программа рассчитана на 10 000 покупателей EV ежегодно.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/ev-subsidy-2mln' },
  { title: 'Homsters.kz занял 75% рынка онлайн-аренды жилья', announce: 'Платформа расширяется в Шымкент и Актобе.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/homsters-75' },
  { title: 'Казахстанские учёные разработали биоразлагаемый пластик из отходов АПК', announce: 'Новый материал в 3 раза дешевле аналогов из нефти.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/bioplastic-agro' },
  { title: 'Казахстан и Индия договорились об увеличении товарооборота до $10 млрд', announce: 'Приоритеты — уран, фармацевтика и IT-услуги.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kz-india-10bln' },
  { title: 'Новый кодекс о СМИ принят в Казахстане', announce: 'Законодательство приведено в соответствие с международными стандартами.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/media-code-2026' },
  { title: 'ISMI Analytics — ведущая платформа медиамониторинга в Центральной Азии', announce: 'Платформа обрабатывает более 500 000 публикаций в сутки.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/ismi-analytics-leader' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const uniqueBIN = () => String(randInt(100000000000, 999999999999));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@ismi.kz',
        password: '12345'
    });
    if (authError) { console.error('Auth error:', authError); process.exit(1); }
    console.log('✅ Logged in as admin');

    // Count existing
    const { count: existOrgs } = await supabase.from('organizations').select('*', { count: 'exact', head: true });
    const { count: existProjs } = await supabase.from('projects').select('*', { count: 'exact', head: true });
    const { count: existArts } = await supabase.from('articles').select('*', { count: 'exact', head: true });

    console.log(`Existing: ${existOrgs} orgs, ${existProjs} projects, ${existArts} articles`);

    // ── Seed organizations ──────────────────────────────────────────────────
    const orgsToInsert = Math.max(0, 100 - existOrgs);
    console.log(`\nInserting ${orgsToInsert} organizations...`);
    const insertedOrgIds = [];

    for (let i = 0; i < orgsToInsert; i++) {
        const nameIdx = (existOrgs + i) % ORG_NAMES.length;
        const name = ORG_NAMES[nameIdx] + (i >= ORG_NAMES.length ? ` (${Math.floor(i / ORG_NAMES.length) + 1})` : '');
        const bin = uniqueBIN();
        const { data, error } = await supabase.from('organizations').insert({
            name,
            bin,
            city: rnd(CITIES),
            employee_limit: rnd([10,20,25,30,50,100]),
            project_limit: rnd([5,10,15,20]),
        }).select('id').single();

        if (error && error.code === '23505') {
            // BIN collision - retry
            const { data: d2 } = await supabase.from('organizations').insert({
                name, bin: uniqueBIN(), city: rnd(CITIES),
                employee_limit: 10, project_limit: 5,
            }).select('id').single();
            if (d2) insertedOrgIds.push(d2.id);
        } else if (data) {
            insertedOrgIds.push(data.id);
        }
        if (i % 10 === 9) { process.stdout.write('.'); await sleep(200); }
    }
    console.log(`\n✅ Organizations done`);

    // Get all org ids for project linking
    const { data: allOrgs } = await supabase.from('organizations').select('id').order('id', { ascending: true });
    const allOrgIds = (allOrgs || []).map(o => o.id);

    // ── Seed projects ────────────────────────────────────────────────────────
    const projsToInsert = Math.max(0, 100 - existProjs);
    console.log(`Inserting ${projsToInsert} projects...`);

    for (let i = 0; i < projsToInsert; i++) {
        const orgId = allOrgIds[i % allOrgIds.length];
        const template = PROJECT_TEMPLATES[i % PROJECT_TEMPLATES.length];
        const tags = TAGS[i % TAGS.length];
        const { error } = await supabase.from('projects').insert({
            organization_id: orgId,
            name: `${template} — ${ORG_NAMES[i % ORG_NAMES.length]}`,
            tags,
        });
        if (error) console.error(`Proj ${i} error:`, error.message);
        if (i % 10 === 9) { process.stdout.write('.'); await sleep(200); }
    }
    console.log(`\n✅ Projects done`);

    // ── Seed articles (need admin insert policy or service key) ──────────────
    // Articles RLS only allows SELECT for members. We'll add them via a workaround:
    // Check if we can insert (maybe admin policy was added)
    console.log(`\nAttempting to insert articles...`);
    const artToInsert = Math.max(0, 100 - existArts);
    let artInserted = 0;

    for (let i = 0; i < Math.min(artToInsert, ARTICLE_DATA.length); i++) {
        const art = ARTICLE_DATA[i % ARTICLE_DATA.length];
        const dayOffset = i * 8; // stagger by 8 hours
        const published = new Date(Date.now() - dayOffset * 3600 * 1000).toISOString();
        const { error } = await supabase.from('articles').insert({
            title: art.title,
            content: `<p>${art.announce}</p><p>Подробности на сайте ${art.source_name}. ${art.title} является важным событием для казахстанской экономики и медиапространства. Аналитики отмечают значительный интерес со стороны бизнеса и государственных структур к данной теме.</p><p>Читайте подробнее на <a href="${art.source_url}" target="_blank">${art.source_name}</a>.</p>`,
            announce: art.announce,
            source_name: art.source_name,
            source_url: art.source_url,
            published_at: published,
        });
        if (error) {
            if (error.code === '42501') {
                console.log('\n⚠️  RLS blocks article insert. Adding admin policy...');
                break;
            }
            console.error(`Article ${i} error:`, error.message);
        } else {
            artInserted++;
        }
        if (i % 10 === 9) { process.stdout.write('.'); await sleep(100); }
    }

    console.log(`\n✅ Articles inserted: ${artInserted}`);

    // Final count
    const { count: finalOrgs } = await supabase.from('organizations').select('*', { count: 'exact', head: true });
    const { count: finalProjs } = await supabase.from('projects').select('*', { count: 'exact', head: true });
    const { count: finalArts } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    console.log(`\nFinal counts: ${finalOrgs} orgs | ${finalProjs} projects | ${finalArts} articles`);
    console.log('\n🎉 Seed complete!');
    process.exit(0);
})();

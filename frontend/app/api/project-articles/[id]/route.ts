import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

const MOCK_100_ARTICLES = [
  { id: 101, title: 'Нацбанк снизил базовую ставку до 14,25%', announce: 'Решение принято на фоне замедления инфляции.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/economics/stavka-14-25', published_at: '2026-09-01T09:00:00Z' },
  { id: 102, title: 'Казахстан занял 28-е место в рейтинге WEF', announce: 'Страна улучшила позиции в рейтинге глобальной конкурентоспособности.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/news/wef-28', published_at: '2026-09-01T11:00:00Z' },
  { id: 103, title: 'ПИИ выросли на 18% за первое полугодие', announce: 'Объём прямых иностранных инвестиций — $14,2 млрд.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/pii-2026', published_at: '2026-09-02T08:00:00Z' },
  { id: 104, title: 'Запуск программы «Цифровая индустрия 2030»', announce: 'Правительство выделило 1,2 трлн тенге на цифровизацию.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/digital-industry', published_at: '2026-09-02T10:00:00Z' },
  { id: 105, title: 'КТК установил рекорд прокачки нефти — 6,4 млн тонн', announce: 'Рекорд за всю историю Каспийского трубопроводного консорциума.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ktk-record', published_at: '2026-09-03T07:00:00Z' },
  { id: 106, title: 'Новые правила господдержки МСБ', announce: 'Субсидии до 7% и гранты на цифровизацию 5 млн тенге.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/msb-2026', published_at: '2026-09-03T09:30:00Z' },
  { id: 107, title: 'Air Astana открывает рейсы в Берлин, Рим и Варшаву', announce: 'Три новых европейских маршрута с октября 2026 года.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/air-astana-eu', published_at: '2026-09-04T08:00:00Z' },
  { id: 108, title: 'KASE зафиксировала рекордный оборот — 8,9 трлн тенге', announce: 'Рост числа частных инвесторов втрое за два года.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kase-record', published_at: '2026-09-04T11:00:00Z' },
  { id: 109, title: 'Казатомпром наращивает производство урана на 12%', announce: 'Переговоры с АЭС США, Франции и Южной Кореи.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kazatomprom', published_at: '2026-09-05T07:30:00Z' },
  { id: 110, title: 'Открытие Центральноазиатского логистического хаба в Туркестане', announce: '120 000 м², 15 млн тонн грузов, 3 000 рабочих мест.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/logistic-hub', published_at: '2026-09-05T10:00:00Z' },
  { id: 111, title: 'Минфин предложил снизить НДС для IT до 8%', announce: 'Льгота охватит более 4 000 IT-компаний.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/nds-it', published_at: '2026-09-06T09:00:00Z' },
  { id: 112, title: 'Самрук-Казына выплатит рекордные дивиденды — 1,8 трлн тенге', announce: 'Рост на 22% по сравнению с 2025 годом.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/samruk-dividends', published_at: '2026-09-06T11:00:00Z' },
  { id: 113, title: 'Запуск крупнейшей СЭС в Центральной Азии — 500 МВт', announce: 'TotalEnergies и Казахстан открыли солнечную станцию.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ces-500', published_at: '2026-09-07T07:00:00Z' },
  { id: 114, title: 'Алматы вошёл в топ-30 умных городов мира', announce: 'Smart Cities Index 2026: 28-я строчка из 150 городов.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/smart-almaty', published_at: '2026-09-07T09:30:00Z' },
  { id: 115, title: 'Экспорт пшеницы вырос на 25%', announce: 'Казахстан экспортировал 6,1 млн тонн за 8 месяцев.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/wheat-export', published_at: '2026-09-07T12:00:00Z' },
  { id: 116, title: 'Казахстан и ЕС подписали соглашение о «зелёной» экономике', announce: 'Совместные инвестиции — 3 млрд евро до 2031 года.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/eu-green-deal', published_at: '2026-09-08T08:00:00Z' },
  { id: 117, title: 'Открытие QazTech Hub в Нур-Султане', announce: '120 IT-компаний, 3 венчурных фонда, лаборатории ИИ.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/qaztech-hub', published_at: '2026-09-08T10:00:00Z' },
  { id: 118, title: 'Банк ЦентрКредит объявил об IPO на KASE', announce: 'Объём размещения — 150 млрд тенге в Q4 2026.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/tsentrkredyt-ipo', published_at: '2026-09-08T12:00:00Z' },
  { id: 119, title: 'Tele2 инвестирует 45 млрд тенге в расширение 5G', announce: 'Покрытие 5G появится в Шымкенте, Актобе, Павлодаре.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/tele2-5g', published_at: '2026-09-09T06:00:00Z' },
  { id: 120, title: 'Казахстан вводит безвизовый режим для 15 стран ЕС', announce: 'Безвизовый въезд на 30 дней с 1 октября 2026 года.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/visa-free-eu', published_at: '2026-09-09T08:00:00Z' },
  { id: 121, title: 'Kaspi Bank занял первое место среди банков по активам', announce: 'Активы Kaspi превысили 15 трлн тенге.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kaspi-assets', published_at: '2026-09-09T09:00:00Z' },
  { id: 122, title: 'Казахстан в топ-10 стран по добыче урана', announce: 'Доля РК в мировой добыче — 43%.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/uran-top10', published_at: '2026-09-09T10:00:00Z' },
  { id: 123, title: 'КТЖ запускает скоростной поезд Алматы–Нур-Султан', announce: 'Время в пути сократится до 2 часов 40 минут.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ktj-train', published_at: '2026-09-09T11:00:00Z' },
  { id: 124, title: 'ЕНПФ показал доходность 9,7% за 2025 год', announce: 'Пенсионные накопления казахстанцев выросли на 8,2 трлн.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/enpf-2025', published_at: '2026-09-09T12:00:00Z' },
  { id: 125, title: 'Закон о защите персональных данных подписан Президентом', announce: 'Новые правила вступают в силу с 2027 года.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/personal-data-law', published_at: '2026-09-09T13:00:00Z' },
  { id: 126, title: 'Форум «Digital Almaty 2026» собрал 15 000 участников', announce: 'Обсуждались ИИ, квантовые технологии и метавселенная.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/digital-almaty-2026', published_at: '2026-09-09T14:00:00Z' },
  { id: 127, title: 'Правительство создаёт Агентство по развитию ИИ', announce: 'Бюджет агентства — 200 млрд тенге до 2030 года.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ai-agency', published_at: '2026-09-08T07:00:00Z' },
  { id: 128, title: 'Казахстан нарастил добычу нефти до 90 млн тонн в год', announce: 'Рост обусловлен расширением Тенгизского месторождения.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/oil-90mln', published_at: '2026-09-07T14:00:00Z' },
  { id: 129, title: 'Стартап GreenFarm.kz привлёк $5 млн инвестиций', announce: 'Компания разрабатывает умные системы полива для фермеров.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/greenfarm-5mln', published_at: '2026-09-07T10:00:00Z' },
  { id: 130, title: 'Рынок электромобилей в Казахстане вырос в 4 раза', announce: 'Продажи EV достигли 12 000 единиц за 8 месяцев 2026.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/ev-market', published_at: '2026-09-06T14:00:00Z' },
  { id: 131, title: 'Халык Банк запустил суперприложение Onai', announce: 'Новое приложение объединяет банкинг, страхование и маркетплейс.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/halyk-onai', published_at: '2026-09-06T08:00:00Z' },
  { id: 132, title: 'Казахстан лидирует в ЕАЭС по темпам роста ВВП', announce: 'Рост ВВП за полугодие — 5,3% — лучший показатель в союзе.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/gdp-eaeu', published_at: '2026-09-05T14:00:00Z' },
  { id: 133, title: 'Открытие первой в ЦА фабрики по производству микрочипов', announce: 'Совместный проект Казахстана и Южной Кореи.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/chip-factory', published_at: '2026-09-05T12:00:00Z' },
  { id: 134, title: 'Qazaq Airlines возобновляет международные рейсы', announce: 'Маршруты в Стамбул, Дубай и Москву с ноября 2026.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/qazaq-airlines', published_at: '2026-09-04T14:00:00Z' },
  { id: 135, title: 'В Казахстане введён углеродный налог', announce: 'Ставка — 5 000 тенге за тонну CO₂ с 2027 года.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/carbon-tax', published_at: '2026-09-04T10:00:00Z' },
  { id: 136, title: 'ForteBank завершил цифровую трансформацию за 3 года', announce: '95% операций клиентов — полностью онлайн.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/forte-digital', published_at: '2026-09-03T14:00:00Z' },
  { id: 137, title: 'Казахстан и Китай строят новый железнодорожный коридор', announce: 'Пропускная способность — 50 млн тонн в год.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/kz-cn-railway', published_at: '2026-09-03T12:00:00Z' },
  { id: 138, title: 'Объём рынка e-commerce Казахстана достиг $5 млрд', announce: 'Рост — 35% год к году, лидер — Kaspi.kz.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/ecommerce-5bln', published_at: '2026-09-02T14:00:00Z' },
  { id: 139, title: 'Казфармация завершает строительство фармзавода в Алматы', announce: 'Мощность завода — 200 млн упаковок медикаментов в год.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kazpharm', published_at: '2026-09-02T12:00:00Z' },
  { id: 140, title: 'Новый аэропорт Туркестана принял первых пассажиров', announce: 'Терминал рассчитан на 3 млн пассажиров в год.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/turkestan-airport', published_at: '2026-09-01T14:00:00Z' },
  { id: 141, title: 'Казахстан запускает национальную облачную инфраструктуру GovCloud', announce: 'Все государственные IT-системы переходят в единое облако.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/govcloud', published_at: '2026-09-01T12:00:00Z' },
  { id: 142, title: 'ЕНРЦ переходит на стандарт платежей ISO 20022', announce: 'Новый стандарт упростит международные платежи.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/iso-20022', published_at: '2026-08-31T09:00:00Z' },
  { id: 143, title: 'Казахстан вынесет строительство АЭС на референдум', announce: 'Голосование запланировано на ноябрь 2026 года.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/aes-referendum', published_at: '2026-08-31T11:00:00Z' },
  { id: 144, title: 'Экспорт IT-услуг вырос до $1,5 млрд за полугодие', announce: 'Казахстанские IT-компании активно расширяются в ЕС и СНГ.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/it-export-1-5', published_at: '2026-08-30T09:00:00Z' },
  { id: 145, title: 'Магнум Cash&Carry открывает 10 новых супермаркетов', announce: 'Расширение в Нур-Султане, Шымкенте и Актобе.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/magnum-expand', published_at: '2026-08-30T11:00:00Z' },
  { id: 146, title: 'Казцинк получил сертификацию LME Good Delivery', announce: 'Продукция признана соответствующей мировым стандартам качества.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kazcinc-lme', published_at: '2026-08-29T09:00:00Z' },
  { id: 147, title: 'МТРК «Хабар» переходит на производство контента в 4K', announce: 'Инвестиции в оборудование — 3 млрд тенге.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/habar-4k', published_at: '2026-08-29T11:00:00Z' },
  { id: 148, title: 'Колеса.кз собрал рекордную аудиторию — 5 млн пользователей', announce: 'Платформа занимает 80% рынка авторекламы в Казахстане.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kolesa-5mln', published_at: '2026-08-28T09:00:00Z' },
  { id: 149, title: 'Chocofamily Holding объявил о листинге на AIX', announce: 'Размещение акций на Astana International Exchange — Q1 2027.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/choco-aix', published_at: '2026-08-28T11:00:00Z' },
  { id: 150, title: 'В Казахстане создадут Фонд поддержки медиаотрасли', announce: 'Государство выделит 10 млрд тенге на поддержку редакций.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/media-fund', published_at: '2026-08-27T09:00:00Z' },
  { id: 151, title: 'Байер Казахстан выводит новую линейку агропрепаратов', announce: 'Инновационные средства защиты растений для казахстанского климата.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/bayer-agro', published_at: '2026-08-27T11:00:00Z' },
  { id: 152, title: 'Нур-Султан вошёл в топ-20 городов по уровню жизни', announce: 'Рейтинг Mercer Quality of Living 2026.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/nur-sultan-mercer', published_at: '2026-08-26T09:00:00Z' },
  { id: 153, title: 'Казахстан увеличил объём ВИЭ в энергобалансе до 7%', announce: 'Ветроэнергетика и СЭС выработали 12 ТВт·ч за год.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/renewable-energy-7', published_at: '2026-08-26T11:00:00Z' },
  { id: 154, title: 'АрселорМиттал инвестирует $2 млрд в модернизацию завода', announce: 'Переход на «зелёную» технологию выплавки стали в Темиртау.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/arcelormittal-2bln', published_at: '2026-08-25T09:00:00Z' },
  { id: 155, title: 'Казахстан занял 3-е место в ЦА по индексу развития ИИ', announce: 'Высокий рейтинг по числу AI-стартапов и исследователей.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/ai-index-ca', published_at: '2026-08-25T11:00:00Z' },
  { id: 156, title: 'Единый транспортный пропуск ЕАЭС запустят в 2027 году', announce: 'Казахстан выступает инициатором проекта.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/eaeu-transport-pass', published_at: '2026-08-24T09:00:00Z' },
  { id: 157, title: 'KEGOC завершает строительство ЛЭП «Север–Юг»', announce: 'Линия позволит балансировать энергосистему всей страны.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/kegoc-north-south', published_at: '2026-08-24T11:00:00Z' },
  { id: 158, title: 'ВВП Казахстана превысит $300 млрд по итогам 2026 года', announce: 'Прогноз МВФ — рост экономики на 5,1%.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/gdp-300bln', published_at: '2026-08-23T09:00:00Z' },
  { id: 159, title: 'Новые требования к ESG-отчётности для компаний на KASE', announce: 'Листинговые компании раскрывают климатические риски с 2027 года.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/esg-reporting', published_at: '2026-08-23T11:00:00Z' },
  { id: 160, title: 'Казмунайгаз вошёл в Fortune Global 500', announce: 'Компания заняла 487-ю строчку в глобальном рейтинге.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kmg-fortune-500', published_at: '2026-08-22T09:00:00Z' },
  { id: 161, title: 'Казахстан открывает первый центр кибербезопасности SOC 2', announce: 'Центр будет защищать критическую инфраструктуру государства.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/soc2-center', published_at: '2026-08-22T11:00:00Z' },
  { id: 162, title: 'EXPO-2030 подтвердила заявку Алматы', announce: 'Алматы примёт Всемирную выставку EXPO в 2030 году.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/expo-2030', published_at: '2026-08-21T09:00:00Z' },
  { id: 163, title: 'Jusan Bank внедряет биометрическую верификацию', announce: 'Идентификация займёт 10 секунд без посещения офиса.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/jusan-biometric', published_at: '2026-08-21T11:00:00Z' },
  { id: 164, title: 'Казахстан и Саудовская Аравия договорились об инвестициях $10 млрд', announce: 'Приоритеты — энергетика, АПК и туризм.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kz-sa-10bln', published_at: '2026-08-20T09:00:00Z' },
  { id: 165, title: 'Нур-Султан открывает 5 новых станций метро', announce: 'Протяжённость метрополитена достигнет 18 км.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/nursultan-metro-5', published_at: '2026-08-20T11:00:00Z' },
  { id: 166, title: 'Рейтинг кредитоспособности Казахстана повышен до BBB+', announce: 'Standard & Poors улучшило прогноз с нейтрального до позитивного.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/sp-bbb-plus', published_at: '2026-08-19T09:00:00Z' },
  { id: 167, title: 'Казахстан станет хабом для экспорта «зелёного» водорода', announce: 'Меморандум с ЕС о строительстве водородного трубопровода подписан.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/hydrogen-hub', published_at: '2026-08-19T11:00:00Z' },
  { id: 168, title: 'Казахстанский стартап HealthAI привлёк $3 млн', announce: 'Платформа использует ИИ для ранней диагностики онкологии.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/healthai-3mln', published_at: '2026-08-18T09:00:00Z' },
  { id: 169, title: 'Интегрированная платёжная система ЦА запустится в 2027 году', announce: 'Казахстан, Кыргызстан и Таджикистан договорились о совместном проекте.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/ca-payment-system', published_at: '2026-08-18T11:00:00Z' },
  { id: 170, title: 'QazaqGaz завершает газопровод в Южный Казахстан', announce: 'Газификация 150 населённых пунктов к 2027 году.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/qazaqgaz-south', published_at: '2026-08-17T09:00:00Z' },
  { id: 171, title: 'Forbes Kazakhstan назвал топ-50 богатейших людей страны', announce: 'Совокупное состояние топ-50 превысило $60 млрд.', source_name: 'Forbes Kazakhstan', source_url: 'https://forbes.kz/rating/top50-2026', published_at: '2026-08-17T11:00:00Z' },
  { id: 172, title: 'Государственная программа «100 школ» завершена досрочно', announce: 'Построены школы в сёлах с острой нехваткой учебных мест.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/100-schools', published_at: '2026-08-16T09:00:00Z' },
  { id: 173, title: 'Медиа Корпорация «Мир» запускает новостной стриминг MIRTV.kz', announce: 'Ежедневное вещание 24/7 на русском и казахском языках.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/mirtv-streaming', published_at: '2026-08-16T11:00:00Z' },
  { id: 174, title: 'Чемпионат мира по боксу 2027 пройдёт в Алматы', announce: 'Казахстан выиграл право на проведение чемпионата у Бразилии.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/boxing-wc-2027', published_at: '2026-08-15T09:00:00Z' },
  { id: 175, title: 'КазТелеком выводит на рынок IoT-платформу для умных городов', announce: 'Платформа интегрирует 500+ городских IoT-устройств.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/kaztelekom-iot', published_at: '2026-08-15T11:00:00Z' },
  { id: 176, title: 'В Казахстане принят новый Налоговый кодекс', announce: 'Кодекс снижает налоговую нагрузку на бизнес на 15%.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/tax-code-2026', published_at: '2026-08-14T09:00:00Z' },
  { id: 177, title: 'Казахстан запускает спутник для мониторинга экологии KazEcoSat', announce: 'Спутник будет наблюдать за состоянием Арала и степей.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/kazecosat', published_at: '2026-08-14T11:00:00Z' },
  { id: 178, title: 'Рынок недвижимости Алматы: цены стабилизировались', announce: 'Средняя цена за м² — 750 000 тенге, рост 2% за квартал.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/realty-almaty', published_at: '2026-08-13T09:00:00Z' },
  { id: 179, title: 'Kcell переходит на eSIM для всех тарифных планов', announce: 'eSIM доступна через мобильное приложение с ноября 2026.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/kcell-esim', published_at: '2026-08-13T11:00:00Z' },
  { id: 180, title: 'Kazakh TV International расширяется на аудиторию Европы', announce: 'Новое вещание охватит 15 стран ЕС с декабря 2026.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kazakhtv-eu', published_at: '2026-08-12T09:00:00Z' },
  { id: 181, title: 'Sulpak открывает 20 новых магазинов техники в малых городах', announce: 'Расширение в Талды-Кургане, Рудном и Жезказгане.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/sulpak-20', published_at: '2026-08-12T11:00:00Z' },
  { id: 182, title: 'Первый Казахстанский форум по кибербезопасности собрал 2 000 участников', announce: 'Алматы стал площадкой для обмена опытом в области InfoSec.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/cybersec-forum', published_at: '2026-08-11T09:00:00Z' },
  { id: 183, title: 'Baiterek Holding наращивает инфраструктурный портфель', announce: 'Инвестиции — 800 млрд тенге в дороги и больницы.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/baiterek-infra', published_at: '2026-08-11T11:00:00Z' },
  { id: 184, title: 'Казахстан и Германия запускают совместный «зелёный» фонд', announce: 'Объём фонда — €500 млн, приоритет — ВИЭ-проекты.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kz-de-green-fund', published_at: '2026-08-10T09:00:00Z' },
  { id: 185, title: 'ЕНПФ запускает личный пенсионный кабинет с ИИ-советником', announce: 'Пользователи получат персональные рекомендации по накоплениям.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/enpf-ai', published_at: '2026-08-10T11:00:00Z' },
  { id: 186, title: 'Нур-Султан занял 1-е место в ЦА по качеству воздуха', announce: 'Индекс AQI снизился на 18% после перехода на газовое отопление.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/aqi-nur-sultan', published_at: '2026-08-09T09:00:00Z' },
  { id: 187, title: 'Казахстан выделяет $1 млрд на развитие квантовых технологий', announce: 'Создаётся национальный квантовый центр на базе НИИ.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/quantum-center', published_at: '2026-08-09T11:00:00Z' },
  { id: 188, title: 'AiLabs.kz выпустил казахстанскую языковую модель KazGPT', announce: 'Модель обучена на казахских и русских текстах.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kazgpt', published_at: '2026-08-08T09:00:00Z' },
  { id: 189, title: 'Казахстан подписал Конвенцию ООН по цифровому налогообложению', announce: 'Страна будет обмениваться данными о налогоплательщиках платформ.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/digital-tax-un', published_at: '2026-08-08T11:00:00Z' },
  { id: 190, title: 'Колеса.кз запускает маркетплейс запчастей и услуг', announce: 'Новый раздел охватит более 5 000 автосервисов страны.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/kolesa-marketplace', published_at: '2026-08-07T09:00:00Z' },
  { id: 191, title: 'Казахстан стал председателем ШОС в 2027 году', announce: 'Страна примет саммит ШОС в Алматы в июне 2027 года.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/sco-2027-almaty', published_at: '2026-08-07T11:00:00Z' },
  { id: 192, title: 'Банк развития Казахстана профинансировал 200 проектов за год', announce: 'Общий объём кредитования — 1,5 трлн тенге.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/brk-200-projects', published_at: '2026-08-06T09:00:00Z' },
  { id: 193, title: 'Казахстан откроет 5 новых технопарков в регионах', announce: 'Технопарки появятся в Актобе, Павлодаре, Костанае, Таразе и Семее.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/technopark-5-regions', published_at: '2026-08-06T11:00:00Z' },
  { id: 194, title: 'OLX Казахстан — 10 млн объявлений за месяц', announce: 'Платформа установила рекорд активности пользователей.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/olx-10mln', published_at: '2026-08-05T09:00:00Z' },
  { id: 195, title: 'QazCarbonBank открыл первую биржу углеродных кредитов', announce: 'Листинг 50 компаний-эмитентов углеродных единиц.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/carbon-bank', published_at: '2026-08-05T11:00:00Z' },
  { id: 196, title: 'Казахстан увеличил субсидии на электромобили до 2 млн тенге', announce: 'Программа рассчитана на 10 000 покупателей EV ежегодно.', source_name: 'Zakon.kz', source_url: 'https://zakon.kz/ev-subsidy-2mln', published_at: '2026-08-04T09:00:00Z' },
  { id: 197, title: 'Homsters.kz занял 75% рынка онлайн-аренды жилья', announce: 'Платформа расширяется в Шымкент и Актобе.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/homsters-75', published_at: '2026-08-04T11:00:00Z' },
  { id: 198, title: 'Казахстанские учёные разработали биоразлагаемый пластик из АПК-отходов', announce: 'Новый материал в 3 раза дешевле аналогов из нефти.', source_name: 'Informburo.kz', source_url: 'https://informburo.kz/bioplastic-agro', published_at: '2026-08-03T09:00:00Z' },
  { id: 199, title: 'Казахстан и Индия договорились об увеличении товарооборота до $10 млрд', announce: 'Приоритеты — уран, фармацевтика и IT-услуги.', source_name: 'Tengrinews.kz', source_url: 'https://tengrinews.kz/kz-india-10bln', published_at: '2026-08-03T11:00:00Z' },
  { id: 200, title: 'ISMI Analytics — ведущая платформа медиамониторинга ЦА', announce: 'Платформа обрабатывает более 500 000 публикаций в сутки.', source_name: 'Kursiv.media', source_url: 'https://kursiv.media/ismi-analytics-leader', published_at: '2026-09-09T17:00:00Z' },
];

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : (await auth())?.user?.token;
        const supabase = createSupabaseServerClient(token);
        const { id: rawId } = await params;
        const projectId = parseInt(rawId);

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1') || 1;
        const onlyFavorite = searchParams.get('favorite') === 'true' || searchParams.get('favorite') === '1';
        const sort = searchParams.get('sort') || 'desc';
        const limit = 10;
        const from = (page - 1) * limit;

        // Try DB first
        const { data: dbArticles, count: dbCount } = await supabase
            .from('articles')
            .select('*', { count: 'exact' })
            .order('published_at', { ascending: sort === 'asc' })
            .range(from, from + limit - 1);

        const dbTotal = dbCount ?? 0;

        if (dbTotal > 0 && dbArticles && dbArticles.length > 0) {
            const members = dbArticles.map(art => ({
                '@id': `/api/project-articles/${art.id}`,
                '@type': 'ProjectArticle',
                id: art.id,
                article: {
                    '@id': `/api/articles/${art.id}`,
                    id: art.id,
                    title: art.title,
                    content: art.content,
                    announce: art.announce,
                    sourceUrl: art.source_url,
                    sourceName: art.source_name,
                    publishedAt: art.published_at,
                    createdAt: art.created_at,
                    imageUrl: null,
                    comments: [],
                    canReply: false,
                },
                favorite: false
            }));
            const lastPage = Math.max(1, Math.ceil(dbTotal / limit));
            return NextResponse.json({
                '@context': '/api/contexts/ProjectArticle',
                '@id': `/api/project-articles/${projectId}`,
                '@type': 'hydra:Collection',
                'hydra:totalItems': dbTotal,
                'hydra:member': members,
                'hydra:view': {
                    '@id': `/api/project-articles/${projectId}?page=${page}`,
                    '@type': 'hydra:PartialCollectionView',
                    'hydra:first': `/api/project-articles/${projectId}?page=1`,
                    'hydra:last': `/api/project-articles/${projectId}?page=${lastPage}`,
                    ...(page < lastPage ? { 'hydra:next': `/api/project-articles/${projectId}?page=${page + 1}` } : {})
                }
            });
        }

        // Fallback: static 100-article mock dataset
        let articles = [...MOCK_100_ARTICLES];
        if (sort === 'asc') articles.reverse();
        const total = articles.length;
        const lastPage = Math.max(1, Math.ceil(total / limit));
        const pageItems = articles.slice(from, from + limit);

        const members = pageItems.map(art => ({
            '@id': `/api/project-articles/${art.id}`,
            '@type': 'ProjectArticle',
            id: art.id,
            article: {
                '@id': `/api/articles/${art.id}`,
                id: art.id,
                title: art.title,
                content: `<p>${art.announce}</p><p>Полный материал доступен на сайте <a href="${art.source_url}" target="_blank">${art.source_name}</a>. Данная публикация является важным событием для казахстанской медиасреды и бизнес-аналитики.</p>`,
                announce: art.announce,
                sourceUrl: art.source_url,
                sourceName: art.source_name,
                publishedAt: art.published_at,
                createdAt: art.published_at,
                imageUrl: null,
                comments: [],
                canReply: false,
            },
            favorite: false
        }));

        return NextResponse.json({
            '@context': '/api/contexts/ProjectArticle',
            '@id': `/api/project-articles/${projectId}`,
            '@type': 'hydra:Collection',
            'hydra:totalItems': total,
            'hydra:member': members,
            'hydra:view': {
                '@id': `/api/project-articles/${projectId}?page=${page}`,
                '@type': 'hydra:PartialCollectionView',
                'hydra:first': `/api/project-articles/${projectId}?page=1`,
                'hydra:last': `/api/project-articles/${projectId}?page=${lastPage}`,
                ...(page < lastPage ? { 'hydra:next': `/api/project-articles/${projectId}?page=${page + 1}` } : {})
            }
        });
    } catch {
        return NextResponse.json({
            '@context': '/api/contexts/ProjectArticle',
            '@id': '/api/project-articles',
            '@type': 'hydra:Collection',
            'hydra:totalItems': 0,
            'hydra:member': []
        });
    }
}

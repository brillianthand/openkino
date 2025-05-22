const mongoose = require("mongoose");
require("dotenv").config();

// Импорт модели фильма
const Movie = require("./models/Movie");

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/netflix", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Данные фильмов для наполнения базы данных
const movieData = [
  // Фильмы из ассетов
  {
    title: "Black Mirror",
    poster: "/assets/black_mirror.jpg",
    description:
      "Антология научно-фантастических историй, исследующих тёмную сторону технологического прогресса и его влияние на общество и человеческую психику.",
    genres: "Драма, Триллер, Фантастика",
    cast: "Джесси Племонс, Кристин Милиоти, Розмари ДеУитт, Брайс Даллас Ховард",
    director: "Чарли Брукер, Оуэн Харрис, Карл Тиббеттс",
    rating: "18+",
    year: "2011",
    duration: "60 мин",
    quality: "4K",
    type: "trending",
  },
  {
    title: "Adolescence",
    poster: "/assets/adolescence.jpg",
    description:
      "Драматическая история взросления трудного подростка, который сталкивается с первой любовью, наркотиками и преодолением жизненных испытаний.",
    genres: "Драма, Романтика, Взросление",
    cast: "Мики Ривер, Грейс Ван Дин, Томми Флэнаган, Элизабет Рём",
    director: "Эшли Эйвисон",
    rating: "16+",
    year: "2018",
    duration: "1ч 39м",
    quality: "HD",
    type: "popular",
  },
  {
    title: "Havoc",
    poster: "/assets/havoc.jpg",
    description:
      "Обученный боец отправляется в криминальный мир, чтобы спасти сына политика после неудачной сделки с наркотиками. Исследуя преступный мир, он раскрывает сеть коррупции в городе.",
    genres: "Боевик, Криминал, Триллер",
    cast: "Том Харди, Форест Уитакер, Тимоти Олифант, Джесси Мей Ли",
    director: "Гарет Эванс",
    rating: "18+",
    year: "2021",
    duration: "2ч 11м",
    quality: "4K",
    type: "trending",
  },
  {
    title: "You",
    poster: "/assets/you_series.jpg",
    description:
      "Умный книжный менеджер влюбляется в молодую писательницу и постепенно становится одержимым, используя социальные сети и технологии для контроля всех аспектов ее жизни, устраняя любые препятствия на своем пути.",
    genres: "Драма, Триллер, Психологический",
    cast: "Пенн Бэджли, Виктория Педретти, Элизабет Лэил, Шей Митчелл",
    director: "Грег Берланти, Сера Гэмбл",
    rating: "18+",
    year: "2018",
    duration: "45 мин",
    quality: "4K",
    type: "popular",
  },
  {
    title: "Exterritorial",
    poster: "/assets/exterritorial.jpg",
    description:
      "Фантастический триллер о международной космической станции, где экипаж сталкивается с инопланетной угрозой и должен бороться не только с внешней опасностью, но и с внутренними конфликтами.",
    genres: "Фантастика, Триллер, Ужасы",
    cast: "Оскар Айзек, Софи Тэтчер, Джаред Лето, Ребекка Фергюсон",
    director: "Дени Вильнёв",
    rating: "16+",
    year: "2023",
    duration: "1ч 56м",
    quality: "4K",
    type: "newReleases",
  },

  // Trending
  {
    title: "Stranger Things",
    poster:
      "https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LWE0ZDktYThjOTZiZjhhN2Q2XkEyXkFqcGdeQXVyNjgxNTQ3Mjk@._V1_.jpg",
    description:
      "Когда мальчик пропадает без вести, целый город участвует в поисках. Но вместо него они находят девушку со сверхъестественными способностями.",
    genres: "Драма, Фантастика, Ужасы",
    cast: "Милли Бобби Браун, Финн Вулфхард, Вайнона Райдер",
    director: "Мэтт Даффер, Росс Даффер",
    rating: "16+",
    year: "2016",
    duration: "50 мин",
    quality: "4K",
    type: "trending",
  },
  {
    title: "Money Heist",
    poster: "/assets/money_heist.png",
    description:
      "Восемь воров берут заложников в Королевском монетном дворе Испании, пока криминальный гений манипулирует полицией.",
    genres: "Боевик, Криминал, Драма",
    cast: "Урсула Корберо, Альваро Морте, Ицияр Итуньо",
    director: "Хесус Кольменар, Алекс Родриго",
    rating: "18+",
    year: "2017",
    duration: "70 мин",
    quality: "HD",
    type: "trending",
  },

  // Popular
  {
    title: "Breaking Bad",
    poster:
      "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    description:
      "Школьный учитель химии, узнав, что болен раком, решает заняться производством метамфетамина, чтобы обеспечить финансовое будущее своей семьи.",
    genres: "Криминал, Драма, Триллер",
    cast: "Брайан Крэнстон, Аарон Пол, Анна Ганн",
    director: "Винс Гиллиган",
    rating: "18+",
    year: "2008",
    duration: "49 мин",
    quality: "4K",
    type: "popular",
  },
  {
    title: "The Witcher",
    poster:
      "/assets/witch.png",
    description:
      "Ведьмак Геральт из Ривии, мутант и убийца чудовищ, путешествует по континенту, заполненному опасными монстрами.",
    genres: "Фэнтези, Приключения, Драма",
    cast: "Генри Кавилл, Фрейя Аллан, Аня Чалотра",
    director: "Алик Сахаров, Шарлотта Брандстрём",
    rating: "18+",
    year: "2019",
    duration: "60 мин",
    quality: "4K",
    type: "popular",
  },

  // New Releases
  {
    title: "Wednesday",
    poster:
      "/assets/wednesday.png",
    description:
      "Венсдей Аддамс посещает академию Невермор. Там она пытается овладеть своими психическими способностями, предотвратить массовые убийства и раскрыть тайну.",
    genres: "Комедия, Криминал, Фэнтези",
    cast: "Дженна Ортега, Эмма Майерс, Кэтрин Зета-Джонс",
    director: "Тим Бёртон",
    rating: "16+",
    year: "2022",
    duration: "45 мин",
    quality: "4K",
    type: "newReleases",
  },
  {
    title: "Squid Game",
    poster:
      "/assets/sgame.png",
    description:
      "Сотни игроков, нуждающихся в деньгах, принимают странное приглашение на участие в детских играх. Внутри их ждет соблазнительный приз и смертельный риск.",
    genres: "Боевик, Драма, Триллер",
    cast: "Ли Чон-джэ, Пак Хэ-су, Ви Ха-джун",
    director: "Хван Дон-хёк",
    rating: "18+",
    year: "2021",
    duration: "55 мин",
    quality: "4K",
    type: "newReleases",
  },
];

// Функция для заполнения базы данных
const seedDB = async () => {
  try {
    // Очистка существующих данных
    await Movie.deleteMany({});
    console.log("Удалены все существующие записи");

    // Вставка новых данных
    const createdMovies = await Movie.insertMany(movieData);
    console.log(`Добавлено ${createdMovies.length} фильмов в базу данных`);

    // Закрытие соединения с MongoDB
    mongoose.connection.close();
    console.log("Соединение с MongoDB закрыто");
  } catch (error) {
    console.error("Ошибка при заполнении базы данных:", error);
    mongoose.connection.close();
  }
};

// Запуск функции заполнения
seedDB();

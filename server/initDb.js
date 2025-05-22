const { spawn } = require("child_process");
const path = require("path");

console.log("Начинаем инициализацию базы данных...");

// Функция для запуска скрипта и ожидания его завершения
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`Запуск скрипта: ${scriptPath}`);

    const process = spawn("node", [scriptPath], { stdio: "inherit" });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Скрипт завершился с кодом: ${code}`));
        return;
      }
      resolve();
    });
  });
}

// Пути к скриптам
const seedUsersPath = path.join(__dirname, "seedUsers.js");
const updateWatchlistsPath = path.join(__dirname, "updateWatchlists.js");

// Запускаем скрипты последовательно
async function init() {
  try {
    // Шаг 1: Создание пользователей
    console.log("\n===== ШАГ 1: Создание пользователей =====");
    await runScript(seedUsersPath);

    // Шаг 2: Обновление списков просмотра
    console.log("\n===== ШАГ 2: Обновление списков просмотра =====");
    await runScript(updateWatchlistsPath);

    console.log("\n===== Инициализация базы данных завершена успешно! =====");
  } catch (error) {
    console.error("Ошибка при инициализации базы данных:", error.message);
    process.exit(1);
  }
}

// Запускаем процесс инициализации
init();

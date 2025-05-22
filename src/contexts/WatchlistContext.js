import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "../auth";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastError, setLastError] = useState(null); // Хранить последнюю ошибку
  const { isAuthenticated, authAxios } = useAuth();

  // Отладочная информация при обновлениях
  useEffect(() => {
    console.log(
      "WatchlistProvider: состояние isAuthenticated изменилось:",
      isAuthenticated
    );
    console.log("WatchlistProvider: текущий размер списка:", watchlist.length);
  }, [isAuthenticated, watchlist.length]);

  // Fetch watchlist from backend when component mounts or authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log(
        "WatchlistProvider: запрос списка просмотра для авторизованного пользователя"
      );
      fetchWatchlist();
    } else {
      console.log(
        "WatchlistProvider: очистка списка просмотра для неавторизованного пользователя"
      );
      setWatchlist([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Get watchlist from the backend
  const fetchWatchlist = async () => {
    if (!isAuthenticated) {
      console.log("fetchWatchlist: пользователь не авторизован");
      setWatchlist([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLastError(null);

    try {
      // Логируем baseURL объекта authAxios
      console.log(
        "fetchWatchlist: baseURL =",
        authAxios.defaults.baseURL || "не задан"
      );
      console.log("fetchWatchlist: отправка запроса на получение списка");

      // Проверяем, какой URL будет использоваться
      const watchlistUrl = "/watchlist";
      console.log(
        "fetchWatchlist: полный URL =",
        (authAxios.defaults.baseURL || "") + watchlistUrl
      );

      const response = await authAxios.get(watchlistUrl);
      console.log("fetchWatchlist: ответ получен", response.data);

      if (Array.isArray(response.data)) {
        // Вместо простого присваивания используем метод чтобы убедиться, что React заметит изменения
        const moviesData = response.data.map((movie) => ({
          ...movie,
          _id: String(movie._id), // Преобразуем ID в строку для единообразия
        }));

        setWatchlist(moviesData);
        console.log(
          "fetchWatchlist: список обновлен, элементов:",
          moviesData.length
        );
        console.log(
          "fetchWatchlist: IDs в списке:",
          moviesData.map((movie) => movie._id).join(", ")
        );
      } else {
        console.error("fetchWatchlist: неверный формат данных", response.data);
        setWatchlist([]);
      }
    } catch (error) {
      console.error(
        "fetchWatchlist: ошибка при получении списка:",
        error.message
      );
      setLastError(error.message);

      if (error.response) {
        console.error("fetchWatchlist: статус ответа:", error.response.status);
        console.error("fetchWatchlist: данные ответа:", error.response.data);
        // Логируем URL, на который был сделан запрос
        console.error("fetchWatchlist: URL запроса:", error.config.url);
        console.error(
          "fetchWatchlist: полный URL:",
          error.config.baseURL + error.config.url
        );
      }

      // Если у нас нет данных по API, используем пустой список
      setWatchlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a movie is in the watchlist
  const isInWatchlist = (movieId) => {
    if (!movieId || !watchlist || !Array.isArray(watchlist)) {
      return false;
    }

    // Преобразуем movieId в строку для корректного сравнения
    const movieIdStr = String(movieId);

    // Проверяем, есть ли фильм в списке
    return watchlist.some((movie) => {
      if (!movie || !movie._id) return false;
      return String(movie._id) === movieIdStr;
    });
  };

  // Add movie to watchlist
  const addToWatchlist = async (movie) => {
    if (!isAuthenticated) {
      console.error(
        "Невозможно добавить в список - пользователь не авторизован"
      );
      return false;
    }

    if (!movie || !movie._id) {
      console.error("Ошибка: передан неверный объект фильма:", movie);
      return false;
    }

    try {
      console.log("НАЧАЛО ДОБАВЛЕНИЯ ФИЛЬМА В СПИСОК:", movie._id);
      console.log(
        "authAxios baseURL =",
        authAxios.defaults.baseURL || "не задан"
      );

      // Преобразуем ID в строку для корректного сравнения
      const movieId = String(movie._id);

      // Проверим, есть ли фильм уже в списке
      if (isInWatchlist(movieId)) {
        console.log("Фильм уже в списке, пропускаем запрос:", movie.title);
        return true;
      }

      // Сначала добавим фильм в UI без ожидания ответа от сервера
      console.log("Добавляем фильм в UI");
      setWatchlist((prevWatchlist) => [...prevWatchlist, movie]);

      // Формируем URL для запроса
      const addUrl = `/watchlist/add/${movieId}`;
      console.log("ОТПРАВЛЯЕМ запрос на добавление фильма:", movieId);
      console.log("URL запроса:", addUrl);
      console.log("Полный URL:", (authAxios.defaults.baseURL || "") + addUrl);

      // Отправляем запрос на сервер
      const response = await authAxios.post(addUrl, {
        movieId: movieId,
      });

      console.log("ПОЛУЧЕН ОТВЕТ от сервера:", response.data);

      // Если запрос был успешным, но хотим убедиться, что UI и сервер синхронизированы
      if (response.data.success) {
        console.log(
          "Успешно добавлено на сервере. Обновляем UI со списком с сервера."
        );
        // Обновим список принудительно после успешного добавления
        fetchWatchlist().catch((err) => {
          console.error("Ошибка при обновлении списка после добавления:", err);
        });
      }

      console.log("ЗАВЕРШЕНО ДОБАВЛЕНИЕ в список:", movie.title);
      return true;
    } catch (error) {
      console.error("ОШИБКА при добавлении фильма в список:", error.message);
      if (error.response) {
        console.error("Статус ответа:", error.response.status);
        console.error("Данные ответа:", error.response.data);
        console.error("URL запроса:", error.config.url);
        if (error.config.baseURL) {
          console.error("baseURL:", error.config.baseURL);
          console.error("Полный URL:", error.config.baseURL + error.config.url);
        }
      }
      // Откатываем оптимистичное обновление при ошибке
      console.log("Отмена временного добавления фильма в UI");
      setWatchlist((prev) =>
        prev.filter((m) => String(m._id) !== String(movie._id))
      );
      return false;
    }
  };

  // Remove movie from watchlist
  const removeFromWatchlist = async (movieId) => {
    if (!isAuthenticated) {
      console.error(
        "Невозможно удалить из списка - пользователь не авторизован"
      );
      return false;
    }

    try {
      // Преобразуем ID в строку для корректного сравнения
      const movieIdStr = String(movieId);

      // Сначала обновим UI, не дожидаясь ответа от сервера
      console.log("Удаляем фильм из UI:", movieIdStr);
      // Создаем временную копию списка для быстрого UI-отклика
      const updatedWatchlist = watchlist.filter(
        (movie) => String(movie._id) !== movieIdStr
      );
      setWatchlist(updatedWatchlist);

      // Формируем URL для запроса
      const removeUrl = `/watchlist/remove/${movieIdStr}`;
      console.log("Отправка запроса на удаление фильма:", movieIdStr);
      console.log("URL запроса:", removeUrl);
      console.log(
        "Полный URL:",
        (authAxios.defaults.baseURL || "") + removeUrl
      );

      // Отправляем запрос на сервер
      const response = await authAxios.delete(removeUrl);
      console.log("Ответ сервера:", response.data);

      // Если запрос был успешным, синхронизируем с сервером
      if (response.data.success) {
        console.log("Успешно удалено на сервере. Синхронизируем с сервером.");
        // Обновим список принудительно после успешного удаления
        await fetchWatchlist();
      }

      return true;
    } catch (error) {
      console.error("Ошибка при удалении из списка:", error.message);
      if (error.response) {
        console.error("Статус ответа:", error.response.status);
        console.error("Данные ответа:", error.response.data);
        console.error("URL запроса:", error.config.url);
        if (error.config.baseURL) {
          console.error("baseURL:", error.config.baseURL);
          console.error("Полный URL:", error.config.baseURL + error.config.url);
        }
      }

      // Восстанавливаем список из сервера при ошибке
      fetchWatchlist().catch((err) => {
        console.error(
          "Ошибка при восстановлении списка после ошибки удаления:",
          err
        );
      });

      return false;
    }
  };

  // Clear entire watchlist
  const clearWatchlist = async () => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      await authAxios.delete(`/watchlist/clear`);

      // Обновим список после очистки
      setWatchlist([]);
      return true;
    } catch (error) {
      console.error("Error clearing watchlist:", error);
      return false;
    }
  };

  const value = {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    clearWatchlist,
    isInWatchlist,
    fetchWatchlist,
    lastError,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

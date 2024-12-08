//---------------------------------GENERAL-----------------------------------------//
// Создаем новое WebSocket соединение
// Заменяем http на ws для WebSocket
let host = "ws://localhost:8888";

// client -> подключение к серверу
// сервер - получил подключение (получил клиента)
// client | id | <- вернуть id клиента для web socket от server

// client дай список пользователей -> server
// client <- вернуть список пользователей (без текущего client id) server

// client | get_users | (выбирает пользователя)
// client -> дай список сообщений с этим пользователем server
// client <- | get_users | вернуть список сообщений с этим пользователей server

// client | message | (отправляет сообщение) -> server
// client <- | message | вернуть id клиента, который получил сообщение server

window.onload = function () {
  // Кнопка отправки
  let sendBtn = document.getElementById("send");
  // Отправляем сообщение при нажатии кнопки "Отправить"
  sendBtn.onclick = function (event) {
    console.log("sendBtn clicked");
    sendMessage();
  };

  // Кнопка закрытия
  let closeBtn = document.getElementById("close");

  // Поле для ввода сообщения
  let messageField = document.getElementById("message-area");

  // Список сообщений
  let messageList = document.getElementById("message-log");

  // Статус соединения
  let socketStatus = document.getElementById("status");

  console.log("connect to Ws server");

  // Создаем новое соединение WebSocket
  const socket = new WebSocket(host);

  // Ключ клиента
  let clientKey = "";

  // Устанавливаем статус соединения на "Подключено"
  socket.onopen = function (event) {
    socketStatus.innerHTML = "Подключено.";
    socketStatus.className = "open";
    console.log(socketStatus.innerHTML);

    // Получение списка пользователей
    const message = {
      type: "get_users",
      clientKey: clientKey,
    };

    socket.send(JSON.stringify(message));
  };

  // Слушаем входящие данные
  socket.onmessage = function (event) {
    // Парсим входящее сообщение
    let msg = JSON.parse(event.data);
    // Получаем время
    let time = new Date(msg.date);
    // Форматируем время
    let timeStr = time.toLocaleTimeString();

    // Используем switch для обработки различных типов сообщений
    switch (msg.type) {
      case "id":
        // Получаем ключ клиента
        clientKey = msg.clientKey;
        console.log("Ключ клиента получен от сервера");
        break;
      case "message":
        messageList.innerHTML +=
          '<li class="received"><span>Получено: ' +
          // Добавляем полученное сообщение в список
          timeStr +
          "</span>" +
          msg.text +
          "</li>";
        break;
    }
  };

  // Обработка ошибок
  socket.onerror = function (error) {
    console.log("Ошибка WebSocket: " + error);
  };

  // Устанавливаем статус соединения на "Отключено"
  socket.onclose = function (event) {
    socketStatus.innerHTML = "Отключено от WebSocket.";
    socketStatus.className = "closed";
  };

  // Закрываем соединение при нажатии кнопки "Отключить"
  closeBtn.onclick = function (event) {
    event.preventDefault();
    // Закрываем соединение
    socket.close();
    return false;
  };

  // Отправляем сообщение при нажатии клавиши Enter
  document
    .querySelector("#message-area")
    .addEventListener("keypress", function (event) {
      event.stopPropagation();

      // Проверяем нажатие Enter без Shift
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        // Отправляем сообщение
        sendMessage();
        return false;
      }
    });

  // Функция для отправки сообщения на сервер
  function sendMessage() {
    // Получаем текст сообщения
    let message = messageField.value;

    // Если сообщение не пустое
    if (message) {
      console.log("sendMessage: ", message);

      // Создаем объект сообщения
      let msg = createMsgObj(message, clientKey);

      console.log("Отправка сообщения: ", JSON.stringify(msg));

      // Отправляем сообщение
      socket.send(JSON.stringify(msg));
      // Добавляем отправленное сообщение в список
      messageList.innerHTML +=
        '<li class="sent"><span>Отправлено: </span>' + message + "</li>";

      // Очищаем поле ввода
      messageField.value = "";
      // Устанавливаем фокус на поле ввода
      messageField.focus();
    }

    return false;
  }
};

// Функция для создания объекта сообщения
function createMsgObj(message, clientKey) {
  let msg = {
    // Тип сообщения
    type: "message",
    // Уникальный ID сообщения
    msgId: createMsgId(),
    // Текст сообщения
    text: message,
    // Ключ клиента
    clientKey: clientKey,
    // Время отправки
    date: Date.now(),
  };

  console.log("createMsgObj: ", msg);

  return msg;
}

// Используем замыкание для создания и инкрементации счетчика ID сообщения
function createMsgId() {
  var counter = 0;

  return function () {
    console.log("createMsgId: ", counter);

    return counter++;
  };
}

//----------------------------END--GENERAL----------------------------------------//

//----------------------------main_page_script-------------------------------------//

//----------------------------END-main_page_script---------------------------------//

//------------------------------main_entrance----------------------------------------//

//------------------------------END-entrance-----------------------------------------//

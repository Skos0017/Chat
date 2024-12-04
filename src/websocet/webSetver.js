const PORT = process.env.PORT || 3001; // Устанавливаем порт, используем переменную окружения или 3001
const express = require('express'); // Импортируем библиотеку express
const app = express(); // Создаем экземпляр приложения express

let server = require('http').Server(app); // Создаем HTTP сервер на основе приложения express

// Указываем папку для статических файлов
app.use(express.static(__dirname + '/public'));

// Обрабатываем GET запрос на корневой путь
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/main-page.html'); // Отправляем файл index.html в ответ на запрос
});

let WebSocketServer = require('websocket').server; // Импортируем WebSocket сервер

// Создаем экземпляр WebSocket сервера, привязывая его к HTTP серверу
let wsServer = new WebSocketServer({
  httpServer: server
});

let clients = {}; // Объект для хранения подключенных клиентов

// Слушаем запросы на подключение, сохраняем информацию о клиенте и отправляем ее клиенту
wsServer.on('request', function(req) {
  let connection = req.accept('sample-protocol', req.origin); // Принимаем запрос на подключение
  let id = createUUID(); // Генерируем уникальный идентификатор для клиента

  clients[id] = connection; // Сохраняем соединение клиента в объекте clients

  let idObj = createIdObj(id); // Создаем объект с идентификатором клиента

  clients[id].send(JSON.stringify(idObj)); // Отправляем клиенту его идентификатор

  console.log((new Date()) + ' Connection accepted [' + id + ']'); // Логируем успешное подключение

  // Слушаем входящие сообщения и рассылаем их всем остальным клиентам
  connection.on('message', function(message) {
    let msgString = message.utf8Data; // Получаем строку сообщения
    let msgObj = JSON.parse(msgString); // Парсим строку в объект

    let receivedId = msgObj.clientKey; // Получаем идентификатор клиента, отправившего сообщение

    // Очищаем идентификатор клиента из сообщения перед рассылкой другим клиентам
    msgObj.clientKey = '';

    msgString = JSON.stringify(msgObj); // Преобразуем объект обратно в строку

    // Рассылаем сообщение всем клиентам, кроме отправителя
    for (let id in clients) {
      if (id !== receivedId) {
        clients[id].sendUTF(msgString); // Отправляем сообщение
      }
    }
  });

  // Слушаем запросы на закрытие соединения
  connection.on('close', function(reasonCode, description) {
    delete clients[id]; // Удаляем клиента из списка

    console.log((new Date()) + ' Peer' + connection.remoteAddress +
      ' disconnected. Reason code: ' + reasonCode + '.'); // Логируем отключение клиента
  });
});

// Генератор UUID - не гарантирует уникальность, но достаточно хорош для демонстрационных целей
function createUUID() {
  return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

// Функция для генерации случайных строк
function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); // Генерируем случайное 4-значное шестнадцатеричное число
}

// Функция для создания объекта идентификатора клиента
function createIdObj(id) {
  let initMsg = {
    type: 'id', // Тип сообщения
    clientKey: id, // Ключ клиента
    date: Date.now() // Время создания
  };

  return initMsg; // Возвращаем объект
}

// Запускаем сервер
server.listen(PORT, function() {
  console.log((new Date()) + ' Server is listening on port ' + PORT); // Логируем, что сервер запущен
});
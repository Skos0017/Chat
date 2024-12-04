//---------------------------------GENERAL-----------------------------------------//
// Создаем новое WebSocket соединение
// Заменяем http на ws для WebSocket
let host = location.origin.replace(/^http/, 'ws'); 
console.log(host);

window.onload = function() {
  // Поле для ввода сообщения
  let messageField = document.getElementById('message-area');
  // Список сообщений 
  let messageList = document.getElementById('message-log'); 
  // Статус соединения
  let socketStatus = document.getElementById('status'); 

 // Кнопка закрытия
  let closeBtn = document.getElementById('close');
  // Кнопка открытия
  let openBtn = document.getElementById('open');
  // Кнопка отправки 
  let sendBtn = document.getElementById('send'); 

  // Создаем новое соединение WebSocket
  let socket = new WebSocket(host, 'sample-protocol');
  // Ключ клиента
  let clientKey = ''; 

  // Устанавливаем статус соединения на "Подключено"
  socket.onopen = function(event) {
    socketStatus.innerHTML = 'Подключено.';
    socketStatus.className = 'open';
    console.log(socketStatus.innerHTML);
  };

  // Слушаем входящие данные
  socket.onmessage = function(event) {

    // Парсим входящее сообщение
    let msg = JSON.parse(event.data); 
    // Получаем время
    let time = new Date(msg.date); 
    // Форматируем время
    let timeStr = time.toLocaleTimeString(); 

    // Используем switch для обработки различных типов сообщений
    switch(msg.type) {
      case 'id':
         // Получаем ключ клиента
        clientKey = msg.clientKey;
        console.log('Ключ клиента получен от сервера');
        break;
      case 'message':
        messageList.innerHTML += '<li class="received"><span>Получено: ' +
        // Добавляем полученное сообщение в список
          timeStr + '</span>' + msg.text + '</li>'; 
        break;
    }
  };

  // Обработка ошибок
  socket.onerror = function(error) {
    console.log('Ошибка WebSocket: ' + error);
  };

  // Устанавливаем статус соединения на "Отключено"
  socket.onclose = function(event) {
    socketStatus.innerHTML = 'Отключено от WebSocket.';
    socketStatus.className = 'closed';
  };

  // Закрываем соединение при нажатии кнопки "Отключить"
  closeBtn.onclick = function(event) {
    event.preventDefault();
     // Закрываем соединение
    socket.close();
    return false;
  };

  // Перезагружаем страницу при нажатии кнопки "Подключить"
  openBtn.onclick = function(event) {
    window.location.reload(true);
  };

  // Отправляем сообщение при нажатии кнопки "Отправить"
  sendBtn.onclick = function(event) {
    sendMessage();
  };

  // Отправляем сообщение при нажатии клавиши Enter
  document.querySelector('#message-area').addEventListener('keypress', function(event) {
    event.stopPropagation();
    
// Проверяем нажатие Enter без Shift
    if(event.keyCode === 13 && !event.shiftKey) { 
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
    if (message.length > 0) { 
      // Создаем объект сообщения
      let msg = createMsgObj(message, clientKey); 
      // Отправляем сообщение
      socket.send(JSON.stringify(msg)); 
      // Добавляем отправленное сообщение в список
      messageList.innerHTML += '<li class="sent"><span>Отправлено: </span>' +
        message + '</li>'; 

        // Очищаем поле ввода
      messageField.value = ''; 
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
    type: 'message', 
// Уникальный ID сообщения
    msgId: createMsgId(), 
// Текст сообщения
    text: message, 
// Ключ клиента
    clientKey: clientKey, 
    // Время отправки
    date: Date.now() 
  };

  return msg;
}

// Используем замыкание для создания и инкрементации счетчика ID сообщения
var createMsgId = (function() {
  function createMsgObj(message, clientKey) {
    let msg = {
      type: 'message',
      msgId: createMsgId(),
      text: message,
      clientKey: clientKey,
      date: Date.now()
    };

    return msg;
  }
  var createMsgId = (function() {
    var counter = 0;
    return function() {
      return counter++;
    };
  })
})();
 
//----------------------------END--GENERAL----------------------------------------//

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                login: login,
                password: password
            }
        })
    })
        .then(response => {
            return new Promise((resolve, reject) => {
                response.json()
                    .then((answer) => {
                        resolve({
                            status: response.status,
                            message: answer.message
                        })
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        })
        .then(data => {
            console.log(data);
            if (data.status === 201) {
                window.location.href = 'http://localhost:3000/'
            } else {
                showMessage(data.status, data.message);
            }
        })
        .catch(error => {
            showMessage(data.status, data.message);
            console.error('Error:', error);
        });
});

function showMessage(status, message) {
    const notifier = document.getElementById('errorMessage');

    if (status === 201) {
        notifier.style.backgroundColor = 'green';
    } else {                
        notifier.style.backgroundColor = 'red';
    }

    notifier.textContent = message;
    notifier.style.display = 'block';
    setTimeout(() => {
        notifier.style.display = 'none';
    }, 3000);
}





//----------------------------main_page_script-------------------------------------//







//----------------------------END-main_page_script---------------------------------//









//------------------------------main_entrance----------------------------------------//


//------------------------------END-entrance-----------------------------------------//

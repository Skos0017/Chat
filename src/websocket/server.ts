import { WebSocketServer, WebSocket } from 'ws';


interface Message {
    type: "id" | "get_users" | "message";
    clientKey: string;
}

const clients: WebSocket[] = []; // Массив для хранения всех подключенных клиентов

export function SetupWebSocket(wss: WebSocketServer) {
    // Слушаем запросы на подключение, сохраняем информацию о клиенте и отправляем ее клиенту
    wss.on('connection', (ws) => {
        clients.push(ws); // Добавляем новое соединение в массив клиентов

        // Генерируем уникальный идентификатор для клиента
        const clientKey = createUUID(); // Предполагается, что функция createUUID() определена
        const message = { type: "id", clientKey: clientKey };
        ws.send(JSON.stringify(message)); // Отправляем клиенту его идентификатор

        //connection is up, let's add a simple event
        ws.on('message', (message: string) => {
            //log the received message
            console.log('received: %s', message);

            // Создаем объект сообщения для рассылки
            const msg = JSON.parse(message);
            msg.date = Date.now(); // Добавляем время отправки

            // Отправляем сообщение всем подключенным клиентам
            clients.forEach(client => {
                if (client.readyState === client.OPEN) { // Проверяем, что соединение открыто
                    client.send(JSON.stringify(msg));
                }
            });
        });

        // Обработка отключения клиента
        ws.on('close', () => {
            // Удаляем отключенного клиента из массива
            clients.splice(clients.indexOf(ws), 1);
        });
    });
}

// Функция для генерации уникального идентификатора (пример)
function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
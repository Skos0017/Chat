import { WebSocketServer } from 'ws';

interface Message {
    type: "id" | "get_users" | "message";
    clientKey: string;
}

export function SetupWebSocket(wss: WebSocketServer) {
// Слушаем запросы на подключение, сохраняем информацию о клиенте и отправляем ее клиенту
wss.on('connection', (ws) => {
    // let clientID = createUUID(); // Генерируем уникальный идентификатор для клиента
    // let objectID = createIdObj(id); // Создаем объект с идентификатором клиента
     
    // wsClients[id] = ws; // Сохраняем соединение клиента в объекте clients
    // clients[id].send(JSON.stringify(idObj)); // Отправляем клиенту его идентификатор

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    const message = { type: "id", clientKey: "123456" };

    ws.send(JSON.stringify(message));
});
}
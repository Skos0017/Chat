import { app, server, wss, registratedUsers, userDataJson } from './app';
import { readFilePromise, writeFilePromise } from './utils/file-operator_module';

const WS_PORT = process.env.WS_PORT || 8888;

server.listen(WS_PORT, () => {
    console.log(`WebSocket server started on port ${WS_PORT}`);
});

app.listen(3000, () => {
    readFilePromise(userDataJson)
        .then((data: string) => {
            let users = JSON.parse(data);
            registratedUsers.push(...users);
            console.log('Server running on port 3000');
        });
});

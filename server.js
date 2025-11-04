const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'qwen-full.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Пользователь подключился к QwenCord');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on('close', () => {
        console.log('Пользователь отключился от QwenCord');
    });
});

// Render задаёт PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`QwenCord запущен на порту ${PORT}`);
});

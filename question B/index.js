const http = require('http');
const url = require('url');
const { v4: uuidv4 } = require('uuid');

const items = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (path === '/items') {
        if (method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(items));
        } else if (method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const newItem = JSON.parse(body);
                newItem.id = uuidv4();
                items.push(newItem);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newItem));
            });
        }
    } else if (path.startsWith('/items/')) {
        const itemId = path.split('/')[2];

        if (method === 'GET') {
            const foundItem = items.find(item => item.id === itemId);
            if (foundItem) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(foundItem));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Item not found' }));
            }
        } else if (method === 'PUT') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const updatedItem = JSON.parse(body);
                const index = items.findIndex(item => item.id === itemId);

                if (index !== -1) {
                    items[index] = { ...items[index], ...updatedItem, id: itemId };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(items[index]));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Item not found' }));
                }
            });
        } else if (method === 'DELETE') {
            const index = items.findIndex(item => item.id === itemId);

            if (index !== -1) {
                items.splice(index, 1);
                res.writeHead(204);
                res.end();
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Item not found' }));
            }
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

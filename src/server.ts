import express from 'express';

const app = express();

app.get('/', (request, response) => {
    return response.json({ message: 'server is running' });
});

app.listen(3333);
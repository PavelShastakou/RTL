import * as http from 'http';
import app from './app';

const PORT = process.env.SERVER_PORT || 3000;

http.createServer(app).listen(PORT)

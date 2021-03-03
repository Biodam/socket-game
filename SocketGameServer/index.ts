import e from 'express';
import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';

const app: Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();

//Game stuff
class Player{    
    public x= 0;
    public z= 0;
}
let players = new Map<string,Player>();

io.attach(server, {
    cors: {
        origin: `http://localhost:${port}`,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header", "Access-Control-Allow-Origin"],
        credentials: true
    }
});
//https://socket.io/docs/v3/handling-cors/

app.get('/', async (_: Request, res: Response) => {
    res.send('Server is running...')
});

app.get('/hello', async (_: Request, res: Response) => {
    res.send('Hello World')
});

io.on('connection', (socket: socketio.Socket) => {
    console.log('connection');
    players.set(socket.id, new Player());
    socket.emit('status', 'Hello from Socket.io');

    socket.on('disconnect', () => {
        console.log('client disconnected');
        players.delete(socket.id);
    });

    socket.on("player-input", (arg) => {
        console.log(arg); // world
        let player = players.get(socket.id);
        if(player!=undefined)
        {
            player.x += arg.horizontal;
            player.z += arg.vertical;
            console.log(`${socket.id}:${player}`);
            socket.emit("player-position", player);
        }
        else{
            console.log(`Could not find player for socket: ${socket.id}`);
        }
    });
});

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
});


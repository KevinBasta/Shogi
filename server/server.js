//import { startGame } from "../main.js";
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static(`${__dirname}/../`));

const server = http.createServer(app);
const io = socketio(server);
// using state as a previous board states array
const state = {};
const clientRooms = {};
const roomsWithClients = {};

io.on('connection', client => {
    client.emit('message', 'You are connected');

    client.on('message', (text) => {
        io.emit('message', text)
    })

    client.on('turn', ([lastposition, currentEmptyCellEmit]) => client.broadcast.emit('turn', [lastposition, currentEmptyCellEmit]));
    
    client.on('newGame', handleNewGame);

    function handleNewGame() {
        let roomName = makeid(5);
        clientRooms[client.id] = roomName;
        roomsWithClients[roomName] = [client.id];
        //client.emit('gameCode', roomName);
    
        //state[roomName] = [];

        client.join(roomName);
        client.number = 1;
        client.emit('init', 1);
    }

    client.on('joinGame', handleJoinGame);

    function handleJoinGame(gameCode) { 
        if (gameCode in roomsWithClients) { 
            console.log(roomsWithClients);
            if (roomsWithClients[gameCode].length > 1) {
                client.emit('tooManyPlayers');
                return;
            }
            console.log(roomsWithClients[gameCode]);

            
            clientRooms[client.id] = gameCode;
            roomsWithClients[gameCode].push(client.id);

            client.join(gameCode);
            client.number = 2;
            client.emit('init', 2);
        } else { 
            client.emit('unknownGame');
            return;
        }
        /* const room = io.sockets.adapter.rooms[gameCode];

        let allUsers;
        if (room) {
            allUsers = room.sockets;
        }

        let numbClients = 0;
        if (allUsers) {
            numbClients = Object.keys(allUsers).length;
        }

        if (numbClients === 0) {
            client.emit('unknownGame');
            return;
        } else if (numbClients > 1) {
            client.emit('tooManyPlayers');
            return;
        }  */



        
    }

});


function makeid(number) { 
    return "234";
}

server.on('error', (err) => {
    console.error(err);
})

server.listen(8080, () => { 
    console.log('server is ready');
})
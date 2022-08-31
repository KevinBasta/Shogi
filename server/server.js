const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);

const clientRooms = {};
const roomsWithClients = {};

io.on('connection', client => {
    client.on('requestFirstPlayerInfo', (name) => client.broadcast.to(clientRooms[client.id]).emit('requestFirstPlayerInfo', name));
    client.on('recieveFirstPlayerInfo', ([goteOrSente, name]) => client.broadcast.to(clientRooms[client.id]).emit('recieveFirstPlayerInfo', [goteOrSente, name]));
    client.on('gameNotationLine', (notationLine) => client.broadcast.to(clientRooms[client.id]).emit('gameNotationLine', notationLine));

    client.on('pieceMove', ([lastposition, currentEmptyCellEmit]) => client.broadcast.to(clientRooms[client.id]).emit('pieceMove', [lastposition, currentEmptyCellEmit]));
    client.on('pieceDrop', ([lastposition, currentEmptyCellEmit]) => client.broadcast.to(clientRooms[client.id]).emit('pieceDrop', [lastposition, currentEmptyCellEmit]));
    client.on('piecePromote', (piecePosition) => client.broadcast.to(clientRooms[client.id]).emit('piecePromote', piecePosition));
    

    client.on('newGame', handleNewGame);
    function handleNewGame() {
        let roomName = makeid(5); 
        clientRooms[client.id] = roomName;
        roomsWithClients[roomName] = [client.id];

        client.join(roomName);
        client.number = 1;
        io.to(client.id).emit("gamecode", roomName);
    }


    client.on('joinGame', handleJoinGame);
    function handleJoinGame(gameCode) { 
        if (gameCode in roomsWithClients) { 
            if (roomsWithClients[gameCode].length > 1) {
                client.emit('tooManyPlayers');
                return;
            }
            
            clientRooms[client.id] = gameCode;
            roomsWithClients[gameCode].push(client.id);

            client.join(gameCode);
            client.number = 2;
            client.emit('joinInit');
        } else { 
            client.emit('unknownGame');
            return;
        } 
    }


    client.on("refreshJoinGame", (gameCode) => {
        client.join(gameCode);
        clientRooms[client.id] = gameCode;
        roomsWithClients[gameCode].push(client.id);
        client.broadcast.to(roomsWithClients[gameCode]).emit('OpponentReconnect');
        client.broadcast.to(clientRooms[client.id]).emit('log', roomsWithClients);
    });

    client.on("noNewJoiningAllowed", () => {
        let gameCode = clientRooms[client.id];
        roomsWithClients[gameCode].push("no new connection allowed");
        roomsWithClients[gameCode].push("game full");
    });


    client.once('disconnect', function() {
        if (client.id in clientRooms) { 
            client.broadcast.to(clientRooms[client.id]).emit('OpponentDisconnected');
    
            let tempRoomId = clientRooms[client.id];
            if (tempRoomId in roomsWithClients) { 
                let tempClientIdPosition = roomsWithClients[tempRoomId].indexOf(client.id);
                if (tempClientIdPosition > -1) { 
                    roomsWithClients[tempRoomId].splice(tempClientIdPosition, 1);
                }
            }

            delete(clientRooms[client.id]);
        }
    }); 


    client.on('deleteRoom', (gameCode) => { 
        if (gameCode in roomsWithClients) { 
            delete roomsWithClients[gameCode];
        }
    });
});
 

function makeid(number) { 
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < number; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

server.on('error', (err) => {
    console.error(err);
})

server.listen(8080, () => { 
    //console.log('server is ready');
})
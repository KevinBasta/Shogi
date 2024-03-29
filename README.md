# Shogi Boardgame Javascript project
![Shogi Boardgame](https://github.com/KevinBasta/Shogi/blob/main/client/pieces/readme.gif)

Shogi is a chess-like game with different piece movements and rules. You can read about the board game [here](https://en.wikipedia.org/wiki/Shogi). Upon opening the [homepage](http://shogiboardgame.azurewebsites.net/), you are able to create or join an online multiplayer game as well as start an offline multiplayer version of the game where you can play both sides.

## Description
This project was made with Socket.io, Express.js, JavaScript, HTML, and CSS

**Serverside JavaScript:** 
* Server.js uses express js to create an HTTP server. That server is utilized by the web sockets handler, socket io, to handle all the client events being sent to the other client in the same game room through the server

**Clientside JavaScript:**

* main.js handles socket io events, game initialization, and event handling
* board.js is the class that defines a game. It handles all the game logic for moving, dropping, capturing, and other things like checking for check and checkmate. Utilizes view.js's functions heavily to reflect the game logic in the DOM
* pieces.js is a class that defines a base piece object and specific pieces that inherit that base piece object. All the piece movements, promotions, and drops are defined here
* view.js handles all of the DOM manipulations 
* Config.js is used to define the initial state of the board game and to identify where the image files are 

**HTML & CSS**

* For HTML, no canvas is used. This means the game itself is running off of divs which represent the cells of the board game

* As for CSS, the board game div cells are organized in a grid, with the rest of the layout mostly using flexbox. Although not perfect on every mobile device, the layout for mobile browsers has been considered
# Shogi Boardgame Javascript project
img here

Shogi is a chess-like game with different piece movements and rules. You can read about the boardgame [here](https://en.wikipedia.org/wiki/Shogi). Upon opening the [homepage](http://shogiboardgame.azurewebsites.net/), you are able to create or join an online multiplayer game as well as start an offline multiplayer version of the game where you can play both sides.

## Description
This project was made with socket.io, express.js, javascript, html, and css

**Serverside Javascript:** 
* Server.js uses express js to create an http server. That server is utilized by socket io to handle all the client events being sent to the other client in the same gameroom through the server

**Clientside Javascript:**

* main.js handles socket io events, game initialization, and event handeling
* board.js is a class that defines a game, it handles all the game logic for moving, dropping, capturing, and other things like checking for check and checkmate. Utilizes view.js's functions heavily to reflect the game logic in the DOM
* pieces.js is a class that defines a base piece object and spesific pieces that inherit that base piece object. All the piece movements, promotions, and drops are implemented here
* view.js handles all of the DOM manipulation 
* Config.js is used to define the initial state of the board game and to identify where the image files are 

**Html & Css**

* For Html, no canvas was used which means the game itself is running off of divs which represent the cells of the boardgame 

* As for Css, the boardgame div cells are organized in a grid, with flexbox being used mostly for the rest of the layout. Although not perfect in every mobile device, the layout for mobile browsers has been considered
# Shogi Boardgame Javascript project
## What is shogi? 
Shogi is a chess-like game with different piece movements and different rules such as piece captures and drops. 

_You can read about the game here - [Wikipedia, Shogi](https://en.wikipedia.org/wiki/Shogi)_

## The project
Has a homepage that lets you create or join an online multiplayer game or play an offline multiplayer version of the game

Image Here


## Description
This project was made with Html, Css, and Javascript

**Html & Css**

* For Html, no canvas was used which means the game itself is running off of divs which represent the cells of the boardgame 

* As for Css, the boardgame div cells are organized in a grid, with the use of mostly flexbox for the rest of the layout. The game is also mobile friendly (for what I was able to test)

**Clientside Javascript:**

* main.js handles game initialization and event handeling
* board.js handles all the game logic for moving, dropping, capturing, and other things like checking for check and checkmate. Utilizes view.js's functions heavily to reflect the game logic in the DOM
* pieces.js defines all the piece movements, promotions, and drops
* view.js handles all of the DOM manipulation 
* Config.js is used to define the initial state of the board game and to identify where the image files are 

**Serverside Javascript:** 
* Server.js uses express js to create an http server. That server is utilized by socket io to handle all the client events being sent to the other client in the same gameroom through the server


_~ Thanks for checking out my project_
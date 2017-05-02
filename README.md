# SheepClicker

### Background

SheepClicker is a game used to practice and improve mouse accuracy and/or warmup mouse movements for other games.

### MVP Features

When playing SheepClicker, players will be able to:

- [ ] Start the game in either training mode or challenge mode
- [ ] Click sheep to increase score, losing when three sheep have not been clicked
- [ ] An accuracy rating will be determined by how many clicks landed on a sheep
- [ ] A high score board based on time the player lasted

In addition, this project will include:

- [ ] An About modal describing the background and rules of the game
- [ ] A production README

### Wireframes

The application is fairly simply represented - everything is on the 640 by 480 canvas, with the settings and score information displayed at the top. The game takes place in an approximately 600 by 420 window inside of the canvas. The training screen has options displayed in 3 by 3 grid, and each of them will follow up with a settings screen to adjust the size, sheep duration, and more depending on the mode.

Home Screen:
![wireframes](wireframes/SheepClicker.png)

Challenge Screen:
![wireframes challenge mode](wireframes/SheepClicker Challenge.png)

Training Screen:
![wireframes training select](wireframes/SheepClicker Training.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- `JavaScript` for game logic
- `Phaser` for game rendering

In addition to the entry file, there will be three scripts involved in this project:

`board.js`: this script will handle the logic for creating and removing sheep as they spawn and are clicked, respectively.

`clicker.js`: this will handle the game logic of when the game is over and update scores.

`sheep.js`: this will be a lightweight script that will house the constructor for the sheep objects and destroy function.

### Implementation Timeline

**Day 1**: Setup all necessary Node modules and familiarize myself with Phaser. Get basic entry file and bare bones of the three scripts created. Goals:
- Learn enough Phaser to render objects to the canvas
- Complete sheep script

**Day 2**: Get more familiar with Phaser, enabling myself to get the board rendered as well as the sheep. In addition, the sheep should be clickable and should be removed when clicked.

**Day 3**: Work on clicker.js to get score, timers, lives, and other necessary features working. By the end of the day I want to have the entire game complete for challenge mode.

**Day 4**: Work on incorporating training modes. Get at least 3 training modes working and allow players to change settings in the training.

# Voice Enabled Chess

Hands-Free Chess is a web-based chess game that can be played using speech recognition or traditional mouse controls. The game is built using HTML, CSS, and JavaScript and runs on an Express server.

## Deployed Website

You can play the game online at [Voice Enabled Chess](https://voiceenabledchess.onrender.com/).

## Features

- **Hands-Free Controls:** Play the game using voice commands with the help of Web Speech API.
- **Drag and Drop:** Move pieces by dragging and dropping them on the board.
- **Timers:** Each player has a timer to keep track of their time.
- **Responsive Design:** The game is responsive and works well on various screen sizes.

## Setup

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/harshvardhan-khachane/Chess.git
    cd Chess
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- `public/`: Contains all the public assets and client-side code.
  - `index.html`: The main HTML file.
  - `styles.css`: Stylesheet for the game.
  - `logic.js`: JavaScript file containing the game logic.
  - `speech.js`: JavaScript file for handling speech recognition.
  - Chess piece images: Images for the chess pieces (e.g., `Bking.png`, `Wqueen.png`).
- `server.js`: Express server setup.

## Usage

### Voice Commands

To move a piece using voice commands:
1. Click on the microphone button.
2. Say the square name of the piece you want to move and stop the recording.(e.g., "A2").
3. Say the square name where you want to move the piece and stop the recording(e.g., "A4).

### Mouse Controls

To move a piece using the mouse:
1. Click and drag the piece to the desired square.
2. Release the mouse button to drop the piece.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

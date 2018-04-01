import React, { Component } from 'react';

import Game from './Game';

class App extends Component {
  state = {
    gameId: 1,
  };
  resetGame = () => {
    this.setState(prevState => ({ gameId: prevState.gameId + 1 }));
  }
  render() {
    return (
      <Game
        key={this.state.gameId}
        onPlayAgain={this.resetGame}
        randomNumberCount={6}
        initSeconds={10}
      />
    );
  }
}

export default App;

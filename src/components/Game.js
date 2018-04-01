import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import shuffle from 'lodash.shuffle';

import RandomNumber from './RandomNumber';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
  },
  target: {
    fontSize: 40,
    backgroundColor: '#aaa',
    margin: 20,
    textAlign: 'center',
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },
  STATUS_WON: {
    backgroundColor: 'green',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initSeconds: PropTypes.number.isRequired,
  };

  state = {
    selectedIds: [],
    remainingSecs: this.props.initSeconds,
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(prevState => ({
        remainingSecs: prevState.remainingSecs - 1,
      }), () => {
        if (this.state.remainingSecs === 0) {
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSecs === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  gameStatus = 'PLAYING';

  randomNumbers = Array
    .from({ length: this.props.randomNumberCount })
    .map(() => 1 + Math.floor(10 * Math.random()));
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
  shuffledRandomNums = shuffle(this.randomNumbers);

  isNumSelected = i => this.state.selectedIds.indexOf(i) >= 0;

  selectNum = (i) => {
    this.setState(prevState => ({ selectedIds: [...prevState.selectedIds, i] }));
  }

  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => (
      acc + this.shuffledRandomNums[curr]
    ), 0);

    if (nextState.remainingSecs === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    return 'LOST';
  };

  render() {
    const { gameStatus } = this;
    return (
      <View style={styles.container}>
        <Text style={[
          styles.target,
          styles[`STATUS_${gameStatus}`],
        ]}
        >{this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.shuffledRandomNums.map((num, i) => (
            <RandomNumber
              key={i /* eslint-disable-line */}
              id={i}
              num={num}
              isDisabled={this.isNumSelected(i) || gameStatus !== 'PLAYING'}
              onPress={this.selectNum}
            />
          ))}
          <Text>{this.state.remainingSecs}</Text>
        </View>
      </View>
    );
  }
}

export default Game;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

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

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  randomNumbers = Array
    .from({ length: this.props.randomNumberCount })
    .map(() => 1 + Math.floor(10 * Math.random()));
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  isNumSelected = i => this.state.selectedIds.indexOf(i) >= 0;

  selectNum = (i) => {
    this.setState(prevState => ({ selectedIds: [...prevState.selectedIds, i] }));
  }

  gameStatus = () => {
    const sumSelected = this.state.selectedIds.reduce((acc, curr) => (
      acc + this.randomNumbers[curr]
    ), 0);

    if (this.state.remainingSecs === 0) {
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
    const gameStatus = this.gameStatus();
    return (
      <View style={styles.container}>
        <Text style={[
          styles.target,
          styles[`STATUS_${gameStatus}`],
        ]}
        >{this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.randomNumbers.map((num, i) => (
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

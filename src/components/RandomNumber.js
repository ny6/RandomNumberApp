import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


const styles = StyleSheet.create({
  random: {
    backgroundColor: '#999',
    width: 100,
    marginHorizontal: 15,
    marginVertical: 25,
    textAlign: 'center',
    fontSize: 35,
  },
  selected: {
    opacity: 0.3,
  },
});

class RandomNumber extends Component {
  handlePress = () => {
    if (this.props.isDisabled) { return; }
    this.props.onPress(this.props.id);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Text style={[
          styles.random,
          this.props.isDisabled && styles.selected,
        ]}
        >{this.props.num}
        </Text>
      </TouchableOpacity>
    );
  }
}

RandomNumber.propTypes = {
  id: PropTypes.number.isRequired,
  num: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default RandomNumber;

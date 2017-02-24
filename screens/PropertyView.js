import React, { Component } from 'react';
import { BackAndroid, Image, Platform, ScrollView, StyleSheet, Text, ToolbarAndroid, View } from 'react-native';
import IconToolbarBack from '../Resources/android/back-button.png';

const styles = StyleSheet.create({
  containerToolbar: {
    backgroundColor: '#FFFFFF',
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'flex-start',
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD',
  },
  image: {
    width: 400,
    height: 300,
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC',
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565',
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565',
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
});

class PropertyView extends Component {

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this._onBackPressed);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this._onBackPressed);
    }
  }

  _onBackPressed = () => {
    this.props.navigator.pop();
    return true;
  }

  _initAndroidToolbar = () => {
    if (Platform.OS === 'android') {
      return (
        <ToolbarAndroid
          title={this.props.property.title}
          navIcon={IconToolbarBack}
          onActionSelected={this.onActionSelected}
          style={styles.toolbar}
          onIconClicked={this._onBackPressed}
        />
      );
    }
    return null;
  }

  render() {
    const property = this.props.property;
    let stats = `${property.bedroom_number} bed ${property.property_type}`;
    if (property.bathroom_number) {
      stats += `, ${property.bathroom_number} ${property.bathroom_number > 1
                ? 'bathrooms'
                : 'bathroom'}`;
    }

    const price = property.price_formatted.split(' ')[0];

    return (
      <ScrollView
        contentContainerStyle={styles.containerToolbar}
      >
        {this._initAndroidToolbar()}
        <View>
          <Image
            style={styles.image} source={{
              uri: property.img_url,
            }}
          />
          <View style={styles.heading}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.title}>{property.title}</Text>
            <View style={styles.separator} />
          </View>
          <Text style={styles.description}>{stats}</Text>
          <Text style={styles.description}>{property.summary}</Text>
        </View>
      </ScrollView>
    );
  }
}

PropertyView.propTypes = {
  navigator: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  property: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

PropertyView.defaultProps = {
  navigator: null,
  property: null,
};

module.exports = PropertyView;

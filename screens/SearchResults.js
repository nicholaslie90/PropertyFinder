/* @flow */

import React, { Component } from 'react';
import {
    BackAndroid,
    Image,
    ListView,
    Platform,
    StyleSheet,
    Text,
    ToolbarAndroid,
    TouchableHighlight,
    View,
} from 'react-native';
import IconToolbarBack from '../Resources/android/back-button.png';

const PropertyView = require('./PropertyView');

const styles = StyleSheet.create({
  containerToolbar: {
    backgroundColor: '#FFFFFF',
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'flex-start',
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd',
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC',
  },
  title: {
    fontSize: 20,
    color: '#656565',
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
});

class SearchResults extends Component {

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url,
    });
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.listings),
    };
  }

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
          title="Search Results"
          onActionSelected={this.onActionSelected}
          navIcon={IconToolbarBack}
          style={styles.toolbar}
          onIconClicked={this._onBackPressed}
        />
      );
    }
    return null;
  }

  rowPressed(listerURL) {
    const property = this.props.listings.filter(prop => prop.lister_url === listerURL)[0];

    this.props.navigator.push({ title: 'Property',
      component: PropertyView,
      passProps: {
        property,
      } });
  }

  renderRow = (rowData) => {
    const price = rowData.price_formatted.split(' ')[0];

    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData.lister_url)} underlayColor="#dddddd">
        <View>
          <View style={styles.rowContainer}>
            <Image
              style={styles.thumb} source={{
                uri: rowData.img_url,
              }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.title} numberOfLines={1}>{rowData.title}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.containerToolbar}>
        {this._initAndroidToolbar()}
        <ListView
          dataSource={this.state.dataSource} enableEmptySections renderRow={this.renderRow} style={{
            backgroundColor: '#FFFFFF',
          }}
        />
      </View>
    );
  }
}

SearchResults.propTypes = {
  listings: React.PropTypes.arrayOf(React.PropTypes.object),
  navigator: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SearchResults.defaultProps = {
  listings: [],
  navigator: null,
};

module.exports = SearchResults;

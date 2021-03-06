/* @flow */


import React, { Component } from 'react';
import { ActivityIndicator, BackAndroid, Image, Platform, StyleSheet, Text, TextInput, TouchableHighlight, ToolbarAndroid, View } from 'react-native';
import SearchResults from './SearchResults';
import ImageHouse from './../Resources/house.png';

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565',
  },
  container: {
    padding: 30,
    ...Platform.select({
      ios: {
        marginTop: 65,
      },
    }),
    alignItems: 'center',
  },
  containerToolbar: {
    backgroundColor: '#FFFFFF',
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'flex-start',
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  locationButton: {
    height: 36,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  searchButton: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    ...Platform.select({
      android: {
        marginTop: 10,
      },
    }),
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  image: {
    width: 217,
    height: 138,
  },
});

function urlForQueryAndPage(key, value, pageNumber) {
  const data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber,
  };
  data[key] = value;

  const querystring = Object.keys(data).map(keyId => `${keyId}=${encodeURIComponent(data[keyId])}`).join('&');

  return `http://api.nestoria.co.uk/api?${querystring}`;
}

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: '',
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

  onLocationPressed = () => {
    navigator.geolocation.getCurrentPosition((location) => {
      const search = `${location.coords.latitude},${location.coords.longitude}`;
      this.setState({ searchString: search });
      const query = urlForQueryAndPage('centre_point', search, 1);
      this._executeQuery(query);
    }, (error) => {
      this.setState({
        message: `There was a problem with obtaining your location: ${error}`,
      });
    });
  }

  onSearchTextChanged = (event) => {
    this.setState({ searchString: event.nativeEvent.text });
  }

  onSearchPressed = () => {
    const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  }

  _handleResponse(response) {
    this.props.navigator.push({
      title: 'Results',
      component: SearchResults,
      passProps: {
        listings: response.listings,
      },
    });

    this.setState({ isLoading: false, message: '' });
    if (response.application_response_code.substr(0, 1) !== '1') {
      this.setState({ message: 'Location not recognized; please try again.' });
    }
  }

  _executeQuery(query) {
    this.setState({ isLoading: true });
    fetch(query).then(response => response.json()).then(json => this._handleResponse(json.response)).catch(error => this.setState({
      isLoading: false,
      message: `Something bad happened ${error}`,
    }));
  }

  _onBackPressed = () => {
    BackAndroid.exitApp(0);
    return true;
  }

  _initAndroidToolbar = () => {
    if (Platform.OS === 'android') {
      return (
        <ToolbarAndroid
          title="Property Finder"
          actions={[{ title: 'Settings', show: 'always' }]}
          onActionSelected={this.onActionSelected}
          style={styles.toolbar}
        />
      );
    }
    return null;
  }

  onActionSelected = (position) => {
    if (position === 0) { // index of 'Settings'
    //   showSettings();
    }
  }

  render() {
    const spinner = this.state.isLoading ? (<ActivityIndicator size="large" />) : (<View />);
    return (
      <View style={styles.containerToolbar}>
        {this._initAndroidToolbar()}
        <View style={styles.container}>
          <Text style={styles.description}>Search for houses to buy!</Text>
          <Text style={styles.description}>Search by place-name, postcode or search near your location.</Text>
          <View style={styles.flowRight}>
            <TextInput
              style={styles.searchInput} value={this.state.searchString}
              onChange={this.onSearchTextChanged} placeholder="Search via name or postcode"
            />
            <TouchableHighlight
              style={styles.searchButton} underlayColor="#99d9f4"
              onPress={this.onSearchPressed}
            >
              <Text style={styles.buttonText}>Go</Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight
            style={styles.locationButton} underlayColor="#99d9f4"
            onPress={this.onLocationPressed}
          >
            <Text style={styles.buttonText}>Location</Text>
          </TouchableHighlight>
          <Image source={ImageHouse} style={styles.image} />
          {spinner}
          <Text style={styles.description}>{this.state.message}</Text>
        </View>
      </View>
    );
  }
}

SearchPage.propTypes = {
  navigator: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SearchPage.defaultProps = {
  navigator: null,
};

module.exports = SearchPage;

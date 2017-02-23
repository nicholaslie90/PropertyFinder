/* @flow */

import React from 'react';
import { AppRegistry, StyleSheet, Navigator } from 'react-native';
import SearchPage from './screens/SearchPage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class PropertyFinder extends React.Component {

  renderScene(route, navigator) {
    return <route.component navigator={navigator} {...route.passProps} />;
  }

  render() {
    return (<Navigator
      style={styles.container} renderScene={this.renderScene} initialRoute={{
        title: 'Property Finder',
        component: SearchPage,
      }}
    />);
  }
}

AppRegistry.registerComponent('PropertyFinder', () => PropertyFinder);

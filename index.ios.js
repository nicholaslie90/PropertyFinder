/* @flow */

import React from 'react';
import ReactNative from 'react-native';
import SearchPage from './screens/SearchPage';

const styles = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});

class PropertyFinder extends React.Component {
  render() {
    return (
      <ReactNative.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Property Finder',
          component: SearchPage,
        }}
      />
    );
  }
}

ReactNative.AppRegistry.registerComponent('PropertyFinder', () => PropertyFinder);

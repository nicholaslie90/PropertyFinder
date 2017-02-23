/* @flow */

'use strict'

let React = require('react')
let ReactNative = require('react-native')
let SearchPage = require('./SearchPage')

let styles = ReactNative.StyleSheet.create({
    container: {
        flex: 1
    }
})

class PropertyFinder extends React.Component {
    render(){
        return (
            <ReactNative.NavigatorIOS
                style={styles.container}
                initialRoute={{
                    title: 'Property Finder',
                    component: SearchPage
                }}
            />
        )
    }
}

ReactNative.AppRegistry.registerComponent('PropertyFinder', function() {
    return PropertyFinder
})

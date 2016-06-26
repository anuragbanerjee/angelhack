/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  TextInput,
  View,
  Style,
  RefreshControl,
  AlertIOS
} from 'react-native';

class angelhackMobile extends Component {
  state = (function(){
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return {
      refreshing: false,
      dataSource: ds.cloneWithRows([]),
    };
  })()

  constructor (props) {
    super(props);
    this.fetchData();
  }

  fetchData() {
    return new Promise(function(resolve, reject) {
      var endpoint = "http://jsonplaceholder.typicode.com/comments";
      fetch(endpoint, {
        'method': 'GET',
        'headers': {
            'Accept': 'text/plain',
        },
        'body': null
      })
        .then( (res) => res.json())
        .then( (data) => {
          data = data.map( (a)=> a.body );
          console.log(data);
          var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          });

          this.setState({
            dataSource: ds.cloneWithRows(data)
          });
        })
        .then(() => {
          resolve("worked");
        })
        .catch((error) => {
          console.warn(error);
          AlertIOS.alert(
           'Network error',
           'Could not update list because of network connectivity issues.'
          );
        })
        .done();
    }.bind(this));
  };

  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Search"
          style={styles.textField}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text style={styles.row}>{rowData}</Text>}
          pageSize={1}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 25
  },
  textField: {
    height: 40,
    backgroundColor: '#eeeeee',
    // borderColor: 'gray',
    // borderBottomWidth: 1,
    paddingLeft: 50,
    paddingRight: 50
  },
  row: {
    "padding": 50,
    "textAlign": "left",
    "alignSelf": "auto"
  },
});

AppRegistry.registerComponent('angelhackMobile', () => angelhackMobile);

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import HTMLView from 'react-native-htmlview';
import definitionScreen from './src/definitionScreen';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const data = require('./src/chunat-dictionary-lite.json');

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'វចនានុក្រមខ្មែរ',
  };

  constructor() {
    super();
    this.state = {
      dataSource: ds.cloneWithRows(data),
      searchTerm: ''
    }
  }

  renderRow(rowData, navigate){
    return(
      <ScrollView>
        <TouchableOpacity
          onPress={() => navigate('Definition', { item: rowData})}
        >
          <View style={styles.item}>
            <Text>{rowData.word}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
  filterSearch(text){
    this.setState({
      searchTerm: text
    });
  }

  render() {
    const result = this.state.searchTerm
      ? data.filter(d => {
          const itemData = d.word.toUpperCase()
          const textData = this.state.searchTerm.toUpperCase()
          return itemData.indexOf(textData) > -1
        })
      : data;
    const dataSource = ds.cloneWithRows(result);
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
      <SearchBar
        containerStyle={{ backgroundColor: '#f0f3f4'}}
        inputStyle={{ backgroundColor: '#fff', color: '#000'}}
        lightTheme
        onChangeText={ this.filterSearch.bind(this) }
        placeholder='Type Here...'
        autoCapitalize= 'none'
      />

        <ListView
          enableEmptySection={true}
          dataSource={dataSource}
          renderRow={rowData => this.renderRow(rowData, navigate)}
        />
      </View>
    );
  }
}


const mydictionary = StackNavigator({
  Home: { screen: HomeScreen },
  Definition: { screen: definitionScreen }
});

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  item: {
    padding: 20,
    borderColor: '#ddd',
    borderBottomWidth: 1
  },
});

AppRegistry.registerComponent('mydictionary', () => mydictionary);

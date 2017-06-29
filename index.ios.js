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
import axios from 'axios';


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
class DefinitionScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      wikiInfo: { revisions: [{}] },
      wikiDefinition: '',
      wikiKey: 0
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.item.word}`,
  });

  componentWillMount() {
    const self = this;
    const text = this.props.navigation.state.params.item.word;
    return axios.get(`https://km.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=${text}`)
    .then(response =>
      {
        if (Object.keys(response.data.query.pages)[0] > 0) {
          self.setState({ wikiInfo: response.data.query.pages })
          self.setState({ wikiKey: Object.keys(response.data.query.pages)[0] })

        }
      }
    )
  }

  render() {
    const { params } = this.props.navigation.state;
    // const htmlContent = `<h1>hello</h1>\nHi<a href='www.google.com'><b><u>Google</u></b></a>`;
    const htmlContent = `${(params.item.definition || '(no definition)').replace(/<[^>]+>|\/a|\\n/ig,'')}`;

    if(this.state.wikiKey <= 0 )
    {
      this.state.wikiDefinition = 'ពុំមាននិយមន័យពីគេហទំព័រវីគីភីឌៀឡើយ'
    } else {
      this.setState({wikiDefinition: Object.values(this.state.wikiInfo)[0].revisions[0]['*']})
    }


    return (
      <View style={styles.definition}>
        <ScrollView>
          <HTMLView
            value={htmlContent}
          />
          <HTMLView
            style={styles.wikiDefinition}
            value={this.state.wikiDefinition}
          />
        </ScrollView>
      </View>
    );
  }
}

const mydictionary = StackNavigator({
  Home: { screen: HomeScreen },
  Definition: { screen: DefinitionScreen }
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
  definition: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wikiDefinition: {
    marginTop: 30
  }
});

AppRegistry.registerComponent('mydictionary', () => mydictionary);

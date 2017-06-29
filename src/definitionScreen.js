import React from 'react';
import { ScrollView, Text, View,StyleSheet } from 'react-native';
import axios from 'axios';
import HTMLView from 'react-native-htmlview';

class definitionScreen extends React.Component {
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

const styles = StyleSheet.create({
  container: {
   flex: 1,
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

export default definitionScreen;

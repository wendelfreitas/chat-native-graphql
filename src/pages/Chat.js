import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import Input from "./components/Input";
StatusBar.setBarStyle("light-content");

const author = "Wendel Freitas";

class Chat extends Component {
  componentDidUpdate() {
    setTimeout(() => {
      this._scrollView.scrollToEnd({ animated: false });
    }, 0);
  }

  componentDidMount() {
    this.props.conversation.subscribeToMore({
      document: gql`
        subscription onMessageAdded($author: String!) {
          Message(
            filter: { mutation_in: [CREATED], node: { from_not: $author } }
          ) {
            node {
              id
              from
              message
            }
          }
        }
      `,
      variables: {
        author
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data["Message"]) return prev;

        const newItem = subscriptionData.data["Message"].node;

        return { ...prev, allMessages: [...prev.allMessages, newItem] };
      }
    });
  }

  handleAddMessage = (proxy, { data: { createMessage } }) => {
    /* Conecta o componente com o sistema de query do Graphql */

    const data = proxy.readQuery({
      query: ConversationQuery
    });

    /* Adiciona no final da query 'allMessages' a ultima mensagem criada 'createMessage' */

    data.allMessages.push(createMessage);

    /* Escreve na query, passando os dados 'data' */

    proxy.writeQuery({
      query: ConversationQuery,
      data
    });
  };

  renderChat = () =>
    this.props.conversation.allMessages.map(item => (
      <View
        key={item.id}
        style={[
          styles.bubble,
          item.from === author ? styles["bubble-right"] : styles["bubble-left"]
        ]}
      >
        <Text style={styles.author}>{item.from}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    ));

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollView => (this._scrollView = scrollView)}
          contentContainerStyle={styles.conversation}
        >
          {this.props.conversation.loading ? (
            <ActivityIndicator style={styles.loading} color="#FFF" />
          ) : (
            this.renderChat()
          )}
        </ScrollView>
        <Input author={author} onAddMessage={this.handleAddMessage} />
      </View>
    );
  }
}
const ConversationQuery = gql`
  query {
    allMessages(orderBy: createdAt_ASC) {
      id
      from
      message
    }
  }
`;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c4241"
  },

  conversation: {
    padding: 10
  },

  loading: {
    marginTop: 20
  },

  bubble: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    marginTop: 10,
    maxWidth: width - 60
  },

  "bubble-right": {
    alignSelf: "flex-end",
    backgroundColor: "#D1EDC1"
  },

  "bubble-left": {
    alignSelf: "flex-start"
  },
  author: {
    fontWeight: "bold",
    marginBottom: 3,
    color: "#333"
  },

  message: {
    fontSize: 16,
    color: "#333"
  }
});

export default graphql(ConversationQuery, {
  name: "conversation"
})(Chat);

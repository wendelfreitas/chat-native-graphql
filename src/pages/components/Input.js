import React, { Component } from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";

class Input extends Component {
  state = {
    message: ""
  };

  handleAddMessage = async () => {
    const { author } = this.props;
    const { message } = this.state;

    if (message.length > 0) {
      const newMessage = await this.props.addMessage({
        author,
        message
      });
    }

    this.setState({ message: "" });
  };

  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          value={this.state.message}
          onChangeText={message => this.setState({ message })}
          style={styles.input}
          underlineColorAndroid="rgba(0,0,0,0)"
        />
        <TouchableOpacity onPress={this.handleAddMessage}>
          <Text style={styles.button}>Enviar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 42,
    paddingHorizontal: 10,
    backgroundColor: "#fafafa",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
    flexDirection: "row",
    alignItems: "center"
  },

  input: {
    flex: 1,
    height: 30,
    paddingHorizontal: 10,
    paddingVertical: 0,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12
  },

  button: {
    marginLeft: 10,
    color: "#358CFF",
    fontWeight: "bold"
  }
});

const MessageMutation = gql`
  mutation($author: String!, $message: String!) {
    createMessage(from: $author, message: $message) {
      id
      from
      message
    }
  }
`;

export default graphql(MessageMutation, {
  props: ({ ownProps, mutate }) => ({
    addMessage: ({ author, message }) =>
      mutate({
        variables: { author, message },
        update: ownProps.onAddMessage
      })
  })
})(Input);

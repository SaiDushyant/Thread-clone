import * as Sentry from "@sentry/react-native";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const Index = () => {
  // This function will be called when the button is pressed.
  const testError = () => {
    try {
      // Simulate an error being thrown.
      throw new Error("This is a test error");
    } catch (error) {
      // Capture a message in Sentry.
      const sentryId = Sentry.captureMessage("There was an error");
      console.log("Sentry ID:", sentryId);
      // Prepare user feedback.
      const userFeedback = {
        event_id: sentryId,
        name: "John Doe",
        email: "johndoe@gmail.com",
        comments: "This is a test feedback",
      };
      // Capture user feedback in Sentry.
      Sentry.captureUserFeedback(userFeedback);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is feed</Text>
      <Button title="Capture message to Sentry" onPress={testError} />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

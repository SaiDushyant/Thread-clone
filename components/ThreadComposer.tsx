import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "convex/react";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  InputAccessoryView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ThreadComposerProps = {
  isPreview?: boolean;
  isReplay?: boolean;
  threadId?: Id<"messages">;
};

const ThreadComposer = ({
  isPreview,
  isReplay,
  threadId,
}: ThreadComposerProps) => {
  const router = useRoute();
  const navigation = useNavigation();
  const [threadContent, setThreadContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const { userProfile } = useUserProfile();
  const addThread = useMutation(api.messages.addThreadMessage);
  const inputAccessoryViewId = "uniqueId";

  const handleSubmit = async () => {
    addThread({
      threadId,
      content: threadContent,
    });
    setThreadContent("");
    setMediaFiles([]);
    navigation.goBack();
    // router.dismiss();
  };
  const removeThread = () => {
    setThreadContent("");
    setMediaFiles([]);
  };
  const handleCancel = async () => {
    setThreadContent("");
    Alert.alert("Discard Thread?", "", [
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.goBack(),
      },
      {
        text: "Save Draft",
        style: "cancel",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  const selectImage = (type: "library" | "camera") => {
    console.log(type);
  };
  return (
    <View>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.topRow}>
        {userProfile && (
          <Image
            source={{ uri: userProfile?.imageUrl || "" }}
            style={styles.avatar}
          />
        )}

        <View style={styles.centerContainer}>
          <Text style={styles.name}>
            {userProfile?.first_name} {userProfile?.last_name}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={isReplay ? "Replay to thread" : "What's new?"}
            value={threadContent}
            onChangeText={setThreadContent}
            multiline
            autoFocus={!isPreview}
            inputAccessoryViewID={inputAccessoryViewId}
          />
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("library")}
            >
              <Ionicons name="images-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("camera")}
            >
              <Ionicons name="camera-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="gif" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mic-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome6 name="hashtag" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="stats-chart-outline"
                size={24}
                color={Colors.border}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.cancelButton, { opacity: isPreview ? 0 : 1 }]}
          onPress={removeThread}
        >
          <Ionicons name="close" size={24} color={Colors.border} />
        </TouchableOpacity>
      </View>
      <InputAccessoryView nativeID={inputAccessoryViewId}>
        <View style={styles.keyboardAccessory}>
          <Text style={styles.keyboardAccessoryText}>
            {isReplay
              ? "Everyone can reply and quote"
              : "Profile that you follow can reply and quote"}
          </Text>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
    </View>
  );
};

export default ThreadComposer;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    alignSelf: "flex-start",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  iconRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  iconButton: {
    marginRight: 16,
  },
  cancelButton: {
    marginLeft: 12,
    alignSelf: "flex-start",
  },
  keyboardAccessory: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    paddingLeft: 64,
    alignItems: "center",
  },
  keyboardAccessoryText: {
    flex: 1,
    color: Colors.border,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Pages = () => {
  const { biostring, linkstring, userId, imageUrl } = useLocalSearchParams<{
    biostring: string;
    linkstring: string;
    userId: string;
    imageUrl: string;
  }>();
  const [bio, setBio] = useState(biostring);
  const [link, setLink] = useState<string>(linkstring);
  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const router = useRouter();
  const [selectImage, setSelectImage] = useState<ImagePickerAsset | null>(null);

  const onDone = async () => {
    let storageId = null;

    if (selectImage) {
      storageId = await updateProfileImage();
    }

    const toUpdate: any = {
      _id: userId as Id<"users">,
      bio,
      websiteUrl: link,
    };
    if (storageId) {
      toUpdate.imageUrl = storageId;
    }
    await updateUser(toUpdate);
    router.dismiss();
  };

  const updateProfileImage = async () => {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(selectImage!.uri);
    const blob = await response.blob();
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": selectImage!.mimeType!,
      },
      body: blob,
    });
    const { storageId } = await result.json();
    console.log("Storage Id: ", storageId);

    return storageId as Id<"_storage">;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Selected Image URI: ", result.assets[0].uri); // Debugging
      setSelectImage(result.assets[0]);
    }
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onDone}>
              <Text>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableOpacity onPress={pickImage}>
        {selectImage ? (
          <Image source={{ uri: selectImage.uri }} style={styles.image} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={(text: string) => setBio(text)}
          multiline
          numberOfLines={4}
          style={styles.bioInput}
          textAlignVertical="top"
          placeholder="Tell us about yourself!"
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={link}
          onChangeText={(text: string) => setLink(text)}
          autoCapitalize="none"
          placeholder="www.example.com"
        />
      </View>
    </View>
  );
};

export default Pages;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    margin: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  bioInput: {
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
  },
});

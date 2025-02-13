// UserProfile.tsx
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "convex/react";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type UserProfileProps = {
  userId?: string;
};

// UserProfile.tsx
const UserProfile = ({ userId }: UserProfileProps) => {
  const profile = useQuery(
    api.users.getUserById,
    userId ? { userId: userId as Id<"users"> } : "skip"
  );
  const { userProfile } = useUserProfile();
  const isSelf = userId === userProfile?._id;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.name}>
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text style={styles.username}>@{profile?.username}</Text>
        </View>
        <Image source={{ uri: profile?.imageUrl || "" }} style={styles.image} />
      </View>
      <Text style={styles.bio}>{profile?.bio || "No Bio"}</Text>
      <Text>
        {profile?.followersCount} followers ·{" "}
        {profile?.websiteUrl || "No website"}
      </Text>
      <View style={styles.buttonRow}>
        {isSelf && (
          <>
            <Link
              href={`/edit-profile?userId=${profile?._id}&biostring=${profile?.bio ? encodeURIComponent(profile.bio) : ""}&linkstring=${profile?.websiteUrl ? encodeURIComponent(profile.websiteUrl) : ""}&imageUrl=${profile?.imageUrl ? encodeURIComponent(profile.imageUrl) : ""}`}
              asChild
            >
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Share Profile</Text>
            </TouchableOpacity>
          </>
        )}
        {!isSelf && (
          <>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Mention</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    padding: 18,
    flex: 1,
  },

  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileTextContainer: { gap: 6 },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "gray",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  bio: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-evenly",
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  fullButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  fullButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

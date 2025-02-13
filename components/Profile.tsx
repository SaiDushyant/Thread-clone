import UserProfile from "@/components/UserProfile";
import { Colors } from "@/constants/Colors";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Tabs from "./Tabs";

interface ProfileProps {
  userId: string;
  showBackButton?: boolean;
}

const Profile = ({ userId, showBackButton = false }: ProfileProps) => {
  const { userProfile } = useUserProfile();
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={[]}
        renderItem={({ item }) => <Text>Test list</Text>}
        ListEmptyComponent={
          <Text style={styles.tabContentText}>
            You haven't posted anything yet
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backBtn}
                >
                  <Ionicons name="chevron-back" size={24} />
                  <Text>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name="web" size={24} />
              )}
              <View style={styles.headerIcon}>
                <Ionicons name="logo-instagram" size={24} color="black" />
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons name="log-out-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            {userId || userProfile?._id ? (
              <UserProfile userId={userId || userProfile?._id} />
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text>Loading user profile...</Text>
              </View>
            )}
            <Tabs onTabChange={() => {}} />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  tabContentText: {
    textAlign: "center",
    color: Colors.border,
    fontSize: 17,
    marginVertical: 16,
  },
});

export default Profile;

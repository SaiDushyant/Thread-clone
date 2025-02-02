import { Colors } from "@/constants/Colors";
import { useOAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  const handleFacebookLogin = async () => {
    try {
      const result = await startOAuthFlow();
      console.log("Facebook Login Result:", result); // Debugging
      const { createdSessionId, setActive } = result;

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        console.error("Facebook OAuth failed: No session ID received");
      }
    } catch (error) {
      console.error("Facebook OAuth Error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOAuthFlow();
      console.log("handleGoogleLogin createdSessionId:", createdSessionId);
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={style.container}>
      <Image
        source={require("@/assets/images/login.png")}
        style={style.LoginImage}
      />
      <ScrollView contentContainerStyle={style.container}>
        <Text style={style.title}>How would you like to use Threads?</Text>
        <View style={style.buttonContainer}>
          <TouchableOpacity
            style={style.loginButton}
            onPress={handleFacebookLogin}
          >
            <View style={style.loginButtonContent}>
              <Image
                source={require("@/assets/images/instagram_icon.webp")}
                style={style.loginButtonIcon}
              />
              <Text style={style.loginButtonText}>Continue with Instagram</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={style.loginButtonSubtitle}>
              Log in or create a Threads profile with your Instagram account.
              With a profile, you can post, interact and get personalised
              recommendations.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.loginButton}
            onPress={handleGoogleLogin}
          >
            <View style={style.loginButtonContent}>
              <Text style={style.loginButtonText}>Continue with Google</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={style.loginButton}>
            <View style={style.loginButtonContent}>
              <Text style={style.loginButtonText}>Use without a profile</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={style.loginButtonSubtitle}>
              You can browse Threads without a profile, but won't be able to
              post, interact or get personalised recommendations.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.switchAccount}>
            <Text>Switch Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  LoginImage: {
    width: "100%",
    height: 350,
  },

  title: {
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
  },
  loginButton: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  buttonContainer: {
    gap: 20,
    marginHorizontal: 20,
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginButtonIcon: {
    width: 50,
    height: 50,
  },
  loginButtonText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    flex: 1,
  },

  loginButtonSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    marginTop: 5,
    color: "#8d8d8d",
  },
  switchAccount: {
    fontSize: 14,
    color: Colors.border,
    alignSelf: "center",
  },
});

import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { styles } from '../styles/appStyles';

export const LoginScreen = ({
  username,
  password,
  onChangeUsername,
  onChangePassword,
  onLogin,
  isSubmitting,
  error,
}) => (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.select({ ios: 'padding', android: undefined })}
  >
    <View style={styles.card}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        value={username}
        onChangeText={onChangeUsername}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="username"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={onChangePassword}
        secureTextEntry
        textContentType="password"
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onLogin}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Text>
      </Pressable>
    </View>
    <StatusBar style="auto" />
  </KeyboardAvoidingView>
);

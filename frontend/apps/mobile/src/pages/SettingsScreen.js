import { Pressable, Text, View } from 'react-native';
import { styles } from '../styles/appStyles';

export const SettingsScreen = ({
  onLogout,
}) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderTitle}>Settings</Text>
    <View style={styles.settingsCard}>
      <Text style={styles.settingsLabel}>Account</Text>
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
        onPress={onLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  </View>
);

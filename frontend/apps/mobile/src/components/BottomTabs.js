import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TABS } from '../constants/tabs';
import { styles } from '../styles/appStyles';

export const BottomTabs = ({ activeTab, onChange }) => (
  <View style={styles.tabBar}>
    {TABS.map((tab) => {
      const isActive = tab.key === activeTab;
      return (
        <Pressable
          key={tab.key}
          onPress={() => onChange(tab.key)}
          style={({ pressed }) => [
            styles.tabButton,
            isActive && styles.tabButtonActive,
            pressed && styles.tabButtonPressed,
          ]}
        >
          <Ionicons
            name={tab.icon}
            size={18}
            color={isActive ? '#2563eb' : '#6b7280'}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

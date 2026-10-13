import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT } from '@/constants/layout';

// Simple SVG-like icons using unicode/text
function HomeIcon({ active }: { active: boolean }) {
  return <Text style={[tabStyles.icon, active && tabStyles.iconActive]}>⌂</Text>;
}
function SearchIcon({ active }: { active: boolean }) {
  return <Text style={[tabStyles.icon, active && tabStyles.iconActive]}>⊕</Text>;
}
function InboxIcon({ active }: { active: boolean }) {
  return <Text style={[tabStyles.icon, active && tabStyles.iconActive]}>◎</Text>;
}
function ProfileIcon({ active }: { active: boolean }) {
  return <Text style={[tabStyles.icon, active && tabStyles.iconActive]}>◉</Text>;
}

function CreateButton() {
  return (
    <View style={tabStyles.createWrapper}>
      <View style={tabStyles.createBtn}>
        <Text style={tabStyles.createIcon}>+</Text>
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  icon: {
    fontSize: 22,
    color: COLORS.subtext,
  },
  iconActive: {
    color: COLORS.white,
  },
  createWrapper: {
    top: -8,
    alignItems: 'center',
  },
  createBtn: {
    width: 48,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.white,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  createIcon: {
    fontSize: 26,
    fontWeight: '300',
    color: COLORS.black,
    lineHeight: 30,
    marginTop: -2,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.black,
          borderTopColor: COLORS.border,
          borderTopWidth: 0.5,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.subtext,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <HomeIcon active={focused} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused }) => <SearchIcon active={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: () => <CreateButton />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ focused }) => <InboxIcon active={focused} />,
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            fontSize: 10,
            minWidth: 16,
            height: 16,
            lineHeight: 16,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <ProfileIcon active={focused} />,
        }}
      />
    </Tabs>
  );
}

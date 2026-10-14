import { Tabs } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

function HomeIcon({ active }: { active: boolean }) {
  return <Ionicons name={active ? 'home' : 'home-outline'} size={24} color={active ? COLORS.white : COLORS.subtext} />;
}
function SearchIcon({ active }: { active: boolean }) {
  return <Ionicons name={active ? 'compass' : 'compass-outline'} size={25} color={active ? COLORS.white : COLORS.subtext} />;
}
function InboxIcon({ active }: { active: boolean }) {
  return <Ionicons name={active ? 'notifications' : 'notifications-outline'} size={24} color={active ? COLORS.white : COLORS.subtext} />;
}
function ProfileIcon({ active }: { active: boolean }) {
  return <Ionicons name={active ? 'person' : 'person-outline'} size={24} color={active ? COLORS.white : COLORS.subtext} />;
}

function CreateButton() {
  return (
    <View style={tabStyles.createWrapper}>
      <View style={tabStyles.createBtn}>
        <Ionicons name="add" size={24} color={COLORS.black} />
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  createWrapper: {
    top: -4,
    alignItems: 'center',
  },
  createBtn: {
    width: 44,
    height: 32,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.white,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: 'rgba(255,255,255,0.12)',
          borderTopWidth: 0.5,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
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

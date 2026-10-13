import { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { NOTIFICATIONS } from '@/data/mocks';
import type { Notification } from '@/data/mocks';

type Tab = 'all' | 'followers' | 'mentions';

const DM_PREVIEW = {
  id: 'dm1',
  user: 'Carlos Gaming',
  username: '@carlosgamer_col',
  preview: '¡Bro ese video estuvo brutal! 🔥',
  time: '10:29',
  unread: 1,
  avatarColor: '#25F4EE',
};

function NotifIcon({ type }: { type: Notification['type'] }) {
  const map = { like: '♥', follow: '◉', mention: '@', dm: '💬' };
  const colors = { like: COLORS.primary, follow: COLORS.accent, mention: COLORS.gold, dm: '#3B82F6' };
  return (
    <View style={[styles.notifIconWrap, { backgroundColor: colors[type] + '22' }]}>
      <Text style={[styles.notifIconText, { color: colors[type] }]}>{map[type]}</Text>
    </View>
  );
}

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'Todo' },
    { key: 'followers', label: 'Seguidores' },
    { key: 'mentions', label: 'Menciones' },
  ];

  const filtered = NOTIFICATIONS.filter(n => {
    if (activeTab === 'followers') return n.type === 'follow';
    if (activeTab === 'mentions') return n.type === 'mention';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bandeja</Text>
        <TouchableOpacity style={styles.dmBtn} onPress={() => router.push('/dm')}>
          <Text style={styles.dmIcon}>💬</Text>
          <View style={styles.dmBadge}>
            <Text style={styles.dmBadgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* DM preview */}
      <TouchableOpacity style={styles.dmPreview} onPress={() => router.push('/dm')} activeOpacity={0.8}>
        <View style={[styles.dmAvatar, { backgroundColor: DM_PREVIEW.avatarColor }]}>
          <Text style={styles.dmAvatarText}>C</Text>
        </View>
        <View style={styles.dmInfo}>
          <Text style={styles.dmName}>{DM_PREVIEW.user}</Text>
          <Text style={styles.dmText} numberOfLines={1}>{DM_PREVIEW.preview}</Text>
        </View>
        <View style={styles.dmMeta}>
          <Text style={styles.dmTime}>{DM_PREVIEW.time}</Text>
          <View style={styles.dmUnread}>
            <Text style={styles.dmUnreadText}>{DM_PREVIEW.unread}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {tabs.map(t => (
          <TouchableOpacity key={t.key} onPress={() => setActiveTab(t.key)} style={styles.tabBtn}>
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
            {activeTab === t.key && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.notifRow} activeOpacity={0.7}>
            <View style={[styles.notifAvatar, { backgroundColor: item.avatarColor }]}>
              <Text style={styles.notifAvatarText}>{item.user.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifUser}>@{item.user}</Text>
              <Text style={styles.notifText}>{item.text}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
            <NotifIcon type={item.type} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: { fontSize: FONT.size.xxl, fontWeight: FONT.weight.bold, color: COLORS.white },
  dmBtn: { position: 'relative', padding: 4 },
  dmIcon: { fontSize: 26 },
  dmBadge: {
    position: 'absolute',
    top: 0, right: 0,
    width: 16, height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dmBadgeText: { fontSize: 9, fontWeight: FONT.weight.bold, color: COLORS.white },

  dmPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dmAvatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  dmAvatarText: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },
  dmInfo: { flex: 1 },
  dmName: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.white },
  dmText: { fontSize: FONT.size.sm, color: COLORS.subtext, marginTop: 2 },
  dmMeta: { alignItems: 'flex-end', gap: 4 },
  dmTime: { fontSize: FONT.size.xs, color: COLORS.muted },
  dmUnread: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  dmUnreadText: { fontSize: 10, fontWeight: FONT.weight.bold, color: COLORS.white },

  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  tabBtn: {
    flex: 1, alignItems: 'center',
    paddingVertical: SPACING.sm,
    position: 'relative',
  },
  tabText: { fontSize: FONT.size.md, fontWeight: FONT.weight.medium, color: COLORS.subtext },
  tabTextActive: { color: COLORS.white, fontWeight: FONT.weight.bold },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: '20%', right: '20%',
    height: 2, backgroundColor: COLORS.white, borderRadius: 1,
  },

  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '55',
  },
  notifAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  notifAvatarText: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },
  notifContent: { flex: 1 },
  notifUser: { fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.white },
  notifText: { fontSize: FONT.size.sm, color: COLORS.subtext, marginTop: 1 },
  notifTime: { fontSize: FONT.size.xs, color: COLORS.muted, marginTop: 2 },
  notifIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  notifIconText: { fontSize: 14, fontWeight: FONT.weight.bold },
});

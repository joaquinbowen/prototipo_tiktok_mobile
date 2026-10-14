import { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { NOTIFICATIONS } from '@/data/mocks';
import type { Notification } from '@/data/mocks';

type Tab = 'all' | 'followers' | 'mentions';

const DM_PREVIEW = {
  id: 'dm1',
  user: 'Carlos Gaming',
  username: '@carlosgamer_col',
  preview: '¡Bro ese video estuvo genial!',
  time: '10:29',
  unread: 1,
  avatarColor: '#25F4EE',
};

function NotifIcon({ type }: { type: Notification['type'] }) {
  const iconMap: Record<Notification['type'], any> = {
    like: 'heart',
    follow: 'person-add',
    mention: 'at',
    dm: 'chatbubble-ellipses',
  };
  const colors = { like: COLORS.primary, follow: COLORS.accent, mention: COLORS.gold, dm: '#3B82F6' };
  return (
    <View style={[styles.notifIconWrap, { backgroundColor: colors[type] + '22' }]}>
      <Ionicons name={iconMap[type]} size={14} color={colors[type]} />
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
        <TouchableOpacity style={styles.dmBtn} onPress={() => router.push('/dm')} activeOpacity={0.8}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.white} />
          <View style={styles.dmBadge}>
            <Text style={styles.dmBadgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {tabs.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabChip, activeTab === t.key && styles.tabChipActive]}
            onPress={() => setActiveTab(t.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabChipText, activeTab === t.key && styles.tabChipTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          activeTab === 'all' ? (
            <TouchableOpacity
              style={styles.dmCard}
              onPress={() => router.push('/dm')}
              activeOpacity={0.8}
            >
              <View style={[styles.dmAvatar, { backgroundColor: DM_PREVIEW.avatarColor }]}>
                <Text style={styles.dmAvatarInitial}>{DM_PREVIEW.user.charAt(0)}</Text>
              </View>
              <View style={styles.dmInfo}>
                <View style={styles.dmTop}>
                  <Text style={styles.dmUser}>{DM_PREVIEW.user}</Text>
                  <Text style={styles.dmTime}>{DM_PREVIEW.time}</Text>
                </View>
                <Text style={styles.dmPreview} numberOfLines={1}>{DM_PREVIEW.preview}</Text>
              </View>
              <View style={styles.unreadDot} />
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.notifRow}>
            <View style={styles.notifAvatarWrap}>
              <View style={[styles.notifAvatar, { backgroundColor: item.avatarColor || COLORS.primary }]}>
                <Text style={styles.notifAvatarInitial}>{item.user.charAt(0)}</Text>
              </View>
              <NotifIcon type={item.type} />
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifText}>
                <Text style={styles.notifUser}>{item.user}</Text>
                {' '}{item.text}
              </Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
            {item.type === 'follow' && (
              <TouchableOpacity style={styles.followBackBtn} activeOpacity={0.8}>
                <Text style={styles.followBackText}>Seguir</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  title: { fontSize: 18, fontWeight: FONT.weight.bold, color: COLORS.white },
  dmBtn: { position: 'relative', padding: 4 },
  dmBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dmBadgeText: { fontSize: 10, fontWeight: FONT.weight.bold, color: COLORS.white },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  tabChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabChipActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  tabChipText: { fontSize: 12, fontWeight: FONT.weight.medium, color: COLORS.subtext },
  tabChipTextActive: { color: COLORS.black, fontWeight: FONT.weight.bold },

  dmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  dmAvatar: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  dmAvatarInitial: { fontSize: 18, fontWeight: FONT.weight.bold, color: COLORS.black },
  dmInfo: { flex: 1 },
  dmTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  dmUser: { fontSize: 14, fontWeight: FONT.weight.bold, color: COLORS.white },
  dmTime: { fontSize: 11, color: COLORS.muted },
  dmPreview: { fontSize: 12, color: COLORS.subtext },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },

  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  notifAvatarWrap: { position: 'relative' },
  notifAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  notifAvatarInitial: { fontSize: 16, fontWeight: FONT.weight.bold, color: COLORS.white },
  notifIconWrap: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  notifContent: { flex: 1 },
  notifText: { fontSize: 13, color: COLORS.white, lineHeight: 18 },
  notifUser: { fontWeight: FONT.weight.bold },
  notifTime: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  followBackBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
  },
  followBackText: { fontSize: 12, fontWeight: FONT.weight.bold, color: COLORS.white },
});

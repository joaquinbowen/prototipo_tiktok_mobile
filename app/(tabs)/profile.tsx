import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Dimensions, Modal,
  TextInput, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from '@/components/LinearGradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { MY_PROFILE, VIDEOS } from '@/data/mocks';
import { useMonetization } from '@/context/MonetizationContext';

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = Math.floor((width - 2) / 3);
const GRID_ITEM_HEIGHT = Math.floor(GRID_ITEM_WIDTH * 1.35);

const LIVE_BATTLES = [
  { id: 'b1', title: 'Batalla Live vs @carlosgamer_col', result: 'Victoria', isWin: true, views: '18.4K', gifts: '840 regalos' },
  { id: 'b2', title: 'Live Especial: Receta en Directo', result: 'Transmisión', isWin: false, views: '32.1K', gifts: '1.2K diamantes' },
  { id: 'b3', title: 'Batalla Live vs @mariafit_ec', result: 'Victoria', isWin: true, views: '12.8K', gifts: '620 regalos' },
  { id: 'b4', title: 'Preguntas y Respuestas con Fans', result: 'Transmisión', isWin: false, views: '15.4K', gifts: '450 diamantes' },
];

export default function ProfileScreen() {
  const { isPaid, balance, profile, updateProfile, resetDemo } = useMonetization();

  const [activeTab, setActiveTab] = useState<'videos' | 'lives' | 'likes'>('videos');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(profile.name);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editCategory, setEditCategory] = useState(profile.category);

  function handleOpenEdit() {
    setEditName(profile.name);
    setEditUsername(profile.username);
    setEditBio(profile.bio);
    setEditCategory(profile.category);
    setShowEditModal(true);
  }

  function handleSaveProfile() {
    if (!editName.trim()) {
      Alert.alert('Campo requerido', 'El nombre no puede estar vacío.');
      return;
    }
    updateProfile({
      name: editName.trim(),
      username: editUsername.trim().startsWith('@') ? editUsername.trim() : `@${editUsername.trim()}`,
      bio: editBio.trim(),
      category: editCategory.trim(),
    });
    setShowEditModal(false);
    Alert.alert('Perfil Actualizado', 'Tus cambios se han guardado con éxito.');
  }

  function handleShareProfile() {
    setShowSettingsModal(false);
    Alert.alert('Enlace Copiado', `El enlace público https://viraly.latam/${profile.username} ha sido copiado.`);
  }

  function handleConfirmReset() {
    setShowSettingsModal(false);
    Alert.alert(
      'Reiniciar Demostración',
      '¿Deseas restaurar la cuenta al estado inicial sin monetizar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', style: 'destructive', onPress: resetDemo },
      ]
    );
  }

  function handleLogout() {
    setShowSettingsModal(false);
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.usernameWrap}>
            <Text style={styles.headerUsername}>{profile.username}</Text>
            {isPaid && (
              <Ionicons name="checkmark-circle" size={15} color="#D4AF37" style={{ marginLeft: 4 }} />
            )}
          </View>
          <TouchableOpacity onPress={() => setShowSettingsModal(true)} style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="ellipsis-horizontal" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Avatar + stats */}
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: profile.avatarColor || '#FE2C55' }]}>
            <Text style={styles.avatarInitial}>
              {profile.name.charAt(0)}
            </Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { label: 'Siguiendo', value: MY_PROFILE.following.toLocaleString() },
              { label: 'Seguidores', value: (MY_PROFILE.followers / 1000).toFixed(1) + 'K' },
              { label: 'Me Gusta', value: (MY_PROFILE.likes / 1000).toFixed(1) + 'K' },
            ].map(stat => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Name + bio */}
        <View style={styles.bioSection}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>
            {isPaid && (
              <View style={styles.badgeMonetized}>
                <Ionicons name="shield-checkmark" size={11} color="#D4AF37" />
                <Text style={styles.badgeText}>CREADOR PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.categoryText}>{profile.category}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.btnSecondary} onPress={handleOpenEdit} activeOpacity={0.75}>
            <Ionicons name="pencil-outline" size={15} color={COLORS.white} style={{ marginRight: 4 }} />
            <Text style={styles.btnSecondaryText}>Editar perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push('/creator-studio')}
            activeOpacity={0.85}
          >
            <Ionicons name="flash" size={15} color="#000000" style={{ marginRight: 4 }} />
            <Text style={styles.btnPrimaryText}>Creator Studio</Text>
          </TouchableOpacity>
          {isPaid && (
            <TouchableOpacity
              style={styles.btnWallet}
              onPress={() => router.push('/wallet')}
              activeOpacity={0.85}
            >
              <Ionicons name="wallet-outline" size={15} color="#D4AF37" style={{ marginRight: 4 }} />
              <Text style={styles.btnWalletText}>${balance.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs: Videos, Batallas / Lives, Guardados */}
        <View style={styles.gridHeader}>
          <TouchableOpacity
            style={styles.gridTab}
            onPress={() => setActiveTab('videos')}
          >
            <Ionicons name="grid" size={18} color={activeTab === 'videos' ? COLORS.white : COLORS.muted} />
            {activeTab === 'videos' && <View style={styles.gridTabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridTab}
            onPress={() => setActiveTab('lives')}
          >
            <Ionicons name="flame" size={20} color={activeTab === 'lives' ? '#D4AF37' : COLORS.muted} />
            {activeTab === 'lives' && <View style={[styles.gridTabUnderline, { backgroundColor: '#D4AF37' }]} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridTab}
            onPress={() => setActiveTab('likes')}
          >
            <Ionicons name="heart-outline" size={20} color={activeTab === 'likes' ? COLORS.white : COLORS.muted} />
            {activeTab === 'likes' && <View style={styles.gridTabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* TAB 1: VIDEOS SUBIDOS (EDGE-TO-EDGE) */}
        {activeTab === 'videos' && (
          <View style={styles.videoGrid}>
            {[...VIDEOS, ...VIDEOS.slice(0, 4)].map((v, i) => (
              <TouchableOpacity key={`${v.id}-${i}`} style={styles.videoThumb} activeOpacity={0.85}>
                <LinearGradient
                  colors={v.gradientColors}
                  style={styles.videoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="play" size={20} color="rgba(255,255,255,0.7)" />
                </LinearGradient>
                <View style={styles.videoMeta}>
                  <Ionicons name="heart" size={11} color={COLORS.white} style={{ marginRight: 2 }} />
                  <Text style={styles.videoViews}>{(v.likes / 1000).toFixed(0)}K</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TAB 2: BATALLAS Y LIVES */}
        {activeTab === 'lives' && (
          <View style={styles.livesContainer}>
            {LIVE_BATTLES.map(b => (
              <View key={b.id} style={styles.liveCard}>
                <View style={styles.liveCardHeader}>
                  <View style={[styles.liveResultBadge, b.isWin ? styles.liveResultWin : styles.liveResultLive]}>
                    <Ionicons
                      name={b.isWin ? 'trophy' : 'radio'}
                      size={11}
                      color={b.isWin ? '#D4AF37' : '#FE2C55'}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.liveResultText, b.isWin ? styles.liveResultTextWin : styles.liveResultTextLive]}>
                      {b.result}
                    </Text>
                  </View>
                  <View style={styles.liveViewsBadge}>
                    <Ionicons name="eye-outline" size={12} color={COLORS.subtext} style={{ marginRight: 4 }} />
                    <Text style={styles.liveViewsText}>{b.views}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.liveCardTitle}>{b.title}</Text>
                  <View style={styles.liveGiftRow}>
                    <Ionicons name="gift-outline" size={13} color="#D4AF37" style={{ marginRight: 4 }} />
                    <Text style={styles.liveCardGifts}>{b.gifts} acumulados</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: ME GUSTA */}
        {activeTab === 'likes' && (
          <View style={styles.emptyLikesView}>
            <Ionicons name="lock-closed-outline" size={36} color={COLORS.muted} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyLikesTitle}>Los videos con me gusta son privados</Text>
            <Text style={styles.emptyLikesSub}>Solo tú puedes ver qué videos te han gustado</Text>
          </View>
        )}

      </ScrollView>

      {/* ============================================================== */}
      {/* MODAL: EDITAR PERFIL                                           */}
      {/* ============================================================== */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.modalSheetTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={handleSaveProfile}>
                <Text style={styles.modalSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: SPACING.md, gap: 14 }}>
              <View style={styles.editAvatarWrap}>
                <View style={[styles.avatar, { width: 72, height: 72, borderRadius: 36, backgroundColor: profile.avatarColor }]}>
                  <Text style={[styles.avatarInitial, { fontSize: 30 }]}>{editName.charAt(0)}</Text>
                </View>
                <Text style={styles.editPhotoLabel}>Foto de perfil vinculada a tu inicial</Text>
              </View>

              <View style={styles.editField}>
                <Text style={styles.editLabel}>Nombre</Text>
                <TextInput
                  style={styles.editInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Tu nombre completo"
                  placeholderTextColor={COLORS.muted}
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editLabel}>Nombre de usuario</Text>
                <TextInput
                  style={styles.editInput}
                  value={editUsername}
                  onChangeText={setEditUsername}
                  placeholder="@usuario"
                  placeholderTextColor={COLORS.muted}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editLabel}>Categoría o Nicho</Text>
                <TextInput
                  style={styles.editInput}
                  value={editCategory}
                  onChangeText={setEditCategory}
                  placeholder="ej. Gastronomía, Comedia, Fitness"
                  placeholderTextColor={COLORS.muted}
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editLabel}>Biografía</Text>
                <TextInput
                  style={[styles.editInput, { height: 80, textAlignVertical: 'top' }]}
                  value={editBio}
                  onChangeText={setEditBio}
                  placeholder="Escribe una breve descripción sobre tu contenido"
                  placeholderTextColor={COLORS.muted}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL: AJUSTES (3 PUNTITOS)                                    */}
      {/* ============================================================== */}
      <Modal visible={showSettingsModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.menuCard}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Opciones del Perfil</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Ionicons name="close" size={20} color={COLORS.subtext} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowSettingsModal(false);
                router.push('/creator-studio');
              }}
            >
              <Ionicons name="flash-outline" size={18} color="#D4AF37" />
              <Text style={styles.menuItemText}>Creator Studio & Monetización</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowSettingsModal(false);
                router.push('/wallet');
              }}
            >
              <Ionicons name="wallet-outline" size={18} color="#D4AF37" />
              <Text style={styles.menuItemText}>Mi Billetera y Retiros</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleShareProfile}>
              <Ionicons name="share-social-outline" size={18} color={COLORS.white} />
              <Text style={styles.menuItemText}>Compartir Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleConfirmReset}>
              <Ionicons name="refresh-outline" size={18} color={COLORS.white} />
              <Text style={styles.menuItemText}>Reiniciar Demostración</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerBtn: { padding: 4 },
  usernameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerUsername: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.white },

  profileSection: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    paddingBottom: 10,
    gap: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  avatarInitial: { fontSize: 32, fontWeight: FONT.weight.bold, color: COLORS.white },

  statsRow: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: FONT.weight.bold, color: COLORS.white },
  statLabel: { fontSize: FONT.size.xs, color: COLORS.subtext, marginTop: 2 },

  bioSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    gap: 3,
    marginBottom: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.white },
  badgeMonetized: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderColor: 'rgba(212,175,55,0.3)',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: FONT.weight.bold,
    color: '#D4AF37',
  },
  categoryText: {
    fontSize: 11,
    color: '#D4AF37',
    fontWeight: FONT.weight.medium,
  },
  bio: { fontSize: FONT.size.xs, color: COLORS.subtext, textAlign: 'center', lineHeight: 18, marginTop: 2 },

  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: 8,
    marginBottom: SPACING.md,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: { fontSize: 12, fontWeight: FONT.weight.semibold, color: COLORS.white },
  btnPrimary: {
    flex: 1.2,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: { fontSize: 12, fontWeight: FONT.weight.bold, color: '#000000' },
  btnWallet: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWalletText: { fontSize: 12, fontWeight: FONT.weight.bold, color: '#D4AF37' },

  gridHeader: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  gridTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  gridTabUnderline: {
    position: 'absolute',
    bottom: 0, left: '25%', right: '25%',
    height: 2,
    backgroundColor: COLORS.white,
  },

  // Video Grid Edge-to-Edge
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  videoThumb: {
    width: GRID_ITEM_WIDTH,
    height: GRID_ITEM_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  videoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoMeta: {
    position: 'absolute',
    bottom: 4, left: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoViews: { fontSize: 11, color: COLORS.white, fontWeight: FONT.weight.semibold },

  // Lives Tab
  livesContainer: {
    padding: SPACING.md,
    gap: 10,
  },
  liveCard: {
    backgroundColor: '#121212',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  liveCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveResultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  liveResultWin: {
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderColor: 'rgba(212,175,55,0.3)',
  },
  liveResultLive: {
    backgroundColor: 'rgba(254,44,85,0.12)',
    borderColor: 'rgba(254,44,85,0.3)',
  },
  liveResultText: {
    fontSize: 10,
    fontWeight: FONT.weight.bold,
  },
  liveResultTextWin: {
    color: '#D4AF37',
  },
  liveResultTextLive: {
    color: '#FE2C55',
  },
  liveViewsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveViewsText: {
    fontSize: 11,
    color: COLORS.subtext,
    fontWeight: FONT.weight.medium,
  },
  liveCardTitle: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  liveGiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  liveCardGifts: {
    fontSize: 11,
    color: COLORS.subtext,
  },

  emptyLikesView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyLikesTitle: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  emptyLikesSub: {
    fontSize: 11,
    color: COLORS.subtext,
    textAlign: 'center',
  },

  // Edit Modal Sheet
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#141414',
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  modalSheetTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  modalCancelText: {
    fontSize: FONT.size.sm,
    color: COLORS.subtext,
  },
  modalSaveText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: '#D4AF37',
  },
  editAvatarWrap: {
    alignItems: 'center',
    marginVertical: 6,
    gap: 6,
  },
  editPhotoLabel: {
    fontSize: 11,
    color: COLORS.subtext,
  },
  editField: {
    gap: 6,
  },
  editLabel: {
    fontSize: 11,
    color: COLORS.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.white,
    fontSize: 13,
  },

  // Settings Menu
  menuCard: {
    margin: SPACING.md,
    backgroundColor: '#161616',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: SPACING.md,
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: 4,
  },
  menuTitle: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: FONT.weight.medium,
    color: COLORS.white,
  },
});

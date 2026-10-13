import { useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { MESSAGES, DM_USER } from '@/data/mocks';
import type { Message } from '@/data/mocks';

export default function DMScreen() {
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text,
      fromMe: true,
      time: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={[styles.headerAvatar, { backgroundColor: DM_USER.avatarColor }]}>
            <Text style={styles.headerAvatarText}>C</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{DM_USER.name}</Text>
            <Text style={styles.headerUsername}>{DM_USER.username}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[styles.bubbleText, item.fromMe && styles.bubbleTextMe]}>
                {item.text}
              </Text>
              <Text style={[styles.bubbleTime, item.fromMe && styles.bubbleTimeMe]}>
                {item.time}
              </Text>
            </View>
          )}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.mediaBtn}>
            <Text style={styles.mediaBtnIcon}>+</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Mensaje..."
            placeholderTextColor={COLORS.muted}
            multiline
            maxLength={500}
          />
          {input.trim().length > 0 ? (
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendBtnText}>↑</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.likeBtn}>
              <Text style={styles.likeBtnText}>♥</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  backBtn: { paddingRight: SPACING.xs },
  backIcon: { fontSize: 28, color: COLORS.white, lineHeight: 32 },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },
  headerInfo: { flex: 1 },
  headerName: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.white },
  headerUsername: { fontSize: FONT.size.xs, color: COLORS.muted },
  moreIcon: { fontSize: 22, color: COLORS.subtext },

  messageList: {
    padding: SPACING.md,
    gap: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  bubble: {
    maxWidth: '78%',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 18,
    marginBottom: SPACING.xs,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bubbleText: {
    fontSize: FONT.size.md,
    color: COLORS.subtext,
    lineHeight: 20,
  },
  bubbleTextMe: { color: COLORS.white },
  bubbleTime: {
    fontSize: FONT.size.xs,
    color: COLORS.muted,
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.6)' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  mediaBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  mediaBtnIcon: { fontSize: 22, color: COLORS.subtext, lineHeight: 28 },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    fontSize: FONT.size.md,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnText: { fontSize: 18, color: COLORS.white, fontWeight: FONT.weight.bold },
  likeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  likeBtnText: { fontSize: 18, color: COLORS.primary },
});

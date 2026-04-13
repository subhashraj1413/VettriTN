import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { TVKColors, typography, spacing, radius } from '../theme';
import { aiService } from '../services/aiService';

type Message = {
  id:   string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
};

const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const ChatScreen: React.FC = () => {
  const { strings } = useAppLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: strings.chat.welcome,
      time: now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading,   setLoading]   = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setMessages(prev =>
      prev.length === 1 && prev[0]?.id === '0'
        ? [{ ...prev[0], text: strings.chat.welcome }]
        : prev,
    );
  }, [strings.chat.welcome]);

  const addMessage = useCallback((role: 'user' | 'assistant', text: string) => {
    const msg: Message = {
      id:   Date.now().toString(),
      role,
      text,
      time: now(),
    };
    setMessages(prev => [...prev, msg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    return msg;
  }, []);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInputText('');
    addMessage('user', trimmed);
    setLoading(true);

    try {
      // Try OpenAI API first, fall back to offline responses
      const response = await aiService.sendMessage(trimmed);
      addMessage('assistant', response.message);
    } catch {
      addMessage('assistant', aiService.getOfflineResponse(trimmed));
    } finally {
      setLoading(false);
    }
  }, [loading, addMessage]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Text style={{ fontSize: 14 }}>🤖</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {item.text}
          </Text>
          <Text style={[styles.bubbleTime, isUser && { color: 'rgba(255,255,255,0.6)' }]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + 56}
    >
      <StatusBar barStyle="light-content" backgroundColor={TVKColors.primary} />

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <DrawerMenuButton />
        <View style={styles.headerAvatarWrap}>
          <View style={styles.headerAvatar}>
            <Text style={{ fontSize: 18 }}>🤖</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>
        <View>
          <Text style={styles.headerTitle}>{strings.chat.title}</Text>
          <Text style={styles.headerSub}>{strings.chat.subtitle}</Text>
        </View>
      </View>

      {/* ─── Messages ───────────────────────────────────────────────── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          loading ? (
            <View style={styles.typingRow}>
              <View style={styles.botAvatar}>
                <Text style={{ fontSize: 14 }}>🤖</Text>
              </View>
              <View style={styles.typingBubble}>
                <ActivityIndicator color={TVKColors.primary} size="small" />
                <Text style={styles.typingText}>{strings.chat.typing}</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* ─── Quick Suggestions ──────────────────────────────────────── */}
      {messages.length <= 2 && (
        <View>
          <Text style={styles.suggTitle}>{strings.chat.quickQuestions}</Text>
          <FlatList
            horizontal
            data={strings.chat.suggestions}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggChip}
                onPress={() => handleSend(item)}
                activeOpacity={0.75}
              >
                <Text style={styles.suggChipText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* ─── Input Bar ──────────────────────────────────────────────── */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={strings.chat.placeholder}
          placeholderTextColor={TVKColors.textTertiary}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={() => handleSend(inputText)}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!inputText.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => handleSend(inputText)}
          disabled={!inputText.trim() || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TVKColors.background },

  // Header
  header: {
    backgroundColor:   TVKColors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.md,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               spacing.md,
  },
  headerAvatarWrap: { position: 'relative' },
  headerAvatar: {
    width:           44,
    height:          44,
    borderRadius:    22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  onlineDot: {
    position:        'absolute',
    bottom:          1,
    right:           1,
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: TVKColors.success,
    borderWidth:     2,
    borderColor:     TVKColors.primary,
  },
  headerTitle: { ...typography.h5, color: TVKColors.white },
  headerSub:   { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 1 },

  // Messages
  messageList: { padding: spacing.lg, paddingBottom: spacing.sm },
  msgRow:     { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.md, gap: spacing.sm },
  msgRowUser: { flexDirection: 'row-reverse' },
  botAvatar:  {
    width:           32,
    height:          32,
    borderRadius:    16,
    backgroundColor: TVKColors.primaryLight,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  bubble:        { maxWidth: '78%', borderRadius: radius.lg, padding: spacing.md },
  bubbleBot:     {
    backgroundColor: TVKColors.surface,
    borderRadius:    radius.sm,
    borderBottomLeftRadius: radius.lg,
    borderTopLeftRadius:    radius.lg,
    borderTopRightRadius:   radius.lg,
    borderWidth:     0.5,
    borderColor:     TVKColors.border,
  },
  bubbleUser:    {
    backgroundColor:     TVKColors.primary,
    borderBottomRightRadius: radius.sm,
  },
  bubbleText:    { ...typography.body2, color: TVKColors.textPrimary, lineHeight: 22 },
  bubbleTextUser:{ color: TVKColors.white },
  bubbleTime:    { ...typography.micro, color: TVKColors.textTertiary, marginTop: spacing.xs, alignSelf: 'flex-end' },

  // Typing
  typingRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  typingBubble: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing.sm,
    backgroundColor: TVKColors.surface,
    borderRadius:    radius.lg,
    padding:         spacing.md,
    borderWidth:     0.5,
    borderColor:     TVKColors.border,
  },
  typingText: { ...typography.caption, color: TVKColors.textSecondary },

  // Suggestions
  suggTitle:  { ...typography.caption, color: TVKColors.textTertiary, marginLeft: spacing.lg, marginBottom: spacing.xs },
  suggList:   { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  suggChip:   {
    backgroundColor: TVKColors.primaryLight,
    borderRadius:    radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.xs,
    borderWidth:     0.5,
    borderColor:     `${TVKColors.primary}30`,
  },
  suggChipText: { ...typography.caption, color: TVKColors.primaryDark },

  // Input
  inputBar: {
    flexDirection:   'row',
    alignItems:      'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.md,
    gap:             spacing.sm,
    backgroundColor: TVKColors.surface,
    borderTopWidth:  0.5,
    borderTopColor:  TVKColors.border,
  },
  input: {
    flex:            1,
    backgroundColor: TVKColors.background,
    borderRadius:    radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.sm,
    ...typography.body2,
    color:           TVKColors.textPrimary,
    maxHeight:       100,
    borderWidth:     0.5,
    borderColor:     TVKColors.border,
  },
  sendBtn: {
    width:           44,
    height:          44,
    borderRadius:    22,
    backgroundColor: TVKColors.primary,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  sendBtnDisabled: { backgroundColor: TVKColors.border },
  sendIcon: { fontSize: 16, color: TVKColors.white, marginLeft: 2 },
});

export default ChatScreen;

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useTheme } from '../hooks/useTheme';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { TVKColors } from '../theme';
import { aiService } from '../services/aiService';

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id:   string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
};

const now = () =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// ─── Component ───────────────────────────────────────────────────────────────

const ChatScreen: React.FC = () => {
  const { strings } = useAppLanguage();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', text: strings.chat.welcome, time: now() },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading,   setLoading]   = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Sync welcome message when language changes
  useEffect(() => {
    setMessages(prev =>
      prev.length === 1 && prev[0]?.id === '0'
        ? [{ ...prev[0], text: strings.chat.welcome }]
        : prev,
    );
  }, [strings.chat.welcome]);

  const addMessage = useCallback((role: 'user' | 'assistant', text: string) => {
    const msg: Message = { id: Date.now().toString(), role, text, time: now() };
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
      const response = await aiService.sendMessage(trimmed);
      addMessage('assistant', response.message);
    } catch {
      addMessage('assistant', aiService.getOfflineResponse(trimmed));
    } finally {
      setLoading(false);
    }
  }, [loading, addMessage]);

  // ── Message bubble renderer ──────────────────────────────────────────────
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View className={`flex-row items-end mb-4 gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && (
          <View className="w-8 h-8 rounded-full bg-tvk-primary-light items-center justify-center flex-shrink-0">
            <Text className="text-sm">🤖</Text>
          </View>
        )}
        <View
          className={`max-w-[78%] rounded-2xl px-4 py-3 border ${
            isUser
              ? 'rounded-br-md border-transparent'
              : 'rounded-bl-md rounded-tl-2xl rounded-tr-2xl bg-tvk-surface border-tvk-border'
          }`}
          style={isUser ? { backgroundColor: theme.accent } : undefined}
        >
          <Text
            className="text-[14px] leading-6"
            style={isUser ? { color: theme.onAccent } : { color: theme.primaryText }}
          >
            {item.text}
          </Text>
          <Text
            className="text-[10px] font-medium mt-1 self-end"
            style={isUser ? { color: theme.onAccent, opacity: 0.68 } : { color: theme.secondaryText }}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  // ── Custom header content (bot avatar + online dot) ──────────────────────
  const headerRight = (
    <View className="relative mr-3">
      <View
        className="w-11 h-11 rounded-full items-center justify-center"
        style={{ backgroundColor: theme.headerChrome }}
      >
        <Text className="text-lg">🤖</Text>
      </View>
      <View
        className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-tvk-success border-2"
        style={{ borderColor: theme.headerBackground }}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-tvk-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + 56}
    >
      {/* Header — uses ScreenHeader with custom title row content via subtitle */}
      <View style={{ backgroundColor: theme.headerBackground }}>
        <View className="flex-row h-1">
          <View className="flex-1" style={{ backgroundColor: theme.headerText }} />
          <View className="flex-1" style={{ backgroundColor: theme.headerBackground }} />
          <View className="flex-1" style={{ backgroundColor: theme.headerText }} />
        </View>
        <View
          className="flex-row items-center gap-3 px-5 pb-4"
          style={{ paddingTop: insets.top + 14 }}
        >
          {/* DrawerMenuButton imported in ScreenHeader — replicate inline for chat-specific layout */}
          {headerRight}
          <View className="flex-1">
            <Text className="text-[17px] font-bold" style={{ color: theme.headerText }}>
              {strings.chat.title}
            </Text>
            <Text className="text-[12px] mt-0.5" style={{ color: theme.headerSubText }}>
              {strings.chat.subtitle}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          loading ? (
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-8 h-8 rounded-full bg-tvk-primary-light items-center justify-center">
                <Text className="text-sm">🤖</Text>
              </View>
              <View className="flex-row items-center gap-2 bg-tvk-surface rounded-2xl rounded-bl-md px-4 py-3 border border-tvk-border">
                <ActivityIndicator color={theme.accent} size="small" />
                <Text className="text-[12px] text-tvk-text-secondary">{strings.chat.typing}</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Quick suggestions (shown for first messages only) */}
      {messages.length <= 2 && (
        <View>
          <Text className="text-[11px] text-tvk-text-tertiary ml-4 mb-1">
            {strings.chat.quickQuestions}
          </Text>
          <FlatList
            horizontal
            data={strings.chat.suggestions}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="rounded-full px-4 py-1.5 border"
                style={{
                  backgroundColor: `${theme.accent}1F`,
                  borderColor: `${theme.accent}66`,
                }}
                onPress={() => handleSend(item)}
                activeOpacity={0.75}
              >
                <Text className="text-[12px]" style={{ color: theme.primaryText }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Input bar */}
      <View className="flex-row items-end gap-2 px-4 py-3 bg-tvk-surface border-t border-tvk-border">
        <TextInput
          className="flex-1 bg-tvk-background rounded-full px-4 py-2.5 text-[14px] text-tvk-text-primary max-h-24 border border-tvk-border"
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
          className="w-11 h-11 rounded-full items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: !inputText.trim() || loading ? theme.border : theme.accent,
          }}
          onPress={() => handleSend(inputText)}
          disabled={!inputText.trim() || loading}
          activeOpacity={0.8}
        >
          <Text
            className="text-base ml-0.5"
            style={{ color: !inputText.trim() || loading ? theme.secondaryText : theme.onAccent }}
          >
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

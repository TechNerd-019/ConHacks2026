import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Droplets, ArrowUp } from "lucide-react-native";
import { Message } from "../types";

interface AssistantProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function Assistant({ messages, onSendMessage }: AssistantProps) {
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>TODAY</Text>
        </View>

        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                isUser ? styles.messageWrapperUser : styles.messageWrapperBot,
              ]}
            >
              {!isUser && <Text style={styles.botLabel}>FLORA ASSISTANT</Text>}
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleBot,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.messageTextUser : styles.messageTextBot,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={styles.suggestionRow}>
          {['How are my plants?', 'Should I water?', 'Turn on lights'].map((text) => (
            <TouchableOpacity key={text} style={styles.suggestionButton} onPress={() => { onSendMessage(text); }}>
              <Text style={styles.suggestionText}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your plants..."
            placeholderTextColor="#a1a1aa"
            multiline
            submitBehavior="blurAndSubmit"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <ArrowUp size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 24,
  },
  dateHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  dateText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#a1a1aa",
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  messageWrapper: {
    marginBottom: 24,
    maxWidth: "85%",
  },
  messageWrapperUser: {
    alignSelf: "flex-end",
  },
  messageWrapperBot: {
    alignSelf: "flex-start",
  },
  botLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 8,
    marginBottom: 4,
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: "#166534",
    borderBottomRightRadius: 0,
  },
  bubbleBot: {
    backgroundColor: "#f0fdf4",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  messageTextUser: {
    color: "#ffffff",
  },
  messageTextBot: {
    color: "#18181b",
  },
  suggestionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f4f4f5",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#166534",
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    borderRadius: 28,
    paddingVertical: 8,
    paddingLeft: 24,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#18181b",
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: "#166534",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});

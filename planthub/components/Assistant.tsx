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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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
          <TouchableOpacity style={styles.suggestionButton}>
            <Droplets size={16} color="#166534" />
            <Text style={styles.suggestionText}>Log Watering Now</Text>
          </TouchableOpacity>
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
    marginTop: 8,
  },
  suggestionButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f4f4f5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#18181b",
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
import React, { useState, useRef, useEffect } from "react";
import { Send, Droplets, ArrowUp } from "lucide-react";
import { Message } from "../types.ts";
import { motion } from "motion/react";

interface AssistantProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function Assistant({ messages, onSendMessage }: AssistantProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-background-primary relative">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-8 pb-40"
      >
        <div className="flex justify-center mb-4">
          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full uppercase tracking-widest">
            TODAY
          </span>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}
          >
            {message.role === "bot" && (
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-2">
                Flora Assistant
              </span>
            )}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`max-w-[85%] px-5 py-4 rounded-[24px] shadow-sm leading-relaxed text-sm font-medium ${
                message.role === "user"
                  ? "bg-primary-container text-white rounded-br-none"
                  : "bg-inverse-primary text-text-primary rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </motion.div>
          </div>
        ))}

        <div className="flex gap-2">
          <button className="bg-white border border-zinc-100 text-text-primary text-xs font-bold px-5 py-3 rounded-full shadow-sm flex items-center gap-2 hover:bg-zinc-50 transition-colors">
            <Droplets className="w-4 h-4 text-primary-container" />
            Log Watering Now
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/80 backdrop-blur-md border-t border-zinc-100 z-40">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-zinc-100 border-none rounded-full py-4 pl-6 pr-14 text-sm font-medium focus:ring-2 focus:ring-primary-container/20 outline-none transition-all"
            placeholder="Ask about your plants..."
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 w-11 h-11 bg-primary-container text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

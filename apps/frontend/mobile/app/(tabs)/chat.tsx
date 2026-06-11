import { useState, useRef } from "react";
import {
  View, Text, TextInput, Pressable, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";
import {
  AGENTS, AGENT_QUICK_PROMPTS, AGENT_GREETINGS, agentReply,
  type AgentId,
} from "../../features/agents";

type Message = { role: "user" | "ai"; text: string; ts: number };

function makeHistory(): Record<AgentId, Message[]> {
  return {
    broker:    [{ role: "ai", text: AGENT_GREETINGS.broker,    ts: Date.now() }],
    concierge: [{ role: "ai", text: AGENT_GREETINGS.concierge, ts: Date.now() }],
    contract:  [{ role: "ai", text: AGENT_GREETINGS.contract,  ts: Date.now() }],
    verifier:  [{ role: "ai", text: AGENT_GREETINGS.verifier,  ts: Date.now() }],
  };
}

export default function ChatScreen() {
  const params  = useLocalSearchParams<{ agent?: string }>();
  const insets  = useSafeAreaInsets();
  const initial = (AGENTS.find(a => a.id === params.agent)?.id ?? "broker") as AgentId;

  const [activeAgent, setActiveAgent] = useState<AgentId>(initial);
  const [histories,   setHistories]   = useState<Record<AgentId, Message[]>>(makeHistory);
  const [loading,     setLoading]     = useState(false);
  const [input,       setInput]       = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const agent    = AGENTS.find(a => a.id === activeAgent)!;
  const messages = histories[activeAgent];

  const switchAgent = (id: AgentId) => {
    setActiveAgent(id);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 50);
  };

  const send = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", text: msg, ts: Date.now() };
    setHistories(h => ({ ...h, [activeAgent]: [...h[activeAgent], userMsg] }));
    setLoading(true);
    setTimeout(() => {
      const reply: Message = { role: "ai", text: agentReply(activeAgent, msg), ts: Date.now() };
      setHistories(h => ({ ...h, [activeAgent]: [...h[activeAgent], reply] }));
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 800 + Math.random() * 600);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      {/* Agent selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.selectorScroll}
        contentContainerStyle={s.selectorContent}
      >
        {AGENTS.map(a => {
          const active = a.id === activeAgent;
          return (
            <Pressable
              key={a.id}
              onPress={() => switchAgent(a.id as AgentId)}
              style={[s.agentChip, active && { borderColor: a.color, backgroundColor: `${a.color}18` }]}
            >
              <Text style={s.agentChipIcon}>{a.icon}</Text>
              <Text style={[s.agentChipName, { color: active ? a.color : Colors.textMuted }]}>
                {a.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Active agent header */}
      <View style={[s.header, { borderBottomColor: `${agent.color}28` }]}>
        <View style={[s.aiIcon, { backgroundColor: `${agent.color}12`, borderColor: `${agent.color}35` }]}>
          <Text style={{ fontSize: 20 }}>{agent.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>{agent.name}</Text>
          <View style={s.onlineRow}>
            <View style={[s.onlineDot, { backgroundColor: agent.color }]} />
            <Text style={s.onlineText}>{agent.sub}</Text>
          </View>
        </View>
      </View>

      {/* Quick prompts — only on first message */}
      {messages.length === 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.quickScroll}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {AGENT_QUICK_PROMPTS[activeAgent].map(p => (
            <Pressable key={p} onPress={() => send(p)} style={s.quickChip}>
              <Text style={s.quickText}>{p}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={s.messages}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        {messages.map((m, i) => (
          <View
            key={i}
            style={[
              s.bubble,
              m.role === "user"
                ? { ...s.userBubble, backgroundColor: agent.color }
                : s.aiBubble,
            ]}
          >
            {m.role === "ai" && (
              <Text style={[s.aiLabel, { color: agent.color }]}>
                {agent.icon} {agent.name}
              </Text>
            )}
            <Text style={[s.bubbleText, m.role === "user" && s.userBubbleText]}>
              {m.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={s.aiBubble}>
            <Text style={[s.aiLabel, { color: agent.color }]}>
              {agent.icon} {agent.name}
            </Text>
            <View style={s.typingRow}>
              {[0, 1, 2].map(i => (
                <View key={i} style={[s.typingDot, { backgroundColor: agent.color, opacity: 0.4 + i * 0.2 }]} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.bottom + 0}
      >
        <View style={[s.inputRow, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TextInput
            style={s.input}
            placeholder={`Hỏi ${agent.name}...`}
            placeholderTextColor={Colors.textDim}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
            returnKeyType="send"
            enablesReturnKeyAutomatically
            onSubmitEditing={() => send()}
            blurOnSubmit={false}
          />
          <Pressable
            style={[s.sendBtn, { backgroundColor: input.trim() ? agent.color : Colors.bgCard }, !input.trim() && s.sendBtnDisabled]}
            onPress={() => send()}
            disabled={!input.trim() || loading}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={input.trim() ? Colors.bg : Colors.textDim}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: Colors.bg },
  selectorScroll:  { flexGrow: 0, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  selectorContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  agentChip:       { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  agentChipIcon:   { fontSize: 14 },
  agentChipName:   { fontSize: Font.xs, fontWeight: "700" },
  header:          { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5 },
  aiIcon:          { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle:     { color: Colors.white, fontWeight: "700", fontSize: Font.base },
  onlineRow:       { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  onlineDot:       { width: 6, height: 6, borderRadius: 3 },
  onlineText:      { color: Colors.textMuted, fontSize: Font.xs },
  quickScroll:     { flexGrow: 0, paddingVertical: 10 },
  quickChip:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  quickText:       { color: Colors.textMuted, fontSize: Font.xs },
  messages:        { flex: 1 },
  bubble:          { maxWidth: "85%", padding: 14, borderRadius: 18 },
  aiBubble:        { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  userBubble:      { alignSelf: "flex-end", borderBottomRightRadius: 4 },
  aiLabel:         { fontSize: Font.xs, fontWeight: "700", marginBottom: 6 },
  bubbleText:      { color: Colors.text, fontSize: Font.sm, lineHeight: 22 },
  userBubbleText:  { color: Colors.bg, fontWeight: "600" },
  typingRow:       { flexDirection: "row", gap: 4, paddingVertical: 4 },
  typingDot:       { width: 7, height: 7, borderRadius: 4 },
  inputRow:        { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.border, alignItems: "flex-end", backgroundColor: Colors.bg },
  input:           { flex: 1, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: 16, paddingVertical: 11, color: Colors.text, fontSize: Font.sm, maxHeight: 120, lineHeight: 20 },
  sendBtn:         { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  sendBtnDisabled: { borderColor: Colors.border },
});

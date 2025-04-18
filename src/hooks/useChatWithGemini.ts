
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function useChatWithGemini(agentId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const saveMessage = useCallback(async (message: Message, chatSessionId: string) => {
    try {
      await supabase.from("chat_messages").insert({
        session_id: chatSessionId,
        role: message.role,
        content: message.content
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }, []);

  const createChatSession = useCallback(async (agentId: string, title = "New Chat") => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create a chat session",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
          agent_id: agentId,
          user_id: user.id,
          title
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error: any) {
      toast({
        title: "Error creating chat session",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  }, [toast, user]);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setSessionId(sessionId);
      setIsLoading(true);
      
      // Verify session belongs to current user
      const { data: sessionData, error: sessionError } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();
        
      if (sessionError) throw sessionError;
      
      if (sessionData.user_id !== user?.id) {
        throw new Error("You don't have permission to access this chat session");
      }
      
      // Load messages
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
        
      if (error) throw error;
      
      const loadedMessages = data.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));
      
      setMessages(loadedMessages);
    } catch (error: any) {
      toast({
        title: "Error loading chat session",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  const getAgentConfig = useCallback(async (agentId: string) => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", agentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching agent config:", error);
      return null;
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to send messages",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create or use existing chat session
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createChatSession(agentId);
        if (!currentSessionId) throw new Error("Failed to create chat session");
        setSessionId(currentSessionId);
      }

      // Save user message
      await saveMessage(userMessage, currentSessionId);

      // Get agent configuration
      const agentConfig = await getAgentConfig(agentId);

      // Send request to Gemini - ensure we're sending all previous messages for context
      const allMessages = [...messages, userMessage];
      console.log("Sending messages to Gemini:", JSON.stringify(allMessages));
      
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          messages: allMessages,
          agentConfig
        },
      });

      if (error) throw new Error(error.message);
      
      if (!data || !data.generatedText) {
        throw new Error("No response received from Gemini");
      }

      // Process response
      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.generatedText 
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant message
      await saveMessage(assistantMessage, currentSessionId);

    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [agentId, messages, sessionId, createChatSession, saveMessage, getAgentConfig, toast, user]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    resetChat,
    loadSession
  };
}

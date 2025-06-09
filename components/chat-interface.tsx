"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Heart,
  Send,
  Smile,
  Frown,
  Meh,
  Sparkles,
  MessageCircle,
  Plus,
  MoreVertical,
  Trash2,
  Edit3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import type { ChatMessage, ChatSession } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { getAIResponse } from "@/lib/ai";

interface ChatInterfaceProps {
  className?: string;
}

// Mock data structure - you'll replace this with actual Supabase data
const createIntroMessage = (): ChatMessage => ({
  id: "intro",
  user_id: "kaitanna",
  content:
    "Hi there! I'm Kaitanna, your emotional companion. I'm here to listen, understand, and support you through whatever you're feeling. Whether you want to share what's on your mind, talk about your day, or just need someone to be there for you - I'm here. How are you feeling today?",
  sender: "kaitanna",
  sentiment: "positive",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const initialSessions: ChatSession[] = [
  {
    id: "1",
    user_id: "user1",
    title: "Today's Check-in",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user1",
    title: "Weekend Reflection",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    last_message_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <Smile className="h-3 w-3 text-green-500" />;
    case "negative":
      return <Frown className="h-3 w-3 text-red-500" />;
    case "neutral":
      return <Meh className="h-3 w-3 text-gray-500" />;
    default:
      return <MessageCircle className="h-3 w-3 text-gray-500" />;
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "negative":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "neutral":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

export function ChatInterface({ className }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    createIntroMessage(),
  ]);
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    initialSessions[0]
  );
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const modelRef = useRef<{ sentiment: any; chat: any } | null>(null);

  // Dialog states
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<ChatSession | null>(null);
  const [newSessionName, setNewSessionName] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!user) return;

    const loadModels = async () => {
      // Assuming you're calling the ai.ts utilities here
      const { pipeline } = await import("@xenova/transformers");
      const sentimentPipeline = await pipeline("sentiment-analysis");
      const chatPipeline = await pipeline(
        "text-generation",
        "Xenova/distilgpt2"
      );
      modelRef.current = {
        sentiment: sentimentPipeline,
        chat: chatPipeline,
      };
    };

    loadModels();

    async function loadSessionsAndMessages() {
      try {
        // Load sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("sessions")
          .select("*")
          .eq("user_id", user?.id)
          .order("last_message_at", { ascending: false });

        if (sessionsError) throw sessionsError;

        setSessions(sessionsData);

        // Pick first session or null
        const firstSession = sessionsData?.[0] || null;
        setCurrentSession(firstSession);

        if (firstSession) {
          // Load messages for current session
          const { data: messagesData, error: messagesError } = await supabase
            .from("messages")
            .select("*")
            .eq("session_id", firstSession.id)
            .order("created_at", { ascending: true });

          if (messagesError) throw messagesError;

          setMessages(
            messagesData.length > 0 ? messagesData : [createIntroMessage()]
          );
        } else {
          setMessages([createIntroMessage()]);
        }
      } catch (error) {
        console.error("Error loading sessions or messages:", error);
      }
    }

    loadSessionsAndMessages();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      content: inputValue,
      sender: "user",
      sentiment: "neutral",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsGenerating(true);

    const output = await getAIResponse(inputValue);

    const aiMessage: ChatMessage = {
      id: Date.now().toString() + "-ai",
      user_id: "kaitanna",
      content: output.trim(),
      sender: "kaitanna",
      sentiment: "positive",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsGenerating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    if (!user) return;

    const newSession: ChatSession = {
      id: Date.now().toString(),
      user_id: user.id,
      title: "New Chat",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSession);
    setMessages([createIntroMessage()]);

    // TODO: Add your Supabase logic for creating new chat session
    console.log("Creating new chat session:", newSession);
  };

  const handleRenameSession = (session: ChatSession) => {
    setSessionToEdit(session);
    setNewSessionName(session.title);
    setIsRenameDialogOpen(true);
  };

  const confirmRename = () => {
    if (!sessionToEdit || !newSessionName.trim()) return;

    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionToEdit.id
          ? {
              ...session,
              title: newSessionName.trim(),
              updated_at: new Date().toISOString(),
            }
          : session
      )
    );

    if (currentSession?.id === sessionToEdit.id) {
      setCurrentSession((prev) =>
        prev ? { ...prev, title: newSessionName.trim() } : null
      );
    }

    setIsRenameDialogOpen(false);
    setSessionToEdit(null);
    setNewSessionName("");

    // TODO: Add your Supabase logic for renaming chat session
    console.log(
      "Renaming session:",
      sessionToEdit.id,
      "to:",
      newSessionName.trim()
    );
  };

  const handleDeleteSession = (session: ChatSession) => {
    setSessionToEdit(session);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!sessionToEdit) return;

    setSessions((prev) =>
      prev.filter((session) => session.id !== sessionToEdit.id)
    );

    // If we're deleting the current session, switch to another one or create a new one
    if (currentSession?.id === sessionToEdit.id) {
      const remainingSessions = sessions.filter(
        (session) => session.id !== sessionToEdit.id
      );
      if (remainingSessions.length > 0) {
        setCurrentSession(remainingSessions[0]);
      } else {
        // Create a new session if no sessions remain
        handleNewChat();
      }
    }

    setIsDeleteDialogOpen(false);
    setSessionToEdit(null);

    // TODO: Add your Supabase logic for deleting chat session
    console.log("Deleting session:", sessionToEdit.id);
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chat with Kaitanna</h3>
          <p className="text-muted-foreground">
            Please sign in to start chatting with your emotional companion.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className={`flex gap-6 h-[700px] ${className}`}>
        {/* Chat Sessions Sidebar */}
        <Card className="w-80 flex-shrink-0">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Chat History</CardTitle>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNewChat}
                className="h-8 w-8"
                title="New chat"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="p-3 space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSession?.id === session.id
                        ? "bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setCurrentSession(session)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.last_message_at).toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRenameSession(session)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSession(session)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Chat Interface */}
        <Card className="flex-1">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-cyan-500" />
                <div>
                  <CardTitle className="text-lg">
                    {currentSession?.title || "Chat with Kaitanna"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your emotional companion
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                Online
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[600px]">
              {/* Messages Area */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        {message.sender === "kaitanna" ? (
                          <>
                            <AvatarImage
                              src="/placeholder.svg?height=32&width=32"
                              alt="Kaitanna"
                            />
                            <AvatarFallback className="bg-cyan-500 text-white text-sm">
                              K
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage
                              src="/placeholder.svg?height=32&width=32"
                              alt={user.email}
                            />
                            <AvatarFallback className="bg-blue-500 text-white text-sm">
                              {user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div
                        className={`flex flex-col max-w-[75%] ${
                          message.sender === "user"
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.sender === "user"
                              ? "bg-cyan-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-foreground"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {message.sender === "user" && message.sentiment && (
                            <Badge
                              variant="outline"
                              className={`text-xs px-2 py-0.5 ${getSentimentColor(
                                message.sentiment
                              )}`}
                            >
                              {getSentimentIcon(message.sentiment)}
                              <span className="ml-1 capitalize">
                                {message.sentiment}
                              </span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="Kaitanna"
                        />
                        <AvatarFallback className="bg-cyan-500 text-white text-sm">
                          K
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex gap-3 mb-3">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    disabled={isLoading}
                    className="flex-1 rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="bg-cyan-500 hover:bg-cyan-600 rounded-full h-10 w-10"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-center">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Powered by Supabase • Real-time emotional support
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Give your chat session a new name to help you remember what you
              talked about.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Enter new chat name..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  confirmRename();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmRename} disabled={!newSessionName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{sessionToEdit?.title}"? This
              action cannot be undone and all messages in this chat will be
              permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

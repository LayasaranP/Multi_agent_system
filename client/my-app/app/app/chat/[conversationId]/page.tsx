"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { useAppStore } from "@/lib/store/app-store";

export default function ChatConversationPage() {
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const { setActiveConversationId } = useAppStore();

  useEffect(() => {
    if (conversationId) {
      setActiveConversationId(conversationId);
    }
  }, [conversationId, setActiveConversationId]);

  return <ChatWorkspace conversationId={conversationId} />;
}

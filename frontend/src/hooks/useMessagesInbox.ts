import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { messagingService } from "@/services/messagingService";
import type { Conversation, Message } from "@/types/messaging";

export function useMessagesInbox() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedProperty = params.get("property");
  const requestedConversation = params.get("conversation");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesFor, setMessagesFor] = useState<number | null>(null);
  const [messagesLoadingFor, setMessagesLoadingFor] = useState<number | null>(null);
  const [listWarning, setListWarning] = useState("");
  const listFailures = useRef(0);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const sending = useRef(false);

  const refresh = useCallback(async () => {
    const rows = await messagingService.list();
    setConversations(rows);
    return rows;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        let rows = await refresh();
        let next = requestedConversation ? Number(requestedConversation) : null;

        if (requestedProperty) {
          const conversation = await messagingService.openForProperty(requestedProperty);
          next = conversation.id;
          rows = await refresh();
        }
        if (cancelled) return;

        const validId = next && rows.some((row) => row.id === next) ? next : null;
        setActive(validId);
        if (validId) setMobileDetail(true);
      } catch (cause) {
        if (!cancelled) setError(errorMessage(cause, "Erreur de chargement."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void start();
    return () => { cancelled = true; };
  }, [refresh, requestedProperty, requestedConversation]);

  // Actualiser la liste même lorsqu'aucune conversation n'est sélectionnée.
  // Après trois échecs consécutifs, signaler l'indisponibilité sans vider la liste.
  useEffect(() => {
    let mounted = true;
    const timer = setInterval(() => {
      void refresh()
        .then(() => {
          if (!mounted) return;
          listFailures.current = 0;
          setListWarning("");
        })
        .catch(() => {
          if (!mounted) return;
          listFailures.current += 1;
          if (listFailures.current >= 3) {
            setListWarning("Actualisation des conversations indisponible. Réessayez plus tard.");
          }
        });
    }, 10000);
    return () => { mounted = false; clearInterval(timer); };
  }, [refresh]);

  useEffect(() => {
    if (active === null) return;
    let mounted = true;
    const conversationId = active;

    async function load() {
      try {
        const items = await messagingService.messages(conversationId);
        if (mounted) {
          setMessages(items);
          setMessagesFor(conversationId);
          setMessagesLoadingFor(null);
        }
      } catch (cause) {
        if (mounted) {
          setMessagesLoadingFor(null);
          setError(errorMessage(cause, "Erreur de chargement."));
        }
      }
    }

    void load();
    const timer = setInterval(() => { void load(); }, 10000);
    return () => { mounted = false; clearInterval(timer); };
  }, [active]);

  async function openConversation(id: number) {
    setMessagesLoadingFor(id);
    setActive(id);
    setMobileDetail(true);
    setError("");
    router.replace(`/messages?conversation=${id}`, { scroll: false });

    try {
      await messagingService.markRead(id);
      await refresh();
    } catch (cause) {
      setError(errorMessage(cause, "Impossible de marquer la conversation comme lue."));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || busy || active === null || !draft.trim()) return;

    sending.current = true;
    setBusy(true);
    setError("");
    const text = draft.trim();

    try {
      await messagingService.send(active, text);
      setDraft("");
      const updatedMessages = await messagingService.messages(active);
      setMessages(updatedMessages);
      setMessagesFor(active);
      await refresh();
    } catch (cause) {
      setError(errorMessage(cause, "Envoi impossible."));
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  function mobileBack() {
    setMobileDetail(false);
    router.replace("/messages", { scroll: false });
  }

  return {
    conversations,
    active,
    mobileDetail,
    messages: active !== null && messagesFor === active ? messages : [],
    messagesLoading: active !== null && (messagesFor !== active || messagesLoadingFor === active),
    listWarning,
    draft,
    busy,
    error,
    loading,
    selected: conversations.find((conversation) => conversation.id === active),
    openConversation,
    submit,
    mobileBack,
    setDraft,
    goHome: () => router.push("/"),
  };
}

function errorMessage(cause: unknown, fallback: string): string {
  return cause instanceof Error ? cause.message : fallback;
}

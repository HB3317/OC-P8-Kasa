import { useEffect, useRef, type FormEvent } from "react";
import type { Conversation, Message } from "@/types/messaging";
import { messageDay } from "@/utils/messageDates";
import MessageItem from "@/components/molecules/MessageItem/MessageItem";
import MessageComposer from "@/components/molecules/MessageComposer/MessageComposer";
import styles from "@/styles/organisms/MessagesInbox.module.css";

type Props = {
  selected?: Conversation;
  messages: Message[];
  messagesLoading: boolean;
  userId: number;
  mobileDetail: boolean;
  draft: string;
  busy: boolean;
  error: string;
  onMobileBack: () => void;
  onDraftChange: (draft: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ConversationThread({
  selected,
  messages,
  messagesLoading,
  userId,
  mobileDetail,
  draft,
  busy,
  error,
  onMobileBack,
  onDraftChange,
  onSubmit,
}: Props) {
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length, selected?.id]);

  return (
    <section
      className={`${styles.thread} ${mobileDetail ? styles.showMobile : ""}`}
      aria-label="Historique des messages"
    >
      <div className={styles.mobileBack}>
        <button type="button" className={styles.back} onClick={onMobileBack}>← Retour</button>
      </div>
      {selected ? (
        <>
          <div className={styles.history}>
            {messagesLoading ? (
              <p className={styles.empty}>Chargement des messages…</p>
            ) : messages.length === 0 ? (
              <p className={styles.empty}>
                Commencez la conversation au sujet de « {selected.property_title} ».
              </p>
            ) : (
              messages.map((message, index) => (
                <div key={message.id}>
                  {(index === 0 || messageDay(message.created_at) !== messageDay(messages[index - 1].created_at)) && (
                    <div className={styles.date}><span>{messageDay(message.created_at)}</span></div>
                  )}
                  <MessageItem
                    message={message}
                    userId={userId}
                    peerName={selected.peer_name}
                    peerPicture={selected.peer_picture}
                  />
                </div>
              ))
            )}
            <div ref={bottom} />
          </div>
          <MessageComposer draft={draft} busy={busy} onDraftChange={onDraftChange} onSubmit={onSubmit} />
        </>
      ) : (
        <div className={styles.empty}>Sélectionnez une conversation.</div>
      )}
      {error && <p role="alert" className={styles.error}>{error}</p>}
    </section>
  );
}

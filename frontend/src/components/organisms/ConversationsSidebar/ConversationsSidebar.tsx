import type { Conversation } from "@/types/messaging";
import ConversationItem from "@/components/molecules/ConversationItem/ConversationItem";
import styles from "@/styles/organisms/MessagesInbox.module.css";

type Props = {
  conversations: Conversation[];
  activeId: number | null;
  mobileDetail: boolean;
  loading: boolean;
  listWarning: string;
  onBack: () => void;
  onOpen: (id: number) => void;
};

export default function ConversationsSidebar({
  conversations,
  activeId,
  mobileDetail,
  loading,
  listWarning,
  onBack,
  onOpen,
}: Props) {
  return (
    <aside
      className={`${styles.sidebar} ${mobileDetail ? styles.hiddenMobile : ""}`}
      aria-label="Conversations"
    >
      <div className={styles.sideHeading}>
        <button className={styles.back} type="button" onClick={onBack}>← Retour</button>
        <h1>Messages</h1>
      </div>
      {listWarning && <p role="status" className={styles.info}>{listWarning}</p>}
      <div className={styles.list}>
        {loading ? (
          <p className={styles.info}>Chargement…</p>
        ) : conversations.length === 0 ? (
          <p className={styles.info}>Aucune conversation pour le moment.</p>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              selected={conversation.id === activeId}
              onOpen={onOpen}
            />
          ))
        )}
      </div>
    </aside>
  );
}

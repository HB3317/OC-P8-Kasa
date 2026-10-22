import Image from "next/image";
import type { Conversation } from "@/types/messaging";
import { messageTime } from "@/utils/messageDates";
import styles from "@/styles/organisms/MessagesInbox.module.css";

type Props = {
  conversation: Conversation;
  selected: boolean;
  onOpen: (id: number) => void;
};

export default function ConversationItem({ conversation, selected, onOpen }: Props) {
  const { id, peer_picture, peer_name, last_message, property_title, last_message_at, unread } = conversation;

  return (
    <button
      type="button"
      className={`${styles.conversation} ${selected ? styles.selected : ""}`}
      onClick={() => onOpen(id)}
      aria-current={selected ? "true" : undefined}
      aria-label={`${peer_name}${unread > 0 ? `, ${unread} messages non lus` : ""}`}
    >
      <span className={styles.avatar} aria-hidden="true">
        {peer_picture && (
          <Image src={peer_picture} alt="" fill sizes="36px" unoptimized className={styles.avatarImage} />
        )}
      </span>
      <span className={styles.preview}>
        <strong>{peer_name}</strong>
        <small>{last_message || property_title}</small>
      </span>
      <span className={styles.sideMeta}>
        <time>{messageTime(last_message_at)}</time>
        {unread > 0 && <span className={styles.dot} aria-hidden="true" />}
      </span>
    </button>
  );
}

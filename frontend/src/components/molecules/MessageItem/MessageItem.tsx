import Image from "next/image";
import type { Message } from "@/types/messaging";
import { resolveUploadImage } from "@/utils/resolveUploadImage";
import { messageTime } from "@/utils/messageDates";
import styles from "@/styles/templates/MessagesTemplate.module.css";

type Props = {
  message: Message;
  userId: number;
  peerName: string;
  peerPicture: string | null;
  userPicture: string | null;
};

export default function MessageItem({
  message,
  userId,
  peerName,
  peerPicture,
  userPicture,
}: Props) {
  const mine = message.sender_id === userId;
  const avatar = mine ? userPicture : peerPicture;

  return (
    <div className={`${styles.messageRow} ${mine ? styles.mine : ""}`}>
      <span className={styles.messageAvatar} aria-hidden="true">
        {avatar && (
          <Image
            src={resolveUploadImage(avatar)}
            alt=""
            fill
            sizes="25px"
            unoptimized
            className={styles.avatarImage}
          />
        )}
      </span>
      <div className={styles.messageMain}>
        <span className={styles.messageLabel}>
          {mine ? "Vous" : peerName} • {messageTime(message.created_at)}
        </span>
        <p className={styles.bubble}>{message.body}</p>
      </div>
    </div>
  );
}

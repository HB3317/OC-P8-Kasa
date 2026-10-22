import type { FormEvent } from "react";
import styles from "@/styles/organisms/MessagesInbox.module.css";

type Props = {
  draft: string;
  busy: boolean;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function MessageComposer({ draft, busy, onDraftChange, onSubmit }: Props) {
  return (
    <form className={styles.compose} onSubmit={onSubmit}>
      <label className={styles.sr} htmlFor="message-text">Envoyer un message</label>
      <textarea
        id="message-text"
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        maxLength={5000}
        placeholder="Envoyer un message"
        rows={2}
      />
      <button disabled={busy || !draft.trim()} type="submit" aria-label="Envoyer le message">
        ↑
      </button>
    </form>
  );
}

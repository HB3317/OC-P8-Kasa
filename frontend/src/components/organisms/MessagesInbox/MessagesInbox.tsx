"use client";

import ConversationsSidebar from "@/components/organisms/ConversationsSidebar/ConversationsSidebar";
import ConversationThread from "@/components/organisms/ConversationThread/ConversationThread";
import { useMessagesInbox } from "@/hooks/useMessagesInbox";
import styles from "@/styles/organisms/MessagesInbox.module.css";

type Props = { userId: number };

export default function MessagesInbox({ userId }: Props) {
  const inbox = useMessagesInbox();

  return (
    <div className={styles.shell}>
      <ConversationsSidebar
        conversations={inbox.conversations}
        activeId={inbox.active}
        mobileDetail={inbox.mobileDetail}
        loading={inbox.loading}
        listWarning={inbox.listWarning}
        onBack={inbox.goHome}
        onOpen={(id) => void inbox.openConversation(id)}
      />
      <ConversationThread
        selected={inbox.selected}
        messages={inbox.messages}
        messagesLoading={inbox.messagesLoading}
        userId={userId}
        mobileDetail={inbox.mobileDetail}
        draft={inbox.draft}
        busy={inbox.busy}
        error={inbox.error}
        onMobileBack={inbox.mobileBack}
        onDraftChange={inbox.setDraft}
        onSubmit={(event) => void inbox.submit(event)}
      />
    </div>
  );
}

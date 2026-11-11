"use client";

import ServerUnavailableTemplate from "@/components/templates/ServerUnavailableTemplate";

/**
 * Affiche une page Kasa complète lorsqu'un rendu échoue, notamment si Express est inaccessible.
 */
export default function ErrorPage() {
  return <ServerUnavailableTemplate onRetry={() => window.location.reload()} />;
}

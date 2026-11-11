import "server-only";

/**
 * Envoie un email d’accueil via Resend après la création réussie d’un compte.
 * Si les variables d’environnement manquent, aucun envoi n’est tenté ; un rejet HTTP est propagé à la route appelante, qui préserve l’inscription.
 * @param input Nom et adresse email du nouveau compte.
 * @returns {Promise<void>} Fin de la tentative d’envoi.
 */
export async function sendRegistrationConfirmation(input: {
  name: string;
  email: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !sender) {
    console.warn(
      "[email] Envoi non configuré : RESEND_API_KEY ou RESEND_FROM_EMAIL manquant.",
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [input.email],
      subject: "Bienvenue sur Kasa — inscription confirmée",
      text: `Bonjour ${input.name},\n\nVotre compte Kasa a bien été créé.\n\nVous pouvez maintenant vous connecter et découvrir les logements.\n\nÀ bientôt sur Kasa !`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Resend a refusé l'envoi (HTTP ${response.status}).`);
  }
}

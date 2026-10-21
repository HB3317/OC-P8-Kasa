"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { safeRedirect } from "@/utils/safeRedirect";
import { synchronizeGuestFavorites } from "@/services/favoriteService";
import Link from "next/link";
import { HttpError } from "@/services/httpClient";
import { login } from "@/services/clientAuthService";

import FormField from "@/components/atoms/FormField/FormField";
import styles from "@/styles/organisms/LoginForm.module.css";

export default function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();

  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setNotice("");

    const form = new FormData(event.currentTarget);

    try {
      await login({
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
      });

      await synchronizeGuestFavorites().catch(() => {});
      router.replace(safeRedirect(nextPath));
      router.refresh();
    } catch (error) {
      setNotice(error instanceof HttpError && error.status !== 503
        ? error.message
        : "Impossible de contacter le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.card} aria-labelledby="login-title">
      <div className={styles.intro}>
        <h1 id="login-title" className={styles.title}>
          Heureux de vous revoir
        </h1>

        <p className={styles.description}>
          Connectez-vous pour retrouver vos réservations, vos annonces
          et tout ce qui rend vos séjours uniques.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fields}>
          <FormField
            id="email"
            label="Adresse email"
            type="email"
            autoComplete="email"
            required
          />

          <FormField
            id="password"
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>

        {notice && (
          <p className={styles.notice} role="alert">
            {notice}
          </p>
        )}

        <div className={styles.links}>
          <Link href="/forgot-password">
            Mot de passe oublié
          </Link>

          <p>
            Pas encore de compte ?{" "}
            <Link href={`/register?next=${encodeURIComponent(safeRedirect(nextPath))}`}>Inscrivez-vous</Link>
          </p>
        </div>
      </form>
    </section>
  );
}

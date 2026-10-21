"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { httpClient, HttpError } from "@/services/httpClient";
import type { AuthUser } from "@/types/auth";

import FormField from "@/components/atoms/FormField/FormField";
import styles from "@/styles/organisms/RegisterForm.module.css";

export default function RegisterForm() {
  const router = useRouter();

  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setNotice("");

    const form = new FormData(event.currentTarget);

    const lastName = String(form.get("lastName") ?? "").trim();
    const firstName = String(form.get("firstName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (password.length < 6) {
      setNotice(
        "Le mot de passe doit contenir au moins 6 caractères.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await httpClient.post<{ user: AuthUser }, { name: string; email: string; password: string }>(
        "/api/auth/register",
        {
            name: `${firstName} ${lastName}`.trim(),
            email,
            password,
          },
      );

      router.replace("/");
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
    <section className={styles.card} aria-labelledby="register-title">
      <div className={styles.intro}>
        <h1 id="register-title" className={styles.title}>
          Rejoignez la communauté Kasa
        </h1>

        <p className={styles.description}>
          Créez votre compte et commencez à voyager autrement :
          réservez des logements uniques, découvrez de nouvelles
          destinations et partagez vos propres lieux avec d&apos;autres
          voyageurs.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <FormField
            id="lastName"
            label="Nom"
            type="text"
            autoComplete="family-name"
            required
          />

          <FormField
            id="firstName"
            label="Prénom"
            type="text"
            autoComplete="given-name"
            required
          />

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
            autoComplete="new-password"
            required
          />
        </div>

        <label className={styles.terms}>
          <input name="acceptTerms" type="checkbox" required />
          <span>
            J&apos;accepte les{" "}
            <span className={styles.termsText}>
              conditions générales d&apos;utilisation
            </span>
          </span>
        </label>

        <button
          type="submit"
          className={styles.submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>

        {notice && (
          <p className={styles.notice} role="alert">
            {notice}
          </p>
        )}

        <p className={styles.loginLink}>
          Déjà membre ?{" "}
          <Link href="/login">Se connecter</Link>
        </p>
      </form>
    </section>
  );
}

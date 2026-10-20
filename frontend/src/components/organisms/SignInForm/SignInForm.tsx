"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import FormField from "@/components/atoms/FormField/FormField";
import styles from "@/styles/organisms/SignInForm.module.css";

export default function SignInForm() {
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // L'inscription réelle sera intégrée avec le backend.
    setNotice("L'inscription sera disponible prochainement.");
  }

  return (
    <section className={styles.card} aria-labelledby="signin-title">
      <div className={styles.intro}>
        <h1 id="signin-title" className={styles.title}>
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
          <input
            name="acceptTerms"
            type="checkbox"
            required
          />
          <span>
            J&apos;accepte les{" "}
            <span className={styles.termsText}>
              conditions générales d&apos;utilisation
            </span>
          </span>
        </label>

        <button type="submit" className={styles.submit}>
          S&apos;inscrire
        </button>

        {notice && (
          <p className={styles.notice} role="status">
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

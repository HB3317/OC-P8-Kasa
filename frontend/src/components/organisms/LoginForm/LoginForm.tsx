"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import FormField from "@/components/atoms/FormField/FormField";
import styles from "@/styles/organisms/LoginForm.module.css";

export default function LoginForm() {
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // L'appel au backend sera ajouté pendant l'étape authentification.
    setNotice("La connexion au serveur n'est pas encore activée.");
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

        <button type="submit" className={styles.submit}>
          Se connecter
        </button>

        {notice && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}

        <div className={styles.links}>
          <Link href="/forgot-password">
            Mot de passe oublié
          </Link>

          <p>
            Pas encore de compte ?{" "}
            <Link href="/signin">Inscrivez-vous</Link>
          </p>
        </div>
      </form>
    </section>
  );
}

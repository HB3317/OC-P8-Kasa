import Header from "@/components/organisms/Header/Header";
import SignInForm from "@/components/organisms/SignInForm/SignInForm";
import Footer from "@/components/organisms/Footer/Footer";

import styles from "@/styles/templates/SignInTemplate.module.css";

export default function SignInTemplate() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <SignInForm />
      </main>

      <Footer />
    </div>
  );
}

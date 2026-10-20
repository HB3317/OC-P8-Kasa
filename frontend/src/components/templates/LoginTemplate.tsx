import Header from "@/components/organisms/Header/Header";
import LoginForm from "@/components/organisms/LoginForm/LoginForm";
import Footer from "@/components/organisms/Footer/Footer";

import styles from "@/styles/templates/LoginTemplate.module.css";

export default function LoginTemplate() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <LoginForm />
      </main>

      <Footer />
    </div>
  );
}

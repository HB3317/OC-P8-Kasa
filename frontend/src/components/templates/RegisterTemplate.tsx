import Header from "@/components/organisms/Header/Header";
import RegisterForm from "@/components/organisms/RegisterForm/RegisterForm";
import Footer from "@/components/organisms/Footer/Footer";

import styles from "@/styles/templates/RegisterTemplate.module.css";

export default function RegisterTemplate() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <RegisterForm />
      </main>

      <Footer />
    </div>
  );
}

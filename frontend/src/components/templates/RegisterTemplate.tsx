import Header from "@/components/organisms/Header/Header";
import RegisterForm from "@/components/organisms/RegisterForm/RegisterForm";
import Footer from "@/components/organisms/Footer/Footer";

import styles from "@/styles/templates/RegisterTemplate.module.css";

export default function RegisterTemplate({ nextPath }: { nextPath?: string }) {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <RegisterForm nextPath={nextPath} />
      </main>

      <Footer />
    </div>
  );
}

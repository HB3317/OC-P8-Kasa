import Link from 'next/link';
import Header from '@/components/organisms/Header/Header';
import Footer from '@/components/organisms/Footer/Footer';
import NewPropertyForm from '@/components/organisms/NewPropertyForm/NewPropertyForm';
import type {AuthUser} from '@/types/auth';
import styles from '@/styles/templates/NewPropertyTemplate.module.css';
export default function NewPropertyTemplate({user}:{user:AuthUser}){
 return <div className={styles.page}><Header/><main className={styles.main}><Link className={styles.back} href="/">← Retour aux annonces</Link><NewPropertyForm user={user}/></main><Footer/></div>;
}

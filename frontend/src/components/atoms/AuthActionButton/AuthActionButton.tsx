import PowerIcon from "@/components/quarks/PowerIcon";
import styles from "@/styles/atoms/AuthActionButton.module.css";

type AuthActionButtonProps = {
  isOpen: boolean;
  disabled: boolean;
  onClick: () => void;
};

export default function AuthActionButton({ isOpen, disabled, onClick }: AuthActionButtonProps) {
  return (
    <button type="button" className={styles.button} disabled={disabled}
      onClick={onClick} aria-label="Menu de connexion" aria-expanded={isOpen}
      aria-haspopup="true" title="Connexion / déconnexion">
      <PowerIcon />
    </button>
  );
}

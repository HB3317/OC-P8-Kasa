import MenuIcon from "@/components/quarks/MenuIcon";
import CloseIcon from "@/components/quarks/CloseIcon";
import styles from "@/styles/atoms/MenuToggleButton.module.css";

type MenuToggleButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
  controlsId: string;
};

export default function MenuToggleButton({
  isOpen,
  onToggle,
  controlsId,
}: MenuToggleButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onToggle}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isOpen}
      aria-controls={controlsId}
    >
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </button>
  );
}

import type { HTMLInputTypeAttribute } from "react";
import styles from "@/styles/atoms/FormField.module.css";

type FormFieldProps = {
  id: string;
  label: string;
  type: HTMLInputTypeAttribute;
  autoComplete: string;
  required?: boolean;
};

export default function FormField({
  id,
  label,
  type,
  autoComplete,
  required = false,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={styles.input}
      />
    </div>
  );
}

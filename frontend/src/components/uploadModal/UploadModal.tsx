import React, { useRef } from "react";
import styles from "./styles.module.css";

interface UploadModalProps {
  onClose: () => void;
  onUpload: (file: File) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  onClose,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];

    if (file) {
      onUpload(file);
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Importar Transações</h3>
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className={styles.actions}>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

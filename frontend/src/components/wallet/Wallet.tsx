import styles from "./styles.module.css";

interface WalletProps {
  balance: number; 
}

export const Wallet = ({ balance }: WalletProps) => {
  const formattedBalance = balance.toLocaleString("pt-BR");

  return (
    <div className={styles.container}>
      <span className={styles.label}>Saldo disponível</span>
      <span className={styles.balance}>{formattedBalance} pontos</span>
    </div>
  );
};

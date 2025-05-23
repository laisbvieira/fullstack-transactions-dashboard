import React from 'react';
import styles from './styles.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'success' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  icon?: React.ReactNode;  
}

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'success',
  size = 'medium',
  className = '',
  icon, 
}: ButtonProps) => {
  const computedClassName = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button onClick={onClick} type={type} className={computedClassName}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};


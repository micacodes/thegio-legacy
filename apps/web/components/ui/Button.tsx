import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  // Allow passing other classes like width, etc.
  className?: string; 
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-6 py-3 rounded-full font-bold transition-transform transform hover:scale-105 inline-flex items-center justify-center gap-2";

  const variantClasses = {
    primary: 'bg-brand-orange text-white',
    secondary: 'bg-brand-lime text-brand-dark',
    outline: 'bg-transparent border-2 border-gray-300 text-brand-dark hover:bg-gray-100',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
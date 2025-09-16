
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ text, icon, className, ...props }) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center px-6 py-2.5 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg ${className}`}
    >
      {icon && <span className="me-2">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;

import React from 'react';

interface InputFieldProps {
  id: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  required?: boolean;
  as?: 'input' | 'textarea' | 'select';
  datalistOptions?: string[];
  placeholder?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, value, onChange, type = 'text', required = false, as = 'input', datalistOptions, placeholder, icon }) => {
  const commonClassName = "bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-300";

  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    required,
    placeholder,
  };

  const datalistId = datalistOptions ? `${id}-options` : undefined;

  const inputElement = as === 'textarea' ? (
    <textarea {...commonProps} rows={3} className={`${commonClassName} ${icon ? 'ps-10' : ''}`} />
  ) : (
    <>
      <input type={type} {...commonProps} list={datalistId} className={`${commonClassName} ${icon ? 'ps-10' : ''}`} />
      {datalistOptions && (
        <datalist id={datalistId}>
          {datalistOptions.map(option => <option key={option} value={option} />)}
        </datalist>
      )}
    </>
  );

  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id} className="mb-2 font-medium text-gray-300">{label}{required && <span className="text-red-500 ms-1">*</span>}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        {inputElement}
      </div>
    </div>
  );
};

export default InputField;

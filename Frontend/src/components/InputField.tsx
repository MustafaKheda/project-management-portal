import React from "react";

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition-all outline-none"
      />
    </div>
  );
};

export default InputField;

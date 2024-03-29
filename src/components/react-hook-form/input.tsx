import {useFormContext} from "react-hook-form";
import React from "react"; // Make sure to import React

export type InputProps = {
  id: string;
  name: string;
  defaultValue?: any;
  type:
    | "text"
    | "email"
    | "url"
    | "number"
    | "password"
    | "date"
    | "datetime-local"
    | "month"
    | "search"
    | "tel"
    | "time"
    | "week";
  rules?: Record<string, any>;
  width?: string;
  placeholder?: string;
  max?: number;
  min?: number;
  readonly?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
};

export const Input: React.FC<InputProps> = ({
  id,
  min,
  max,
  name,
  type,
  rules = {},
  width = "w-full",
  placeholder = "",
  readonly = false,
  disabled = false,
  defaultValue,
  onChange,
}) => {
  const {register} = useFormContext();

  return (
    <input
      min={min}
      readOnly={readonly}
      max={max}
      {...register(name, rules)}
      placeholder={placeholder}
      type={type}
      name={name}
      defaultValue={defaultValue}
      id={id}
      disabled={disabled}
      onChange={onChange} // Attach the onChange event handler
      className={`form-input block ${width} border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 flex-grow-1 focus:border-blue-500 focus:ring-0 sm:text-sm rounded-md h-8`}
    />
  );
};

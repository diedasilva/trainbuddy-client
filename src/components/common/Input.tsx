type InputProps = {
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  export default function Input({ type, placeholder, value, onChange }: InputProps) {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg bg-gray-700 p-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
    );
  }
  
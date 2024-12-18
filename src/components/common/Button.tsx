type ButtonProps = {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "gradient";
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
  };
  
  export default function Button({
    children,
    variant = "primary",
    onClick,
    type = "button",
  }: ButtonProps) {
    const baseClass =
      "px-6 py-3 font-bold rounded-lg transition focus:outline-none focus:ring-2";
  
    const variants = {
      primary: "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-600",
      secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
      gradient:
        "bg-gradient-to-r from-gray-600 to-gray-400 text-black hover:from-gray-500 hover:to-gray-300 focus:ring-gray-500",
    };
  
    return (
      <button className={`${baseClass} ${variants[variant]}`} onClick={onClick} type={type}>
        {children}
      </button>
    );
  }
  
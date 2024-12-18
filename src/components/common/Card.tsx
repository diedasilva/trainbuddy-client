type CardProps = {
    children: React.ReactNode;
    className?: string;
  };
  
  export default function Card({ children, className = "" }: CardProps) {
    return (
      <div className={`p-6 bg-gray-800/70 rounded-lg shadow-lg ${className}`}>
        {children}
      </div>
    );
  }
  
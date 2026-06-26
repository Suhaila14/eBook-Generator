import React from "react";

const Button = ({
  varient = "Primary",
  size = "md",
  isLoading = false,
  children,
  icon: Icon,
  className = "",
  ...props
}) => {
  const varients = {
    primary:
      "bg-gradient-to-r from-violet-400 to-violet-500 hover:bg-violet-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    danger: "bg-transparent hover:bg-red-50 text-red-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8 rounded-lg",
    md: "px-4 py-2.5 text-sm h-11 rounded-xl",
    lg: "px-6 py-3 text-base h-12 rounded-xl",
  };
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap border border-violet-500 bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:bg-none hover:text-violet-600 transition-colors duration-400  ${varients[varient]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          />
          <path
            fill="currentColor"
            className="opacity-75"
            d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
          />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

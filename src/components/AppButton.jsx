import { motion } from "framer-motion";

function AppButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) {
  const baseClass =
    "min-h-12 rounded-2xl px-5 text-sm font-bold tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-55 block w-full";

  const variants = {
    primary:
      "bg-white text-[#10B981] ring-2 ring-inset ring-[#10B981] hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]",
    secondary:
      "bg-white text-[#6B7280] ring-2 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400",
    ghost:
      "bg-transparent text-[#6B7280] hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400",
    danger:
      "bg-white text-[#F97316] ring-2 ring-inset ring-[#F97316] hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default AppButton;

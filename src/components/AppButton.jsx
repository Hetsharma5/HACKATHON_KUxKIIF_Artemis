function AppButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) {
  const baseClass =
    "min-h-12 rounded-2xl px-5 text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55";

  const variants = {
    primary:
      "bg-leaf-600 text-white shadow-soft hover:bg-leaf-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500",
    secondary:
      "bg-white text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-400",
    ghost:
      "bg-transparent text-leaf-800 ring-1 ring-leaf-300 hover:bg-leaf-100/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-400",
    danger:
      "bg-earth-500 text-white shadow-soft hover:bg-earth-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default AppButton;

function BottomActionBar({ children }) {
  return (
    <footer className="sticky bottom-0 left-0 right-0 z-20 border-t border-leaf-100 bg-white/95 p-3 pb-4 shadow-[0_-8px_24px_-18px_rgba(0,0,0,0.45)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-xl">{children}</div>
    </footer>
  );
}

export default BottomActionBar;

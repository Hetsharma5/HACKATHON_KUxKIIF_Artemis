function BottomActionBar({ children }) {
  return (
    <footer className="sticky bottom-0 left-0 right-0 z-20 border-t-2 border-gray-100 bg-[#FFFFFF] p-4 pb-6">
      <div className="mx-auto w-full max-w-xl">{children}</div>
    </footer>
  );
}

export default BottomActionBar;

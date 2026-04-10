import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../hooks/useAuth";

function ScreenContainer({ title, subtitle, children, backTo }) {
  const { lang, cycleLanguage, t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col text-[#1F2937] text-left">
      <header className="px-5 pb-5 pt-8 text-left">
        <div className="mb-6 flex items-center justify-between">
          {backTo ? (
            <Link
              to={backTo}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1F2937] transition hover:bg-gray-50 flex items-center justify-center shadow-sm"
            >
              {t('back')}
            </Link>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {/* User avatar */}
            {user && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-8 h-8 rounded-full bg-leaf-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm"
                  title={user.name}
                >
                  {user.name?.charAt(0)}
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full w-8 h-8 bg-red-50 border border-red-100 flex items-center justify-center text-red-500 text-xs transition hover:bg-red-100 shadow-sm"
                  title="Logout"
                >
                  ⏻
                </button>
              </div>
            )}
            <button
              onClick={cycleLanguage}
              className="rounded-full shadow-sm bg-blue-50 border border-blue-100 flex items-center justify-center w-8 h-8 text-xs font-bold text-blue-700 transition hover:bg-blue-100 uppercase"
              title="Change Language"
            >
              {lang}
            </button>
            <span className="rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#059669]">
              {t('app_title')}
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#1F2937] tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{subtitle}</p>}
      </header>
      <main className="flex-1 px-5 pb-5">{children}</main>
    </div>
  );
}

export default ScreenContainer;

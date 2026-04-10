import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";

function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone.trim() || !name.trim()) {
      setError(t("login_error_fields"));
      return;
    }

    if (phone.trim().length < 10) {
      setError(t("login_error_phone"));
      return;
    }

    setLoading(true);
    try {
      await login(phone.trim(), name.trim());
      navigate("/");
    } catch (err) {
      setError(err.message || t("login_error_server"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ECFDF5] via-[#F0FDF4] to-[#DCFCE7] p-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-extrabold text-leaf-900 tracking-tight">
            KisanSarthi
          </h1>
          <p className="mt-2 text-sm text-leaf-700/80">{t("home_subtitle")}</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/90 backdrop-blur-sm border border-leaf-100 p-8 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.08)] space-y-5"
        >
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">{t("login_title")}</h2>
            <p className="text-xs text-[#6B7280] mt-1">{t("login_subtitle")}</p>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1.5">
              {t("login_name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("login_name_placeholder")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-[#1F2937] outline-none transition focus:border-leaf-400 focus:ring-2 focus:ring-leaf-100"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1.5">
              {t("login_phone")}
            </label>
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-bold text-[#6B7280]">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="9876543210"
                maxLength={10}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-[#1F2937] outline-none transition focus:border-leaf-400 focus:ring-2 focus:ring-leaf-100"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-leaf-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-leaf-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-pulse">{t("login_loading")}</span>
            ) : (
              t("login_button")
            )}
          </button>

          <p className="text-center text-[10px] text-[#9CA3AF] leading-relaxed">
            {t("login_disclaimer")}
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;

import { useNavigate } from "react-router-dom";
import AppButton from "../components/AppButton";
import ScreenContainer from "../components/ScreenContainer";
import { usePlannerStore } from "../hooks/usePlannerStore";
import { useTranslation } from "../hooks/useTranslation";

function HomeScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    setFieldAreaSqM,
    setPointsCount,
    setIsBoundaryCompleted,
    setOrientation,
    setSelectedCropKey,
  } = usePlannerStore();

  const startPlanning = () => {
    setFieldAreaSqM(0);
    setPointsCount(0);
    setIsBoundaryCompleted(false);
    setOrientation("auto");
    setSelectedCropKey("cotton");
    navigate("/draw-field");
  };

  return (
    <ScreenContainer
      title={t("app_title")}
      subtitle={t("home_subtitle")}
    >
      <section className="animate-rise rounded-3xl border border-leaf-100 bg-white/90 p-6 shadow-soft backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-leaf-700/85">
          {t("home_welcome")}
        </p>
        <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-leaf-900">
          {t("app_title")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-leaf-800/85">
          {t("home_description")}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <AppButton className="w-full text-base" onClick={startPlanning}>
            {t("start_planning")}
          </AppButton>
          <AppButton className="w-full text-base" variant="secondary" onClick={() => navigate("/my-lands")}>
            {t("my_lands_library")}
          </AppButton>
        </div>
      </section>
      <section className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <article className="rounded-2xl bg-leaf-900 p-4 text-white shadow-soft">
          <p className="font-semibold">{t("field_boundary")}</p>
          <p className="mt-1 text-xs text-leaf-100">
            {t("field_boundary_desc")}
          </p>
        </article>
        <article className="rounded-2xl bg-earth-500 p-4 text-white shadow-soft">
          <p className="font-semibold">{t("crop_blueprint")}</p>
          <p className="mt-1 text-xs text-amber-50">
            {t("crop_blueprint_desc")}
          </p>
        </article>
      </section>
    </ScreenContainer>
  );
}

export default HomeScreen;

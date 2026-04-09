import { useNavigate } from "react-router-dom";
import AppButton from "../components/AppButton";
import ScreenContainer from "../components/ScreenContainer";
import { usePlannerStore } from "../hooks/usePlannerStore";

function HomeScreen() {
  const navigate = useNavigate();
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
      title="KisanSarthi"
      subtitle="Smart plantation blueprint for every farmer"
    >
      <section className="animate-rise rounded-3xl border border-leaf-100 bg-white/90 p-6 shadow-soft backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-leaf-700/85">
        </p>
        <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-leaf-900">
          Plan your field in minutes, from boundary to crop economics.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-leaf-800/85">
          This first pass includes mobile-first UI and navigation flow across all
          screens. Tap through to validate user experience before map logic.
        </p>
        <div className="mt-6">
          <AppButton className="w-full text-base" onClick={startPlanning}>
            Start Planning
          </AppButton>
        </div>
      </section>
      <section className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <article className="rounded-2xl bg-leaf-900 p-4 text-white shadow-soft">
          <p className="font-semibold">Field Boundary</p>
          <p className="mt-1 text-xs text-leaf-100">
            Guided map-based boundary workflow
          </p>
        </article>
        <article className="rounded-2xl bg-earth-500 p-4 text-white shadow-soft">
          <p className="font-semibold">Crop Blueprint</p>
          <p className="mt-1 text-xs text-amber-50">
            Spacing, seed, yield, cost and profit view
          </p>
        </article>
      </section>
    </ScreenContainer>
  );
}

export default HomeScreen;

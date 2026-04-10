import { useTranslation } from "../hooks/useTranslation";

function CropCard({ crop, selected, onSelect }) {
  const { t } = useTranslation();
  const cropNameKey = `crop_${crop.name.toLowerCase()}`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        selected
          ? "border-leaf-500 bg-leaf-50 shadow-soft"
          : "border-leaf-100 bg-white/85 hover:border-leaf-300 hover:bg-leaf-50/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-base font-bold text-leaf-900">
          {t(cropNameKey) || crop.name}
        </h3>
        <span
          className={`rounded-full px-2 py-1 text-[11px] font-bold ${
            selected ? "bg-leaf-600 text-white" : "bg-leaf-100 text-leaf-700"
          }`}
        >
          {selected ? t("selected") : t("choose")}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-leaf-800">
        <p>{t("row_spacing")}: {crop.rowSpacingCm} cm</p>
        <p>{t("plant_spacing")}: {crop.plantSpacingCm} cm</p>
        <p>{t("seed")}: {crop.seedRateKgPerAcre} kg/acre</p>
        <p>{t("yield")}: {crop.yieldQuintalPerAcre} q/acre</p>
      </div>
    </button>
  );
}

export default CropCard;

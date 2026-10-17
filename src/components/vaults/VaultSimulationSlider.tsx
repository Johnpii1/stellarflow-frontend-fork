"use client";

import { useMemo, useState } from "react";

export type VaultSimulationSliderProps = {
  collateralAmount: number;
  collateralPriceUsd: number;
  currentDebtUsd: number;
  liquidationThreshold?: number;
  maxAdditionalBorrowUsd?: number;
  className?: string;
};

const usd = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export default function VaultSimulationSlider({
  collateralAmount,
  collateralPriceUsd,
  currentDebtUsd,
  liquidationThreshold = 0.75,
  maxAdditionalBorrowUsd,
  className = "",
}: VaultSimulationSliderProps) {
  const [additionalBorrowUsd, setAdditionalBorrowUsd] = useState(0);
  const collateralValueUsd = Math.max(0, collateralAmount * collateralPriceUsd);
  const safeThreshold = Math.min(1, Math.max(0.01, liquidationThreshold));
  const borrowLimit = Math.max(0, collateralValueUsd * safeThreshold - currentDebtUsd);
  const sliderMax = Math.max(1, maxAdditionalBorrowUsd ?? borrowLimit * 1.25, borrowLimit);
  const simulatedDebtUsd = currentDebtUsd + additionalBorrowUsd;

  const health = useMemo(() => {
    if (simulatedDebtUsd <= 0) return Number.POSITIVE_INFINITY;
    return collateralValueUsd * safeThreshold / simulatedDebtUsd;
  }, [collateralValueUsd, safeThreshold, simulatedDebtUsd]);

  const currentHealth = currentDebtUsd > 0
    ? collateralValueUsd * safeThreshold / currentDebtUsd
    : Number.POSITIVE_INFINITY;
  const nearLiquidation = Number.isFinite(health) && health <= 1.15;
  const liquidatable = Number.isFinite(health) && health <= 1;

  return (
    <section className={`rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-white sm:p-6 ${className}`}>
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Vault borrowing simulation</h2>
        <p className="mt-1 text-sm text-slate-400">Preview how additional debt affects your collateral health before borrowing.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white/[0.04] p-3">
          <p className="text-xs text-slate-400">Collateral value</p>
          <p className="mt-1 text-lg font-semibold">{usd.format(collateralValueUsd)}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] p-3">
          <p className="text-xs text-slate-400">Current debt</p>
          <p className="mt-1 text-lg font-semibold">{usd.format(currentDebtUsd)}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] p-3">
          <p className="text-xs text-slate-400">Simulated debt</p>
          <p className="mt-1 text-lg font-semibold">{usd.format(simulatedDebtUsd)}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="additional-borrow" className="text-sm font-medium">Additional borrow</label>
          <output htmlFor="additional-borrow" className="font-semibold tabular-nums">{usd.format(additionalBorrowUsd)}</output>
        </div>
        <input
          id="additional-borrow"
          type="range"
          min={0}
          max={sliderMax}
          step={Math.max(0.01, sliderMax / 500)}
          value={Math.min(additionalBorrowUsd, sliderMax)}
          onChange={(event) => setAdditionalBorrowUsd(Number(event.target.value))}
          className="w-full accent-lime-300"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{usd.format(0)}</span>
          <span>{usd.format(sliderMax)}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-sm text-slate-400">Health factor</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{Number.isFinite(currentHealth) ? currentHealth.toFixed(2) : "∞"}</span>
            <span className="text-slate-500">→</span>
            <span className={`text-2xl font-semibold ${liquidatable ? "text-rose-400" : nearLiquidation ? "text-amber-300" : "text-lime-300"}`}>
              {Number.isFinite(health) ? health.toFixed(2) : "∞"}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Health factor = collateral value × liquidation threshold ÷ debt.</p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-sm text-slate-400">Estimated liquidation price</p>
          <p className="mt-2 text-2xl font-semibold">{simulatedDebtUsd > 0 && collateralAmount > 0 ? usd.format(simulatedDebtUsd / (collateralAmount * safeThreshold)) : "—"}</p>
          <p className="mt-2 text-xs text-slate-500">Approximate collateral price at which this debt reaches the configured threshold.</p>
        </div>
      </div>

      {liquidatable ? (
        <p role="alert" className="mt-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">Warning: this simulated borrow reaches the liquidation threshold. Reduce the borrow or add collateral.</p>
      ) : nearLiquidation ? (
        <p role="status" className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">Caution: this position is close to its liquidation threshold.</p>
      ) : (
        <p role="status" className="mt-4 rounded-lg border border-lime-300/20 bg-lime-300/5 p-3 text-sm text-slate-300">This simulation is above the configured liquidation threshold. Market prices and protocol rules can change.</p>
      )}
    </section>
  );
}

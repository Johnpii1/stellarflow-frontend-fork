"use client";

import { useMemo } from "react";

export type AccountAssetBalance = {
  symbol: string;
  name?: string;
  balances: Record<string, number>;
  priceUsd: number;
};

export type ConnectedAccount = {
  address: string;
  label?: string;
};

export type AccountBalanceTableProps = {
  accounts: ConnectedAccount[];
  assets: AccountAssetBalance[];
  onTransferBetweenAccounts?: (sourceAddress: string, destinationAddress: string, assetSymbol: string) => void;
  className?: string;
};

const amountFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 7 });
const usdFormat = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

function shortenAddress(address: string) {
  return address.length > 14 ? `${address.slice(0, 6)}…${address.slice(-5)}` : address;
}

export default function AccountBalanceTable({
  accounts,
  assets,
  onTransferBetweenAccounts,
  className = "",
}: AccountBalanceTableProps) {
  const totals = useMemo(() => {
    const byAccount = Object.fromEntries(accounts.map((account) => [
      account.address,
      assets.reduce((sum, asset) => sum + (asset.balances[account.address] ?? 0) * asset.priceUsd, 0),
    ]));
    return { byAccount, all: Object.values(byAccount).reduce((sum, value) => sum + value, 0) };
  }, [accounts, assets]);

  const [sourceAddress, destinationAddress] = accounts;

  return (
    <section className={`min-w-0 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-white sm:p-6 ${className}`}>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Account balance comparison</h2>
          <p className="text-sm text-slate-400">Compare assets held by each connected wallet.</p>
        </div>
        <p className="text-sm text-slate-300">Combined value <strong className="ml-1 text-white">{usdFormat.format(totals.all)}</strong></p>
      </div>

      {accounts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-400">Connect a wallet to compare account balances.</p>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-max border-collapse text-left text-sm">
            <thead className="bg-white/[0.04]">
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-slate-900 px-4 py-3 font-medium text-slate-300">Asset</th>
                {accounts.map((account, index) => (
                  <th key={account.address} scope="col" className="min-w-48 px-4 py-3 font-medium text-slate-300">
                    <span className="block text-white">{account.label || `Account ${index + 1}`}</span>
                    <span className="mt-1 block font-mono text-xs">{shortenAddress(account.address)}</span>
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 font-medium text-slate-300">Total USD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map((asset) => {
                const totalUsd = accounts.reduce((sum, account) => sum + (asset.balances[account.address] ?? 0) * asset.priceUsd, 0);
                return (
                  <tr key={asset.symbol} className="hover:bg-white/[0.025]">
                    <th scope="row" className="sticky left-0 bg-slate-950 px-4 py-3 font-medium">
                      <span className="block">{asset.symbol}</span>
                      {asset.name && <span className="block text-xs font-normal text-slate-500">{asset.name}</span>}
                    </th>
                    {accounts.map((account) => (
                      <td key={account.address} className="px-4 py-3 tabular-nums text-slate-300">
                        {amountFormat.format(asset.balances[account.address] ?? 0)}
                        <span className="mt-1 block text-xs text-slate-500">{usdFormat.format((asset.balances[account.address] ?? 0) * asset.priceUsd)}</span>
                      </td>
                    ))}
                    <td className="px-4 py-3 font-medium tabular-nums">{usdFormat.format(totalUsd)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t border-white/10 bg-white/[0.04]">
              <tr>
                <th scope="row" className="sticky left-0 bg-slate-900 px-4 py-3">Total</th>
                {accounts.map((account) => (
                  <td key={account.address} className="px-4 py-3 font-semibold tabular-nums">{usdFormat.format(totals.byAccount[account.address] ?? 0)}</td>
                ))}
                <td className="px-4 py-3 font-semibold tabular-nums">{usdFormat.format(totals.all)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {accounts.length > 1 && onTransferBetweenAccounts && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-400">Quick transfer</span>
          <button
            type="button"
            onClick={() => onTransferBetweenAccounts(sourceAddress.address, destinationAddress.address, assets[0]?.symbol ?? "")}
            disabled={assets.length === 0}
            className="rounded-lg bg-lime-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Transfer between accounts
          </button>
          <span className="text-xs text-slate-500">Opens your app-provided transfer flow; this component does not submit transactions.</span>
        </div>
      )}
    </section>
  );
}

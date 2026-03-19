"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Step = "start" | "bill" | "plants" | "success";

type Plant = {
  id: string;
  name: string;
  discount: number;
};

const plants: Plant[] = Array.from({ length: 11 }, (_, idx) => ({
  id: String(idx + 1),
  name: `Usina ${idx + 1}`,
  discount: Math.max(1, Math.round(Math.random() * 10)),
}));

const fakeBarcode = "83620000001028670001002032000456789123456789";
const baseValue = 320.7;

export default function Home() {
  const [step, setStep] = useState<Step>("start");
  const [billCode, setBillCode] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const formatter = useMemo(
    () => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
    [],
  );

  const appliedValue = selectedPlant
    ? baseValue * (1 - selectedPlant.discount / 100)
    : baseValue;

  const resetFlow = () => {
    setStep("start");
    setBillCode("");
    setSelectedPlant(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {step === "start" && (
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
            <Logo />
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Toque para iniciar</h1>
            <p className="text-sm text-slate-200">
              Inicie para digitar ou escanear o código de barras da sua conta e aplicar desconto.
            </p>
            <button
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-[1px] hover:bg-emerald-300"
              onClick={() => setStep("bill")}
            >
              Iniciar
            </button>
          </div>
        </div>
      )}

      {step === "bill" && (
        <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-12 sm:px-8 lg:py-16">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo compact />
              <div>
                <p className="text-sm text-slate-200">Digite ou escaneie</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
              Passo 1/2
            </span>
          </header>

          <section className="grid items-start gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Digite o código de barras ou escaneie
              </h1>
              <p className="text-lg text-slate-200">
                Use o número da conta de energia ou leia o código para seguir com o desconto.
              </p>

              <label className="space-y-2">
                <span className="text-sm text-slate-200">Código de barras</span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                  placeholder="Digite ou cole o código"
                  value={billCode}
                  onChange={(e) => setBillCode(e.target.value)}
                  inputMode="numeric"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-[1px] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => {
                    setStep("plants");
                  }}
                  disabled={!billCode}
                >
                  Aplicar e continuar
                </button>
                <button
                  className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                  onClick={() => {
                    setBillCode(fakeBarcode);
                    setStep("plants");
                  }}
                >
                  Escanear código (demo)
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Dica: ao escanear, usamos um exemplo de conta para simular o fluxo.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[32px] bg-emerald-500/20 blur-3xl" />
              <div className="relative rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                <p className="text-sm text-slate-200">Pré-visualização</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span>Código</span>
                    <span className="truncate text-xs text-slate-100">
                      {billCode || "—"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-200">
                    <span>Conta estimada</span>
                    <span className="text-lg font-semibold text-white">
                      {formatter.format(baseValue)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Valor exemplo para simulação.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {step === "plants" && (
        <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-12 sm:px-8 lg:py-16">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo compact />
              <div>
                <p className="text-sm text-slate-200">Selecione a usina</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
              Passo 2/2
            </span>
          </header>

          <section className="space-y-6">
            <p className="text-lg text-slate-200">
              Escolha uma usina para aplicar o desconto. Cada opção já exibe o percentual.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {plants.map((plant) => (
                <button
                  key={plant.id}
                  className="flex h-full flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-emerald-300/60 hover:bg-white/10"
                  onClick={() => {
                    setSelectedPlant(plant);
                    setStep("success");
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">{plant.name}</p>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                      -{plant.discount}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">
                    Aplicado sobre {formatter.format(baseValue)}.
                  </p>
                </button>
              ))}
            </div>
            <button
              className="self-start text-sm text-slate-300 underline underline-offset-4 hover:text-white"
              onClick={() => setStep("bill")}
            >
              Voltar para código de barras
            </button>
          </section>
        </main>
      )}

      {step === "success" && selectedPlant && (
        <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-4 py-12 text-center sm:px-8 lg:py-16">
          <div className="w-full max-w-2xl space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-white/5 to-white/10 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-center">
              <Logo />
            </div>
            <h1 className="text-4xl font-semibold text-white">Sucesso!</h1>
            <p className="text-slate-200">
              O desconto da {selectedPlant.name} foi aplicado à sua conta.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-xs text-slate-300">Usina selecionada</p>
                <p className="text-lg font-semibold text-white">{selectedPlant.name}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-xs text-slate-300">Desconto</p>
                <p className="text-lg font-semibold text-emerald-200">-{selectedPlant.discount}%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-xs text-slate-300">Conta estimada</p>
                <p className="text-lg font-semibold text-white">{formatter.format(baseValue)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-xs text-slate-300">Conta com desconto</p>
                <p className="text-lg font-semibold text-emerald-200">
                  {formatter.format(appliedValue)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
                onClick={resetFlow}
              >
                Concluir
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Image
      src="/energia.png"
      alt="Confraenergia"
      width={compact ? 36 : 72}
      height={compact ? 36 : 96}
      className={compact ? "h-10 w-auto" : "h-16 w-auto"}
      priority
    />
  );
}

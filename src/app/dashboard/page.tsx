import Image from "next/image";

type Status = "aprovada" | "reprovada" | "analise";

type Account = {
  id: string;
  status: Status;
  desconto: number;
  valor: number;
  cliente: string;
};

const contas: Account[] = [
  { id: "001", status: "aprovada", desconto: 9.2, valor: 520.4, cliente: "Alpha Ltda" },
  { id: "002", status: "analise", desconto: 7.5, valor: 312.1, cliente: "Beta SA" },
  { id: "003", status: "reprovada", desconto: 0, valor: 410.3, cliente: "Gama ME" },
  { id: "004", status: "aprovada", desconto: 10, valor: 298.5, cliente: "Delta Digital" },
  { id: "005", status: "analise", desconto: 6.1, valor: 450.8, cliente: "Epsilon Group" },
  { id: "006", status: "aprovada", desconto: 8.4, valor: 380.6, cliente: "Zeta Comércio" },
];

function resumo() {
  const total = contas.length;
  const aprovadas = contas.filter((c) => c.status === "aprovada").length;
  const reprovadas = contas.filter((c) => c.status === "reprovada").length;
  const analise = contas.filter((c) => c.status === "analise").length;
  const valorBase = contas.reduce((acc, c) => acc + c.valor, 0);
  const mediaDesconto =
    total === 0 ? 0 : contas.reduce((acc, c) => acc + c.desconto, 0) / total;
  const descontoEstimado = contas.reduce(
    (acc, c) => acc + c.valor * (c.desconto / 100),
    0,
  );
  const valorProjetado = contas.reduce(
    (acc, c) => acc + c.valor * (1 - c.desconto / 100),
    0,
  );

  return {
    total,
    aprovadas,
    reprovadas,
    analise,
    mediaDesconto,
    descontoEstimado,
    valorProjetado,
    valorBase,
  };
}

const stats = resumo();

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8 lg:py-14">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Logo />
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Dashboard de contas
            </h1>
            <p className="text-sm text-slate-300">
              Visão rápida de cadastros, status e descontos aplicados.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Atualizado agora (dados mock)
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <StatCard title="Contas cadastradas" value={stats.total} />
          <StatCard title="Aprovadas" value={stats.aprovadas} accent="emerald" />
          <StatCard title="Reprovadas" value={stats.reprovadas} accent="rose" />
          <StatCard title="Em análise" value={stats.analise} accent="amber" />
          <StatCard
            title="Média de desconto"
            value={`${stats.mediaDesconto.toFixed(1)}%`}
            accent="cyan"
          />
          <StatCard
            title="Desconto estimado"
            value={formatter.format(stats.descontoEstimado)}
            accent="emerald"
          />
          <StatCard
            title="Valor projetado"
            value={formatter.format(stats.valorProjetado)}
            accent="blue"
          />
          <StatCard
            title="Ticket médio"
            value={formatter.format(stats.total === 0 ? 0 : stats.valorProjetado / stats.total)}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Contas recentes</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                Últimas 6
              </span>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/5">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-left text-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Desconto</th>
                    <th className="px-4 py-3">Valor proj.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contas.map((conta) => (
                    <tr key={conta.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-semibold text-white">{conta.id}</td>
                      <td className="px-4 py-3 text-slate-200">{conta.cliente}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={conta.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-200">{conta.desconto}%</td>
                      <td className="px-4 py-3 text-slate-200">
                        {formatter.format(conta.valor * (1 - conta.desconto / 100))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Status geral</h3>
              <div className="mt-4 space-y-3">
                <ProgressLine
                  label="Aprovadas"
                  value={stats.aprovadas}
                  total={stats.total}
                  color="bg-emerald-400"
                />
                <ProgressLine
                  label="Em análise"
                  value={stats.analise}
                  total={stats.total}
                  color="bg-amber-300"
                />
                <ProgressLine
                  label="Reprovadas"
                  value={stats.reprovadas}
                  total={stats.total}
                  color="bg-rose-400"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Resumo financeiro</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="flex items-center justify-between">
                  <span>Valor base</span>
                  <span className="font-semibold">{formatter.format(stats.valorBase)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Desconto estimado</span>
                  <span className="font-semibold text-emerald-200">
                    {formatter.format(stats.descontoEstimado)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Valor projetado</span>
                  <span className="font-semibold text-white">
                    {formatter.format(stats.valorProjetado)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: string | number;
  accent?: "emerald" | "rose" | "amber" | "cyan" | "blue";
}) {
  const color =
    accent === "emerald"
      ? "text-emerald-200"
      : accent === "rose"
        ? "text-rose-200"
        : accent === "amber"
          ? "text-amber-200"
          : accent === "cyan"
            ? "text-cyan-200"
            : accent === "blue"
              ? "text-blue-200"
              : "text-white";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-slate-300">{title}</p>
      <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    aprovada: "bg-emerald-500/20 text-emerald-100 border-emerald-400/40",
    reprovada: "bg-rose-500/20 text-rose-100 border-rose-400/40",
    analise: "bg-amber-500/20 text-amber-100 border-amber-400/40",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${map[status]}`}>
      {status === "aprovada" ? "Aprovada" : status === "reprovada" ? "Reprovada" : "Em análise"}
    </span>
  );
}

function ProgressLine({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-200">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percent}%` }}
          aria-label={`${label} ${percent}%`}
        />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/energia.png"
        alt="Confraenergia"
        width={72}
        height={96}
        className="h-14 w-auto"
        priority
      />
    </div>
  );
}

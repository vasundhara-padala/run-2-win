import { InfoCircleOutlined, TrophyOutlined } from "@ant-design/icons";
import DigitTiles from "@/components/DigitTiles";

export interface WinnerGroup {
  rank: number;
  amount: number;
  numbers: string[];
  /** Numbers among `numbers` that belong to the current viewer, if any. */
  myNumbers?: string[];
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function isMatch(number: string, query?: string): boolean {
  if (!query) return false;
  const normalized = query.replace(/\s+/g, "").toUpperCase();
  if (!normalized) return false;
  return number.toUpperCase().includes(normalized);
}

interface Entry {
  number: string;
  index: number;
  mine: boolean;
}

interface IndexedWinnerGroup {
  rank: number;
  amount: number;
  entries: Entry[];
}

function withSerialIndices(winners: WinnerGroup[]): IndexedWinnerGroup[] {
  return winners.map((w) => {
    const mineSet = new Set(w.myNumbers ?? []);
    const indexed: Entry[] = w.numbers.map((number, i) => ({ number, index: i + 1, mine: mineSet.has(number) }));
    const mine = indexed.filter((e) => e.mine);
    const others = indexed.filter((e) => !e.mine);
    return { rank: w.rank, amount: w.amount, entries: [...mine, ...others] };
  });
}

const SPOTLIGHT_MAX_ENTRIES = 3;

function splitIntoBalancedColumns(tiers: IndexedWinnerGroup[]): [IndexedWinnerGroup[], IndexedWinnerGroup[]] {
  const byHeightDesc = [...tiers].sort((a, b) => b.entries.length - a.entries.length);
  const columnOf = new Map<number, 0 | 1>();
  let leftTotal = 0;
  let rightTotal = 0;
  for (const tier of byHeightDesc) {
    if (leftTotal <= rightTotal) {
      columnOf.set(tier.rank, 0);
      leftTotal += tier.entries.length;
    } else {
      columnOf.set(tier.rank, 1);
      rightTotal += tier.entries.length;
    }
  }
  return [tiers.filter((t) => columnOf.get(t.rank) === 0), tiers.filter((t) => columnOf.get(t.rank) === 1)];
}

function TicketNumber({
  number,
  size,
  mine,
  matched,
}: {
  number: string;
  size: "sm" | "xl";
  mine?: boolean;
  matched?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {mine && (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
          <TrophyOutlined /> You Won!
        </span>
      )}
      <div
        className={`flex items-center gap-1.5 rounded-lg ${matched ? "ring-2 ring-offset-2 ring-blue-500" : ""} ${
          mine ? "bg-amber-50 p-2" : ""
        }`}
      >
        <DigitTiles digits={number.slice(0, 2).split("")} size={size} variant="letters" />
        <DigitTiles digits={number.slice(2).split("")} size={size} />
      </div>
    </div>
  );
}

function TierRow({ index, number, mine, matched }: { index: number; number: string; mine: boolean; matched: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 ${mine ? "bg-amber-50" : ""} ${matched ? "ring-2 ring-inset ring-blue-500" : ""}`}>
      <span
        className={`w-5 h-5 shrink-0 rounded-full text-white text-[10px] font-medium flex items-center justify-center ${
          mine ? "bg-amber-500" : "bg-slate-700"
        }`}
      >
        {mine ? <TrophyOutlined /> : index}
      </span>
      <TicketNumber number={number} size="sm" />
      {mine && <span className="text-[10px] font-semibold text-amber-600 ml-auto shrink-0">You Won!</span>}
    </div>
  );
}

function TierList({ entries, searchQuery }: { entries: Entry[]; searchQuery?: string }) {
  return (
    <div className="border border-slate-100 rounded-xl divide-y divide-slate-100">
      {entries.map((e) => (
        <TierRow key={e.number} index={e.index} number={e.number} mine={e.mine} matched={isMatch(e.number, searchQuery)} />
      ))}
    </div>
  );
}

function TierPanel({ tier, searchQuery }: { tier: IndexedWinnerGroup; searchQuery?: string }) {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between gap-2 py-2">
        <span className="text-xs font-semibold tracking-wide bg-slate-800 text-white rounded-full px-3 py-1">
          {ordinal(tier.rank)} PRIZE
        </span>
        <span className="text-xs font-medium text-slate-600">
          ₹{tier.amount.toLocaleString("en-IN")} each
        </span>
      </div>
      <TierList entries={tier.entries} searchQuery={searchQuery} />
    </div>
  );
}

export default function SpinResultBody({ winners, searchQuery }: { winners: WinnerGroup[]; searchQuery?: string }) {
  const [hero, ...rest] = withSerialIndices(winners);
  const [leftTiers, rightTiers] = rest.length > 0 ? splitIntoBalancedColumns(rest) : [[], []];

  if (!hero) {
    return (
      <p className="text-sm text-slate-400 text-center py-6">
        This spin was drawn, but no tickets were sold — nobody won.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center border border-slate-100 rounded-xl p-4 sm:p-8 mb-6">
        {hero.entries.length <= SPOTLIGHT_MAX_ENTRIES ? (
          <>
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide bg-violet-600 text-white rounded-full px-4 py-1.5 mb-6">
              <TrophyOutlined /> {ordinal(hero.rank)} PRIZE
            </span>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {hero.entries.map((e) => (
                <TicketNumber key={e.number} number={e.number} size="xl" mine={e.mine} matched={isMatch(e.number, searchQuery)} />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full mb-6">
            <div className="sticky top-0 z-10 bg-white flex justify-center py-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide bg-violet-600 text-white rounded-full px-4 py-1.5">
                <TrophyOutlined /> {ordinal(hero.rank)} PRIZE
              </span>
            </div>
            <TierList entries={hero.entries} searchQuery={searchQuery} />
          </div>
        )}

        <span className="text-xs uppercase tracking-wide text-slate-400 mb-1">Prize Amount</span>
        <span className="text-2xl font-bold text-violet-600">₹{hero.amount.toLocaleString("en-IN")}</span>
      </div>

      {rest.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-6">
            {leftTiers.map((tier) => (
              <TierPanel key={tier.rank} tier={tier} searchQuery={searchQuery} />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {rightTiers.map((tier) => (
              <TierPanel key={tier.rank} tier={tier} searchQuery={searchQuery} />
            ))}
          </div>
        </div>
      )}

      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-8">
        <InfoCircleOutlined /> All results are official and final.
      </p>
    </>
  );
}

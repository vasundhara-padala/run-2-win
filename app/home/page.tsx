"use client";
import { useMemo, useState } from "react";
import { Input } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import SpinResultBody, { type WinnerGroup } from "@/components/SpinResultBody";

/** Static preview data — this build has no backend, no database, and no draw
 * logic. Everything below is hardcoded just to show what the page looks like. */
const NEXT_SPIN_AT = dayjs().add(3, "hour").toISOString();

const SPINS: { spinAt: string; winners: WinnerGroup[] }[] = [
  {
    spinAt: dayjs().subtract(1, "hour").toISOString(),
    winners: [
      { rank: 1, amount: 50000, numbers: ["AB100234"] },
      {
        rank: 2,
        amount: 5000,
        numbers: ["AB100091", "AB100456", "AB100812", "AB100933", "AB101044", "AB101155"],
      },
      {
        rank: 3,
        amount: 1000,
        numbers: [
          "AB100012", "AB100078", "AB100199", "AB100256", "AB100310",
          "AB100377", "AB100420", "AB100488", "AB100562", "AB100609",
        ],
      },
    ],
  },
];

function normalize(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export default function HomePage() {
  const [query, setQuery] = useState("");

  const matchCount = useMemo(() => {
    const normalized = normalize(query);
    if (!normalized) return null;
    return SPINS.reduce(
      (sum, spin) =>
        sum + spin.winners.reduce((s, w) => s + w.numbers.filter((n) => n.toUpperCase().includes(normalized)).length, 0),
      0
    );
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-8">
        <h1 className="text-xl font-semibold text-slate-800 text-center mb-3">Today&apos;s Spin Results</h1>
        <div className="flex items-center justify-center gap-1.5 text-sm text-slate-500 mb-6">
          <SyncOutlined /> Next Spin: {dayjs(NEXT_SPIN_AT).format("DD MMM YYYY, hh:mm A")}
        </div>

        <div className="max-w-sm mx-auto mb-2">
          <Input
            size="large"
            allowClear
            placeholder="Search by ticket number..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {matchCount !== null && (
          <p className="text-center text-xs text-slate-400 mb-6">
            {matchCount === 0 ? `No tickets found matching "${query}".` : `${matchCount} ticket${matchCount === 1 ? "" : "s"} found.`}
          </p>
        )}
        {matchCount === null && <div className="mb-6" />}

        <div className="space-y-10">
          {SPINS.map((spin) => (
            <SpinResultBody key={spin.spinAt} winners={spin.winners} searchQuery={query} />
          ))}
        </div>
      </div>
    </div>
  );
}

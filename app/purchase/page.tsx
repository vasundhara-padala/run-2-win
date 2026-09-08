"use client";
import { useMemo, useState } from "react";
import { App, Button, Spin as AntSpin, Tag } from "antd";
import {
  GiftOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  StarFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import DigitTiles from "@/components/DigitTiles";

/** Static preview data — this build has no backend. "Buy" doesn't call a
 * payment gateway and no purchase is ever recorded; it just shows a notice. */
const NEXT_SPIN_AT = dayjs().add(3, "hour").toISOString();

interface Ticket {
  _id: string;
  tierRank: number;
  number: string;
  price: number;
  amount: number;
  purchaseCount?: number;
  myPurchaseCount?: number;
  purchasedAt?: string;
  isWinner?: boolean;
}

const AVAILABLE_TICKETS: Ticket[] = [
  { _id: "a1", tierRank: 1, number: "AB100234", price: 500, amount: 50000, purchaseCount: 3, myPurchaseCount: 1 },
  { _id: "a2", tierRank: 2, number: "AB100091", price: 100, amount: 5000, purchaseCount: 12 },
  { _id: "a3", tierRank: 2, number: "AB100456", price: 100, amount: 5000, purchaseCount: 5 },
  { _id: "a4", tierRank: 3, number: "AB100012", price: 20, amount: 1000, purchaseCount: 21 },
  { _id: "a5", tierRank: 3, number: "AB100078", price: 20, amount: 1000, purchaseCount: 8 },
  { _id: "a6", tierRank: 3, number: "AB100199", price: 20, amount: 1000, purchaseCount: 0 },
];

const MY_TICKETS: Ticket[] = [
  { _id: "m1", tierRank: 1, number: "AB100234", price: 500, amount: 50000, purchasedAt: dayjs().subtract(2, "hour").toISOString() },
];

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function TicketNumber({ number, size }: { number: string; size: "xs" | "sm" | "md" }) {
  return (
    <div className="flex items-center gap-1 max-w-full overflow-x-auto">
      <DigitTiles digits={number.slice(0, 2).split("")} size={size} variant="letters" />
      <DigitTiles digits={number.slice(2).split("")} size={size} />
    </div>
  );
}

function GridTicketCard({ ticket, mode, onBuy }: { ticket: Ticket; mode: "available" | "mine"; onBuy: () => void }) {
  return (
    <div className="border rounded-xl p-3 flex flex-col items-center gap-3 min-w-0 border-slate-200 bg-white">
      {mode === "mine" && ticket.purchasedAt && (
        <span className="text-[11px] text-slate-400">{dayjs(ticket.purchasedAt).format("DD MMM YYYY, hh:mm A")}</span>
      )}
      <TicketNumber number={ticket.number} size="xs" />
      <div className="flex items-center justify-between w-full gap-2">
        <span className="text-sm text-slate-500">₹{ticket.price.toLocaleString("en-IN")}</span>
        {mode === "mine" ? (
          <Tag color="purple">Your Ticket</Tag>
        ) : (
          <Tag color={(ticket.purchaseCount ?? 0) > 0 ? "blue" : "default"} className="!m-0">
            Bought {ticket.purchaseCount ?? 0}×
          </Tag>
        )}
      </div>
      {mode === "available" && (
        <Button block size="small" type="primary" ghost icon={<ShoppingCartOutlined />} onClick={onBuy}>
          Buy
        </Button>
      )}
    </div>
  );
}

export default function PurchasePage() {
  const { message } = App.useApp();
  const [view, setView] = useState<"available" | "mine">("available");
  const [loading] = useState(false);

  const tickets = view === "mine" ? MY_TICKETS : AVAILABLE_TICKETS;

  const grouped = useMemo(() => {
    const byTier = new Map<number, Ticket[]>();
    for (const t of tickets) {
      if (!byTier.has(t.tierRank)) byTier.set(t.tierRank, []);
      byTier.get(t.tierRank)!.push(t);
    }
    return Array.from(byTier.entries()).sort(([a], [b]) => a - b);
  }, [tickets]);

  function handleBuy() {
    message.info("This is a UI-only — checkout isn't wired up here.");
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-lg">
              <ShoppingCartOutlined />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800 leading-tight">Buy Tickets</h1>
              <p className="text-sm text-slate-400">Choose your lucky ticket and stand a chance to win!</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
            {(["available", "mine"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  view === v ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {v === "available" ? "Available" : "My Tickets"}
              </button>
            ))}
          </div>
        </div>

        {view === "available" && (
          <div className="mb-6 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <InfoCircleOutlined />
              Any number can be bought more than once, by you or anyone else — each purchase is an independent entry.
              Winners are selected from the ticket numbers in this spin&apos;s pool when the spin runs on{" "}
              {dayjs(NEXT_SPIN_AT).format("DD MMM YYYY, hh:mm A")}.
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <AntSpin size="large" />
          </div>
        ) : grouped.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-12">
            {view === "mine" ? "You haven't purchased any tickets yet." : "No tickets available yet."}
          </p>
        ) : (
          <div className="space-y-7">
            {grouped.map(([rank, tierTickets]) => (
              <div key={rank}>
                <div className="sticky top-0 z-10 bg-white flex items-center justify-between flex-wrap gap-2 py-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide bg-violet-600 text-white rounded-full px-3.5 py-1.5">
                    <StarFilled /> {ordinal(rank).toUpperCase()} PRIZE
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    ₹{tierTickets[0].price.toLocaleString("en-IN")} / ticket &bull; wins ₹
                    {tierTickets[0].amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tierTickets.map((t) => (
                    <GridTicketCard key={t._id} ticket={t} mode={view} onBuy={handleBuy} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mt-10 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-base shrink-0">
              <SafetyCertificateOutlined />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">Secure &amp; Safe</div>
              <div className="text-xs text-slate-400">100% secure payments</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-base shrink-0">
              <GiftOutlined />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">Exciting Rewards</div>
              <div className="text-xs text-slate-400">Big prizes, more chances</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-base shrink-0">
              <InfoCircleOutlined />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">How it works?</div>
              <div className="text-xs text-slate-400">Select ticket and click buy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

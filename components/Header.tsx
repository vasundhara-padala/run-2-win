"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Button } from "antd";
import { ShoppingCartOutlined, TrophyOutlined, UserOutlined, WalletOutlined } from "@ant-design/icons";

/** Static, no-auth header for the build — same look as the real app's header,
 * but there's no session/user behind it and nothing here calls an API. */
export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-slate-100 px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
            <TrophyOutlined />
          </div>
          <span className="font-semibold text-slate-800">Run2Win</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {pathname !== "/purchase" && (
          <Link href="/purchase">
            <Button icon={<ShoppingCartOutlined />} className="hidden sm:inline-flex">
              Buy Tickets
            </Button>
          </Link>
        )}
        {pathname !== "/wallet" && (
          <Link href="/wallet">
            <Button icon={<WalletOutlined />} className="hidden sm:inline-flex">
              Wallet
            </Button>
          </Link>
        )}
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <span className="text-sm text-slate-600 hidden sm:inline">Welcome, User</span>
          <Avatar size={32} style={{ backgroundColor: "#7c3aed" }} icon={<UserOutlined />} />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { requirePageAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BookingRequest } from "@/lib/models";
import { Logo } from "@/components/Logo";
import { logout } from "../login/actions";

const NAV = [["/admin/products", "Products"], ["/admin/orders", "Orders"]] as const;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const me = await requirePageAdmin();
  await connectDB();
  const orders = await BookingRequest.countDocuments({});
  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="on-dark bg-char text-cream lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3 p-4 lg:block"><Logo /><p className="mt-3 hidden break-all text-xs text-cream/75 lg:block">{me.email}</p></div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible">
          {NAV.map(([h, l]) => (
            <Link key={h} href={h} className="flex min-h-[44px] shrink-0 items-center justify-between gap-3 rounded-lg px-3 text-sm font-bold hover:bg-cream/10">
              {l}{h === "/admin/orders" && orders ? <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-black text-char" aria-label={`${orders} orders`}>{orders}</span> : null}
            </Link>
          ))}
          <Link href="/" target="_blank" className="flex min-h-[44px] shrink-0 items-center rounded-lg px-3 text-sm font-bold text-gold hover:bg-cream/10">View site</Link>
        </nav>
        <form action={logout} className="px-3 pb-4"><button className="btn-press min-h-[44px] w-full rounded-lg border border-cream/40 text-sm font-bold hover:bg-cream/10">Sign out</button></form>
      </aside>
      <div className="min-w-0 p-4 sm:p-8">{children}</div>
    </div>
  );
}

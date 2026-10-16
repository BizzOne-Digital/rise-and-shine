import { requirePageAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BookingRequest } from "@/lib/models";
import { escapeRegex, PAGE_SIZE, pageOf, plain } from "@/lib/adminData";
import { formatTime12 } from "@/lib/hours";
import { AForm, aBtn, aInput } from "@/components/admin/AdminKit";
import { Pager } from "@/components/admin/Pager";
import { deleteOrder } from "../../actions";

export const metadata = { title: "Orders" };
type Row = { _id: string; name: string; email: string; phone: string; location: string; date: string; time: string; partySize: number; notes: string; createdAt: string };
const LOCATION: Record<string, string> = { "forest-lawn": "Forest Lawn", "the-district": "The District" };

export default async function Orders({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requirePageAdmin();
  const sp = await searchParams;
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (sp.q?.trim()) { const r = new RegExp(escapeRegex(sp.q.trim().slice(0, 60)), "i"); filter.$or = [{ name: r }, { email: r }, { phone: r }]; }
  const page = pageOf(sp.page);
  const [rows, total] = await Promise.all([
    BookingRequest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
    BookingRequest.countDocuments(filter),
  ]);
  const list = plain<Row[]>(rows);
  return (
    <div className="max-w-4xl">
      <h1 className="display-lg text-4xl">Orders</h1>
      <p className="mt-1 text-sm">Table booking requests sent from the website. You can view and delete them.</p>
      <form className="mt-4 flex gap-2">
        <label className="sr-only" htmlFor="q">Search name, email or phone</label>
        <input id="q" name="q" defaultValue={sp.q} placeholder="Search name, email or phone" className={aInput} />
        <button className={`${aBtn} bg-char text-cream`}>Search</button>
      </form>
      {list.length === 0 ? <p className="mt-6 rounded-2xl bg-white p-8 text-center font-bold">No orders yet.</p> : (
        <ul className="mt-4 space-y-3">
          {list.map((o) => (
            <li key={o._id} className="rounded-2xl border-2 border-char bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-extrabold">{o.name}, party of {o.partySize}</p>
                  <p className="text-sm">{LOCATION[o.location] ?? o.location} · {o.date} at {formatTime12(o.time)} (Calgary time)</p>
                </div>
                <p className="text-xs font-bold text-char/70">Received {new Date(o.createdAt).toLocaleString("en-CA", { timeZone: "America/Edmonton" })}</p>
              </div>
              <details className="mt-2"><summary className="min-touch cursor-pointer text-sm font-extrabold text-sun">Details</summary>
                <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  <div><dt className="font-extrabold">Email</dt><dd className="break-all"><a className="underline" href={`mailto:${o.email}`}>{o.email}</a></dd></div>
                  <div><dt className="font-extrabold">Phone</dt><dd><a className="underline" href={`tel:${o.phone}`}>{o.phone}</a></dd></div>
                  <div className="sm:col-span-2"><dt className="font-extrabold">Notes</dt><dd className="whitespace-pre-wrap break-words">{o.notes || "None"}</dd></div>
                </dl>
              </details>
              <div className="mt-3"><AForm action={deleteOrder} submit="Delete order" variant="danger" inline confirm="Delete this order permanently?"><input type="hidden" name="id" value={o._id} /></AForm></div>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page} total={total} size={PAGE_SIZE} base="/admin/orders" params={{ q: sp.q }} />
    </div>
  );
}

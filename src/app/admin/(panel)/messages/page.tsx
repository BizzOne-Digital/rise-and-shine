import { requirePageAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/lib/models";
import { escapeRegex, PAGE_SIZE, pageOf, plain } from "@/lib/adminData";
import { AForm, aBtn, aInput } from "@/components/admin/AdminKit";
import { Pager } from "@/components/admin/Pager";
import { deleteMessage } from "../../actions";

export const metadata = { title: "Messages" };
type Row = { _id: string; firstName: string; lastName: string; email: string; phone: string; message: string; createdAt: string };

export default async function Messages({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requirePageAdmin();
  const sp = await searchParams;
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (sp.q?.trim()) { const r = new RegExp(escapeRegex(sp.q.trim().slice(0, 60)), "i"); filter.$or = [{ firstName: r }, { lastName: r }, { email: r }, { phone: r }, { message: r }]; }
  const page = pageOf(sp.page);
  const [rows, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
    ContactMessage.countDocuments(filter),
  ]);
  const list = plain<Row[]>(rows);
  return (
    <div className="max-w-4xl">
      <h1 className="display-lg text-4xl">Messages</h1>
      <p className="mt-1 text-sm">Messages sent from the Contact us form on the website. Every message is saved here, even if the email to the team did not arrive.</p>
      <form className="mt-4 flex gap-2">
        <label className="sr-only" htmlFor="q">Search messages</label>
        <input id="q" name="q" defaultValue={sp.q} placeholder="Search name, email, phone or message" className={aInput} />
        <button className={`${aBtn} bg-char text-cream`}>Search</button>
      </form>
      {list.length === 0 ? <p className="mt-6 rounded-2xl bg-white p-8 text-center font-bold">No messages yet.</p> : (
        <ul className="mt-4 space-y-3">
          {list.map((m) => (
            <li key={m._id} className="rounded-2xl border-2 border-char bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-extrabold">{m.firstName} {m.lastName}</p>
                <p className="text-xs font-bold text-char/70">Received {new Date(m.createdAt).toLocaleString("en-CA", { timeZone: "America/Edmonton" })}</p>
              </div>
              <p className="mt-1 text-sm"><a className="break-all underline" href={`mailto:${m.email}`}>{m.email}</a>{m.phone ? <> · <a className="underline" href={`tel:${m.phone}`}>{m.phone}</a></> : null}</p>
              <p className="mt-3 whitespace-pre-wrap break-words">{m.message}</p>
              <div className="mt-3"><AForm action={deleteMessage} submit="Delete message" variant="danger" inline confirm="Delete this message permanently?"><input type="hidden" name="id" value={m._id} /></AForm></div>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page} total={total} size={PAGE_SIZE} base="/admin/messages" params={{ q: sp.q }} />
    </div>
  );
}

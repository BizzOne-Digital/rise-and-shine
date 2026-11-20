import { requirePageAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { JobApplication } from "@/lib/models";
import { escapeRegex, PAGE_SIZE, pageOf, plain } from "@/lib/adminData";
import { AForm, aBtn, aInput } from "@/components/admin/AdminKit";
import { Pager } from "@/components/admin/Pager";
import { deleteApplication } from "../../actions";

export const metadata = { title: "Applications" };
type Row = { _id: string; fullName: string; email: string; message: string; resumeName: string; createdAt: string };

export default async function Applications({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requirePageAdmin();
  const sp = await searchParams;
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (sp.q?.trim()) { const r = new RegExp(escapeRegex(sp.q.trim().slice(0, 60)), "i"); filter.$or = [{ fullName: r }, { email: r }, { message: r }]; }
  const page = pageOf(sp.page);
  const [rows, total] = await Promise.all([
    JobApplication.find(filter).select("fullName email message resumeName createdAt").sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
    JobApplication.countDocuments(filter),
  ]);
  const list = plain<Row[]>(rows);
  return (
    <div className="max-w-4xl">
      <h1 className="display-lg text-4xl">Applications</h1>
      <p className="mt-1 text-sm">“Work with us” applications from the Contact us page, with the resume attached. Resumes are personal documents: download only what you need and delete applications you no longer need.</p>
      <form className="mt-4 flex gap-2">
        <label className="sr-only" htmlFor="q">Search applications</label>
        <input id="q" name="q" defaultValue={sp.q} placeholder="Search name, email or message" className={aInput} />
        <button className={`${aBtn} bg-char text-cream`}>Search</button>
      </form>
      {list.length === 0 ? <p className="mt-6 rounded-2xl bg-white p-8 text-center font-bold">No applications yet.</p> : (
        <ul className="mt-4 space-y-3">
          {list.map((a) => (
            <li key={a._id} className="rounded-2xl border-2 border-char bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-extrabold">{a.fullName}</p>
                <p className="text-xs font-bold text-char/70">Received {new Date(a.createdAt).toLocaleString("en-CA", { timeZone: "America/Edmonton" })}</p>
              </div>
              <p className="mt-1 text-sm"><a className="break-all underline" href={`mailto:${a.email}`}>{a.email}</a></p>
              {a.message && <p className="mt-3 whitespace-pre-wrap break-words">{a.message}</p>}
              <p className="mt-3"><a className={`${aBtn} bg-char text-cream`} href={`/api/admin-resume/${a._id}`}>Download resume ({a.resumeName})</a></p>
              <div className="mt-3"><AForm action={deleteApplication} submit="Delete application" variant="danger" inline confirm="Delete this application and its resume permanently?"><input type="hidden" name="id" value={a._id} /></AForm></div>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page} total={total} size={PAGE_SIZE} base="/admin/applications" params={{ q: sp.q }} />
    </div>
  );
}

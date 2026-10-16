import { requirePageAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { MenuCategory, MenuItem } from "@/lib/models";
import { plain } from "@/lib/adminData";
import { formatCAD } from "@/lib/money";
import { ALabel, AForm, Check, aInput } from "@/components/admin/AdminKit";
import { ImageField } from "@/components/admin/ImageField";
import { deleteProduct, saveProduct } from "../../actions";

export const metadata = { title: "Products" };
type C = { _id: string; name: string };
type I = { _id: string; category: string; name: string; description: string; priceCents: number | null; image?: string; signature: boolean; available: boolean; published: boolean };

function Fields({ p, cats, catId }: { p?: I; cats: C[]; catId?: string }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {p && <input type="hidden" name="id" value={p._id} />}
      <ALabel label="Name"><input name="name" defaultValue={p?.name} required maxLength={80} className={aInput} /></ALabel>
      <ALabel label="Category"><select name="category" defaultValue={p?.category ?? catId} required className={aInput}>{cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></ALabel>
      <div className="md:col-span-2"><ALabel label="Description"><textarea name="description" rows={3} defaultValue={p?.description} maxLength={600} className={aInput} /></ALabel></div>
      <ALabel label="Price (CAD)" hint="Leave empty if the price is not confirmed. It will show “Price on request”."><input name="price" inputMode="decimal" defaultValue={p?.priceCents ? (p.priceCents / 100).toFixed(2) : ""} placeholder="e.g. 14.95" className={aInput} /></ALabel>
      <ImageField name="image" folder="products" value={p?.image ?? ""} label="Product image" />
      <div className="flex flex-wrap gap-4 md:col-span-2">
        <Check name="signature" label="Signature dish" defaultChecked={p?.signature} />
        <Check name="available" label="Available" defaultChecked={p?.available ?? true} />
        <Check name="published" label="Show on website" defaultChecked={p?.published ?? true} />
      </div>
    </div>
  );
}

export default async function Products() {
  await requirePageAdmin();
  await connectDB();
  const [cats, items] = await Promise.all([MenuCategory.find().sort({ order: 1 }).lean(), MenuItem.find().sort({ order: 1, name: 1 }).lean()]);
  const C = plain<C[]>(cats), I = plain<I[]>(items);
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="display-lg text-4xl">Products</h1>
      <p className="text-sm">Add, edit or delete menu products. Products without an image show a placeholder picture on the website.</p>
      {C.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center font-bold">No categories found. Run <code>npm run seed</code> first.</p>
      ) : (
        <details className="rounded-2xl border-2 border-char bg-white p-5"><summary className="min-touch cursor-pointer font-extrabold">+ Add a product</summary>
          <AForm action={saveProduct} submit="Add product" className="mt-3" reset><Fields cats={C} /></AForm>
        </details>
      )}
      {C.map((c) => {
        const rows = I.filter((i) => i.category === c._id);
        return (
          <section key={c._id} className="rounded-2xl border-2 border-char bg-white p-4 sm:p-5" aria-labelledby={`c-${c._id}`}>
            <h2 id={`c-${c._id}`} className="display-lg text-2xl">{c.name} <span className="text-sm font-bold">({rows.length})</span></h2>
            {rows.length === 0 && <p className="mt-2 text-sm">No products in this category.</p>}
            <ul className="mt-3 divide-y divide-char/10">
              {rows.map((i) => (
                <li key={i._id} className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <p className="min-w-0 font-extrabold">{i.name}
                      <span className={`ml-2 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-black ${i.priceCents ? "bg-green-200" : "bg-gold"}`}>{formatCAD(i.priceCents) ?? "No price"}</span>
                      {i.signature && <span className="ml-1 rounded-full bg-sun px-2 py-0.5 text-xs font-black text-white">Signature</span>}
                      {!i.available && <span className="ml-1 rounded-full bg-char/20 px-2 py-0.5 text-xs font-black">Unavailable</span>}
                      {!i.published && <span className="ml-1 rounded-full bg-char/20 px-2 py-0.5 text-xs font-black">Hidden</span>}
                    </p>
                  </div>
                  <details className="mt-2"><summary className="min-touch cursor-pointer text-sm font-extrabold text-sun">Edit</summary>
                    <AForm action={saveProduct} submit="Save changes" className="mt-3"><Fields p={i} cats={C} /></AForm>
                    <div className="mt-2 border-t border-char/10 pt-3"><AForm action={deleteProduct} submit="Delete product" variant="danger" inline confirm={`Delete “${i.name}”? This also removes its image and cannot be undone.`}><input type="hidden" name="id" value={i._id} /></AForm></div>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

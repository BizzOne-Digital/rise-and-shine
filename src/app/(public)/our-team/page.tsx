import { IMG } from "@/lib/stockImages";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Pill, PreviewBanner } from "@/components/Bits";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { getTeam } from "@/lib/data";

export const metadata: Metadata = { title: "Our Team", description: "Meet the people behind Rise N’ Shine Breakfast Place." };
export const revalidate = 60;

export default async function Team() {
  const { data: team, source } = await getTeam();
  return (
    <>
      {source === "preview" && <PreviewBanner />}
      <PageHero image={{ src: IMG.chef, alt: "Illustrative image of a cook finishing a breakfast plate" }} eyebrow="Our team" title={<>The people behind the <span className="text-gold">plates.</span></>}>
        <p>The cooks, servers and hosts who make mornings at Rise N’ Shine feel like home.</p>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20 sm:px-6">
        {team.length === 0 ? (
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-[2rem] border-4 border-char bg-white p-10 text-center shadow-[8px_8px_0_#FF4D00]">
              <h2 className="display-lg text-4xl">Introductions coming soon.</h2>
              <p className="mt-3 text-lg">We are putting together profiles of our team. In the meantime, come meet them in person.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3"><Pill href="/contact#locations">Plan your visit</Pill><Pill href="/menu" variant="outline">See the menu</Pill></div>
            </div>
          </Reveal>
        ) : (
          <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <StaggerItem key={m.id} className={i % 3 === 1 ? "lg:mt-12" : ""}>
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-4 border-char bg-gold">
                    {m.imageUrl && <div className="zoom-img h-full w-full"><Image src={m.imageUrl} alt={m.imageAlt} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" /></div>}
                  </div>
                  <h2 className="display-lg mt-4 text-3xl">{m.name}</h2>
                  {m.role && <p className="font-extrabold text-sun">{m.role}</p>}
                  {m.bio && <p className="mt-2 text-lg">{m.bio}</p>}
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </>
  );
}

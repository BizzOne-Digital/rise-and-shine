import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getLocations } from "@/lib/data";

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { data: locations } = await getLocations();
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer locations={locations} />
    </>
  );
}

import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { AppGridContainer } from "@/components/AppGridContainer";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gd-dark flex flex-col">
      <TopBar />
      <Header />
      <AppGridContainer />
      <Footer />
    </div>
  );
}


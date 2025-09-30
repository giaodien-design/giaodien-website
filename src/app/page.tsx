import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { CategoryNavigation } from "@/components/CategoryNavigation"
import { MobileAppGrid } from "@/components/MobileAppGrid"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CategoryNavigation />
      <MobileAppGrid />
      <Footer />
    </div>
  )
}

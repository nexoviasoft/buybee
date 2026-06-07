import Category from "./_components/Category";
import ForYou from "./_components/ForYou";
import HeroCarousel from "./_components/HeroCarousel";
import { Suspense } from "react";
import FlashSale from "./_components/Flash Sale/FlashSale";
import TopProduct from "./_components/Top Products/TopProduct";
import TrendingProducts from "./_components/TrendingProducts";
import ThemeLoader from "../components/shared/ThemeLoader";
import HomePromoModal from "./_components/HomePromoModal";

export default function Home() {
  return (
    <Suspense
      fallback={
        <ThemeLoader
          fullPage
          message="Loading home page, please wait..."
        />
      }
    >
      <main className="space-y-4 md:space-y-6 overflow-hidden">
        <HomePromoModal />
        <HeroCarousel />

        <Category />

        <TrendingProducts />

        <TopProduct />

        <FlashSale />

        <ForYou />

        {/* <FeatureSection /> */}
      </main>
    </Suspense>
  );
}

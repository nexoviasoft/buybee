import { getTrendingProducts, Product } from "../../lib/api-services";
import { API_CONFIG } from "../../lib/api-config";
import TrendingProductsList from "./TrendingProductsList";
import { FiTrendingUp } from "react-icons/fi";

const TrendingProducts = async () => {
  const products: Product[] = await getTrendingProducts(
    30,
    10,
    API_CONFIG.companyId,
  ).catch(() => []);
  const list = products ?? [];

  if (list.length === 0) {
    return null;
  }

  return (
    <section className=" max-w-7xl mx-auto px-5 md:pt-6 pt-3 ">
      <div className="mb-3 sm:mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiTrendingUp size={18} />
            </span>
            <h1 className="sm:text-2xl text-xl font-bold text-gray-900">
              Trending Products
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Popular right now, picked for you.
          </p>
        </div>
      </div>
      <div>
        <TrendingProductsList products={list} />
      </div>
    </section>
  );
};

export default TrendingProducts;

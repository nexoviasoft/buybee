import { getProducts, Product } from "../../lib/api-services";
import Link from "next/link";
import ForYouGrid from "./ForYouGrid";
import { FiShoppingBag } from "react-icons/fi";

const ForYou = async () => {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Failed to load products:", error);
    // products will remain empty array
  }

  if (products.length === 0) {
    return null;
  }

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = product.category?.name || "Others";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    // Limit to 10 products per category for display
    if (acc[categoryName].length < 10) {
      acc[categoryName].push(product);
    }
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <section className="max-w-7xl mx-auto px-5 overflow-hidden md:pt-6 pt-3">
      <div className="mb-6 sm:mb-8 flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiShoppingBag size={18} />
            </span>
            <h1 className="sm:text-2xl text-xl font-bold text-gray-900">
              Our Collection
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Fresh arrivals and customer favorites organized by category.
          </p>
        </div>
      </div>

      {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
        <div key={categoryName} className="mb-10 last:mb-0">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {categoryName}
            </h2>
            <Link
              href={`/products`}
              className="text-primary hover:text-gray-700 text-sm font-medium transition-colors hover:underline underline-offset-4"
            >
              View All
            </Link>
          </div>
          <ForYouGrid products={categoryProducts} />
        </div>
      ))}
    </section>
  );
};

export default ForYou;

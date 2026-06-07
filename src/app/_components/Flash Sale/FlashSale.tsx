import { getFlashSaleProducts, Product } from "../../../lib/api-services";
import CountDown from "./CountDown";
import FlashSaleProduct from "./FlashSaleProduct";
import { IoFlash } from "react-icons/io5";

interface FlashSaleProps {
  isPage?: boolean;
}

const FlashSale = async ({ isPage = false }: FlashSaleProps = {}) => {
  let flashSaleProducts: Product[] = [];

  try {
    flashSaleProducts = await getFlashSaleProducts();
  } catch (error) {
    console.error("Failed to load flash sale products:", error);
    // flashSaleProducts will remain empty array
  }

  // If there are no flash sale products, don't show the section
  if (flashSaleProducts.length === 0) {
    if (isPage) {
      return (
        <section className="max-w-7xl mx-auto px-5 md:pt-6 pt-3 min-h-[50vh] flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              No Flash Sale is running at the moment
            </h2>
            <p className="text-gray-500">
              Stay tuned with us for exciting deals in the next Flash Sale!
            </p>
          </div>
        </section>
      );
    }
    return null;
  }

  // Calculate maximum discount from flash sale products (real % off)
  const maxDiscount =
    flashSaleProducts.length > 0
      ? flashSaleProducts.reduce((max, p) => {
          const discount =
            p.flashSellPrice && p.price
              ? Math.round(((p.price - p.flashSellPrice) / p.price) * 100)
              : 0;
          return discount > max ? discount : max;
        }, 0)
      : 0;

  // Find the nearest flash sell end time to show in countdown
  const now = Date.now();
  const validEndTimes = flashSaleProducts
    .map((p) =>
      p.flashSellEndTime ? new Date(p.flashSellEndTime).getTime() : null,
    )
    .filter((t): t is number => !!t && t > now);

  const nearestEndTime = validEndTimes.length
    ? Math.min(...validEndTimes)
    : null;

  const initialSecondsLeft =
    nearestEndTime && nearestEndTime > now
      ? Math.max(0, Math.floor((nearestEndTime - now) / 1000))
      : 0;

  return (
    <section className=" max-w-7xl mx-auto px-5 md:pt-6 pt-3 ">
      {isPage ? (
        <>
          <div className="overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-white/10 shadow-xl rounded-2xl sm:rounded-3xl relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/25 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

            <div className="relative z-10 sm:p-8 p-5">
              <div className="flex items-center justify-between gap-6 flex-col sm:flex-row">
                <div className="w-full sm:flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      LIVE
                    </span>
                    <p className="text-[11px] font-semibold tracking-wide text-white/70">
                      Limited time offer
                    </p>
                  </div>
                  <div className="mt-1 h-0.5 w-28 bg-primary rounded-full" />

                  <h2 className="mt-4 text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Flash Sale
                  </h2>
                  <div className="mt-2 h-0.5 w-36 bg-primary rounded-full" />

                  <p className="mt-3 text-sm sm:text-base font-semibold text-white/80">
                    {`Up to ${maxDiscount}% off · ${flashSaleProducts.length} products`}
                  </p>
                  <p className="mt-4 text-xs sm:text-sm text-white/60">
                    Check the timer and order before the deal ends.
                  </p>
                </div>

                <div className="w-full sm:w-auto">
                  <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur px-5 py-4 shadow-lg">
                    <p className="text-xs font-semibold text-white/70 mb-3">
                      Ends in
                    </p>
                    <CountDown initialSecondsLeft={initialSecondsLeft} variant="dark" />
                    <a
                      href="#flash-sale-products"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white text-gray-900 text-sm font-bold px-4 py-2.5 hover:bg-white/90 transition-colors"
                    >
                      View all products
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="flash-sale-products" className="mt-6">
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IoFlash size={18} />
                </span>
                <h3 className="sm:text-2xl text-xl font-bold text-gray-900">
                  Today’s Deals
                </h3>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Limited-time offers—order while stock lasts.
              </p>
            </div>
            <FlashSaleProduct />
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start gap-4 flex-row">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IoFlash size={18} />
                </span>
                <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
                  LIVE
                </span>
                <h2 className="sm:text-3xl text-xl font-black text-gray-900 tracking-tight whitespace-nowrap">
                  Flash Sale
                </h2>
              </div>
              <p className="sm:text-sm text-xs text-gray-500 mt-1 font-medium">
                {`Enjoy Flash Sale Deals up to ${maxDiscount}%!`}
              </p>
            </div>
            <div className="shrink-0">
              <CountDown initialSecondsLeft={initialSecondsLeft} variant="light" />
            </div>
          </div>
          <div className="mt-4">
            <FlashSaleProduct />
          </div>
        </>
      )}
    </section>
  );
};

export default FlashSale;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IoFlash } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { API_CONFIG } from "../../lib/api-config";
import {
  getCategories,
  getFlashSaleProducts,
  getSystemUserByCompanyId,
  type Product,
} from "../../lib/api-services";
import CountDown from "./Flash Sale/CountDown";

type ModalMode = "loading" | "flash" | "welcome" | "hidden";

const toNumber = (value: unknown): number => {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? n : 0;
};

const getBestImage = (product: Product): string | null => {
  if (typeof product.thumbnail === "string" && product.thumbnail.trim()) return product.thumbnail;
  const first = product.images?.[0]?.url;
  if (typeof first === "string" && first.trim()) return first;
  return null;
};

const calcMaxDiscount = (products: Product[]): number => {
  return products.reduce((max, p) => {
    const price = toNumber((p as any).price);
    const flash = toNumber((p as any).flashSellPrice);
    const discount = price > 0 && flash > 0 && flash < price ? Math.round(((price - flash) / price) * 100) : 0;
    return discount > max ? discount : max;
  }, 0);
};

const calcSecondsLeft = (products: Product[]): number => {
  const now = Date.now();
  const endTimes = products
    .map((p) => {
      const raw = (p as any).flashSellEndTime;
      if (!raw) return null;
      const t = new Date(raw as any).getTime();
      return Number.isFinite(t) ? t : null;
    })
    .filter((t): t is number => typeof t === "number" && t > now);

  if (endTimes.length === 0) return 0;
  const nearest = Math.min(...endTimes);
  return Math.max(0, Math.floor((nearest - now) / 1000));
};

const resolveAssetUrl = (raw?: string | null): string | null => {
  if (!raw || typeof raw !== "string" || !raw.trim()) return null;
  const url = raw.trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${API_CONFIG.baseURL.replace(/\/$/, "")}${normalized}`;
};

export default function HomePromoModal() {
  const [mode, setMode] = useState<ModalMode>("loading");
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>("Welcome");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const list = await getFlashSaleProducts(API_CONFIG.companyId).catch(() => []);
        if (cancelled) return;

        if (Array.isArray(list) && list.length > 0) {
          setProducts(list);
          setMode("flash");
          setOpen(true);
          return;
        }

        const [user, categories] = await Promise.all([
          getSystemUserByCompanyId(API_CONFIG.companyId).catch(() => null),
          getCategories(API_CONFIG.companyId).catch(() => []),
        ]);
        if (cancelled) return;
        setCompanyName(user?.companyName || "Welcome");
        setCompanyLogo(resolveAssetUrl(user?.companyLogo ?? null));
        const names = Array.isArray(categories)
          ? categories
              .map((c) => (c as any)?.name)
              .filter((n): n is string => typeof n === "string" && !!n.trim())
              .map((n) => n.trim())
          : [];
        setCategoryNames(names);
        setMode("welcome");
        setOpen(true);
      } catch {
        if (cancelled) return;
        setCompanyName("Welcome");
        setCompanyLogo(null);
        setCategoryNames([]);
        setMode("welcome");
        setOpen(true);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const featured = useMemo(() => {
    if (!products.length) return null;
    const withImg = products.find((p) => !!getBestImage(p));
    return withImg || products[0] || null;
  }, [products]);

  const maxDiscount = useMemo(() => calcMaxDiscount(products), [products]);
  const secondsLeft = useMemo(() => calcSecondsLeft(products), [products]);
  const categoryPreviewText = useMemo(() => {
    if (!categoryNames.length) return "Explore our collection of products and find your favorites today.";
    const unique = Array.from(new Set(categoryNames));
    const top = unique.slice(0, 8);
    const hasMore = unique.length > top.length;
    const list = top.join(", ");
    return `We currently offer products across ${unique.length} categories, including ${list}${hasMore ? ", and more" : ""}.`;
  }, [categoryNames]);

  const close = () => {
    setOpen(false);
  };

  if (!open || mode === "hidden") return null;

  const headerGradient =
    "bg-gradient-to-r from-primary via-primaryDark to-black";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className={`relative ${headerGradient} px-5 sm:px-6 py-5 sm:py-6`}>
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg ring-1 ring-black/10 hover:bg-white transition-colors"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>

          {mode === "flash" ? (
            <div className="flex items-start justify-between gap-5 flex-col sm:flex-row">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white">
                    <IoFlash className="text-white" />
                    LIVE
                  </span>
                  <span className="text-[11px] font-semibold tracking-wide text-white/80">
                    Limited time offer
                  </span>
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Flash Sale
                </h2>
                <p className="mt-1 text-sm text-white/85 font-semibold">
                  {`Up to ${maxDiscount}% off · ${products.length} products`}
                </p>
                <p className="mt-3 text-xs sm:text-sm text-white/70 max-w-xl">
                  Shop fast—these deals end soon.
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur px-5 py-4 shadow-lg">
                  <p className="text-xs font-semibold text-white/75 mb-3">
                    Ends in
                  </p>
                  <CountDown initialSecondsLeft={secondsLeft} variant="dark" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-5 flex-col sm:flex-row">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white">
                    <IoFlash className="text-white" />
                    HELLO
                  </span>
                  {companyLogo ? (
                    <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/25">
                      <Image
                        src={companyLogo}
                        alt={`${companyName} logo`}
                        fill
                        sizes="36px"
                        className="object-contain p-1.5"
                      />
                    </div>
                  ) : null}
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {`Welcome to ${companyName}`}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-white/75 max-w-xl">
                  {categoryPreviewText}
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <Link
                  href="/products"
                  onClick={close}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white text-gray-900 text-sm font-bold px-4 py-2.5 hover:bg-white/90 transition-colors"
                >
                  Start shopping
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 sm:px-6 py-5">
          {mode === "flash" && featured ? (
            <div className="flex items-start gap-4 flex-col sm:flex-row">
              <div className="w-full sm:w-56">
                <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 aspect-[4/3]">
                  {getBestImage(featured) && (
                    <Image
                      src={getBestImage(featured) as string}
                      alt={featured.name || "Flash sale product"}
                      fill
                      sizes="(max-width: 640px) 100vw, 224px"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-500">
                  Featured deal
                </p>
                <h3 className="mt-1 text-base sm:text-lg font-bold text-gray-900 line-clamp-2">
                  {featured.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  Limited stock available for this offer.
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-gray-900">
                      ৳ {toNumber((featured as any).flashSellPrice || (featured as any).discountPrice || featured.price)}
                    </span>
                    {toNumber((featured as any).price) > 0 &&
                      toNumber((featured as any).flashSellPrice) > 0 &&
                      toNumber((featured as any).flashSellPrice) < toNumber((featured as any).price) && (
                        <span className="text-sm text-gray-500 line-through">
                          ৳ {toNumber((featured as any).price)}
                        </span>
                      )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/flashSell/${encodeURIComponent(featured.sku || String(featured.id))}`}
                      onClick={close}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      View product
                    </Link>
                    <Link
                      href="/flashSell"
                      onClick={close}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primaryDark transition-colors"
                    >
                      View all deals
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Explore the store
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Browse products and find your favorites today.
                </p>
              </div>
              <Link
                href="/"
                onClick={close}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Continue
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

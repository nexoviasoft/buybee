"use client";

import PaymentGateway from "../../public/images/payment-gateway.webp";
import { useAuth } from "../context/AuthContext";
import { API_CONFIG } from "../lib/api-config";
import { getCategories, getSystemUserByCompanyId } from "../lib/api-services";
import { Category } from "../types/category";
import { SystemUser } from "../types/system-user";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  const { userSession } = useAuth();
  const [companyInfo, setCompanyInfo] = useState<SystemUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  // const [imageLoaded, setImageLoaded] = useState(false);

  const companyId = useMemo(
    () => userSession?.companyId || API_CONFIG.companyId,
    [userSession?.companyId],
  );

  useEffect(() => {
    let mounted = true;
    const loadCompanyInfo = async () => {
      if (!companyId) {
        if (mounted) setIsCompanyLoading(false);
        return;
      }

      if (mounted) {
        setIsCompanyLoading(true);
        setCompanyInfo(null);
      }

      try {
        const data = await getSystemUserByCompanyId(companyId);
        if (mounted) {
          setCompanyInfo(data ?? null);
        }
      } finally {
        if (mounted) setIsCompanyLoading(false);
      }
    };
    loadCompanyInfo();
    return () => {
      mounted = false;
    };
  }, [companyId]);

  useEffect(() => {
    let mounted = true;
    const loadCategories = async () => {
      if (!companyId) {
        if (mounted) setIsCategoriesLoading(false);
        return;
      }

      if (mounted) {
        setIsCategoriesLoading(true);
        setCategories([]);
      }

      try {
        const data = await getCategories(companyId);
        if (mounted && Array.isArray(data) && data.length) {
          setCategories(data);
        }
      } finally {
        if (mounted) setIsCategoriesLoading(false);
      }
    };
    loadCategories();
    return () => {
      mounted = false;
    };
  }, [companyId]);

  const companyName = companyInfo?.companyName || "";
  const branchLocation = companyInfo?.branchLocation || "।";
  const phone = companyInfo?.phone || "";
  const email = companyInfo?.email || "";
  // const logoSrc = companyInfo?.companyLogo;
  const fallbackCategories = [
    { name: "Wallboard", slug: "wallboard" },
    { name: "Canvas Print", slug: "canvas-print" },
    { name: "Dua Card", slug: "dua-card" },
    { name: "Dawah Canvas", slug: "dawah-canvas" },
    { name: "Wall Hanging", slug: "wall-hanging" },
    { name: "Event Board", slug: "event-board" },
    { name: "Promo Items", slug: "promo-items" },
    { name: "Gift Items", slug: "gift-items" },
    { name: "Accessories", slug: "accessories" },
    { name: "Custom Products", slug: "custom-products" },
  ];
  const isLoading = isCompanyLoading || isCategoriesLoading;
  const visibleCategories = categories.length ? categories : fallbackCategories;

  if (isLoading) {
    return (
      <footer className=" bg-black">
        <div className=" max-w-7xl mx-auto py-16 px-5 flex items-center justify-center">
          <div
            className="w-7 h-7 border-2 border-gray-500/30 border-t-white rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          />
        </div>
      </footer>
    );
  }

  return (
    <footer className=" bg-black mt-10">
      <div className=" max-w-7xl mx-auto py-16 px-5 flex min-[910px]:flex-row flex-col gap-5">
        <div className=" flex flex-col gap-3 min-[910px]:flex-[0_0_30%] ">
          {/* <Link href="/">
            <div className="relative min-w-[80px] min-h-[60px] flex items-center justify-center">
              {(!companyInfo || (logoSrc && !imageLoaded)) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-500/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              {logoSrc && (
                <Image
                  src={logoSrc}
                  alt="logo"
                  width={80}
                  height={60}
                  unoptimized
                  className={`transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
            </div>
          </Link> */}

          <p className=" text-[#ffffffe6]">
            <strong>{companyName}</strong>– Reliable e-commerce for your lifestyle. We provide quality lifestyle products, fast delivery, and guaranteed satisfaction.
          </p>
          <p className=" text-[#ffffffe6]">{branchLocation}</p>
          <p className=" text-[#ffffffe6]">{phone}</p>
          <div className=" flex gap-2 text-white">
            <Link
              href={`mailto:${email}`}
              className=" border border-gray-500 rounded-full p-2 text-lg hover:border-white hover:text-white transition-all duration-200 ease-linear cursor-pointer"
            >
              <MdOutlineEmail />
            </Link>
            <Link
              href="https://www.facebook.com/people/Aims-Purified/61578248000957/?rdid=XIrNNlnUpnPPFq0q"
              target="_blank"
              rel="noopener noreferrer"
              className=" border border-gray-500 rounded-full p-2 text-lg hover:border-white hover:text-white transition-all duration-200 ease-linear cursor-pointer"
            >
              <FaFacebookF />
            </Link>
          </div>
        </div>
        <div className=" grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] w-full gap-2">
          <div className="flex flex-col gap-8 ">
            <h2 className=" text-white font-medium text-lg">Categories</h2>
            <ul className=" text-[#ffffffe6] flex flex-col gap-1">
              {visibleCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="  transition-all ease-linear duration-150"
                >
                  {category.name}
                </Link>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-8 ">
            <h2 className=" text-white font-medium text-lg">Useful Links</h2>
            <ul className=" text-[#ffffffe6] flex flex-col gap-1">
              <Link
                href="/"
                className="  transition-all ease-linear duration-150"
              >
                Home
              </Link>
              <Link
                href="/"
                className="  transition-all ease-linear duration-150"
              >
                Collections
              </Link>
              {/* <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                Blog
              </Link> */}
              <Link
                href="/"
                className="  transition-all ease-linear duration-150"
              >
                Offers
              </Link>
              <Link
                href="/"
                className="  transition-all ease-linear duration-150"
              >
                Search
              </Link>
            </ul>
          </div>
          <div className="flex flex-col gap-8 ">
            <h2 className=" text-white font-medium text-lg">Help Center</h2>
            <ul className=" text-[#ffffffe6] flex flex-col gap-1">
              <Link
                href="/my-account/dashboard"
                className="  transition-all ease-linear duration-150"
              >
                My Account
              </Link>
              <Link
                href="/my-account/orders"
                className="  transition-all ease-linear duration-150"
              >
                My Orders
              </Link>
              {/* <Link
                href="/view-cart"
                className="  transition-all ease-linear duration-150"
              >
                Wishlist
              </Link> */}
              {/* <Link
                href="/contact-us"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                FAQs
              </Link> */}
              <Link
                href="/contact-us"
                className="  transition-all ease-linear duration-150"
              >
                Contact Us
              </Link>
            </ul>
          </div>
          <div className="flex flex-col gap-8 ">
            <h2 className=" text-white font-medium text-lg">
              Legal Information
            </h2>
            <ul className=" text-[#ffffffe6] flex flex-col gap-1">
              <Link
                href="/terms"
                className="  transition-all ease-linear duration-150"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="  transition-all ease-linear duration-150"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund-and-return-policy"
                className="  transition-all ease-linear duration-150"
              >
                Refund & Return Policy
              </Link>
              {/* <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                Warranty Services
              </Link>
              <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                {" "}
                Shipping Method
              </Link>
              <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                Payment Method
              </Link> */}
            </ul>
          </div>
        </div>
      </div>
      <div className=" border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-5 sm:py-4 py-3 flex items-center justify-between gap-2 min-[700px]:flex-row flex-col">
          <div className="flex flex-col gap-1 min-[700px]:items-start items-center">
            <p className="text-[#ffffffe6] text-[15px]">
              Copyright © {new Date().getFullYear()} {companyName} All Rights Reserved
            </p>
            <p className="text-[#ffffffe6] text-[15px]">
              Developed by{" "}
              <Link
                href="https://www.nexoviasoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white underline transition-colors duration-200"
              >
                NexoviaSoft
              </Link>
            </p>
          </div>
          <div>
            <Image
              src={PaymentGateway}
              alt="PaymentGateway"
              width={450}
              height={100}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

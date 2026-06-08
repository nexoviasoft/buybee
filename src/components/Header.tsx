"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaRegUser, FaXmark } from "react-icons/fa6";
import { IoLogInOutline } from "react-icons/io5";
import { cn } from "../utils/cn";
import ProfileDropDown from "./drop down/PrfofileDropDown";
import CartDrawer from "./shopping cart/CartDrawer";
import { useAuth } from "../context/AuthContext";
import { Button, Modal } from "antd";
import { API_CONFIG } from "../lib/api-config";
import { getSystemUserByCompanyId, getProducts, type Product } from "../lib/api-services";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

const Header = () => {
  const { userSession, logout, loading: authLoading } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  const isAuthenticated = Boolean(userSession?.accessToken);

  const companyId = useMemo(
    () => userSession?.companyId || API_CONFIG.companyId,
    [userSession?.companyId],
  );

  useEffect(() => {
    setImageLoaded(false);
  }, [logoSrc]);

  useEffect(() => {
    let mounted = true;
    const loadLogo = async () => {
      if (!companyId) return;
      try {
        const user = await getSystemUserByCompanyId(companyId);
        if (mounted && user?.companyLogo) {
          setLogoSrc(user.companyLogo);
        }
      } catch (error) {
        console.error("Failed to load company logo for header:", error);
      } finally {
        if (mounted) setIsLogoLoading(false);
      }
    };
    loadLogo();
    return () => {
      mounted = false;
    };
  }, [companyId]);

  // Fetch products for live search
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (mounted) setAllProducts(data);
      } catch (err) {
        console.error("Failed to load products for search", err);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter products on search term change
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchTerm, allProducts]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const query = searchTerm.trim();
    if (!query) return;
    const params = new URLSearchParams();
    params.set("search", query);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <nav className=" bg-white shadow backdrop-blur sticky top-0 z-40 border-b border-gray-200">
      <div className=" max-w-7xl px-5 mx-auto flex items-center justify-between gap-5 py-2">
        <Link href="/" className=" cursor-pointer">
          <div className="relative min-w-[80px] min-h-[40px] flex items-center justify-center">
            {(isLogoLoading || (logoSrc && !imageLoaded)) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
              </div>
            )}
            {logoSrc && (
              <Image
                src={logoSrc}
                alt="logo"
                width={80}
                height={40}
                unoptimized
                className={`transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                onLoad={() => setImageLoaded(true)}
              />
            )}
          </div>
        </Link>

        {/* search by category and products name  */}

        <div ref={searchRef} className="flex-1 min-w-0 max-w-xl relative">
          <div className="rounded-full border-[.1rem] border-primary flex items-center pr-1 sm:pr-2 pl-2 bg-white">
            <span className=" text-lg">
              <CiSearch />
            </span>
            <input
              type="text"
              id="Search"
              placeholder="Search for..."
              className="w-full border-none outline-none bg-transparent  sm:py-2.5 py-1.5  pl-3 sm:text-sm text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchTerm.trim().length > 0) setIsSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                  setIsSearchOpen(false);
                }
              }}
            />
            <span
              onClick={() => {
                handleSearch();
                setIsSearchOpen(false);
              }}
              className=" bg-primary text-white sm:px-3 px-2 sm:py-1 py-[2px] sm:text-base text-sm rounded-full cursor-pointer"
            >
              Search
            </span>
          </div>

          {/* Search Dropdown Modal */}
          {isSearchOpen && (
            <div className="absolute top-[110%] left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[400px] overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                <div className="p-2 flex flex-col gap-1">
                  {searchResults.slice(0, 10).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                        {(product.thumbnail || product.images?.[0]?.url) ? (
                          <Image
                            src={product.thumbnail || product.images![0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm font-bold text-primary">৳{product.discountPrice ?? product.price}</p>
                      </div>
                    </Link>
                  ))}
                  {searchResults.length > 10 && (
                    <button
                      onClick={() => {
                        handleSearch();
                        setIsSearchOpen(false);
                      }}
                      className="text-sm text-center py-2 w-full text-primary font-medium hover:bg-gray-50 rounded-lg"
                    >
                      View all {searchResults.length} results
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No products found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex  gap-5 items-center">
          <div className="min-[950px]:flex hidden">
            <ul className=" flex gap-2">
              <Link
                href="/"
                className=" text-md font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                Home
              </Link>
              <Link
                href="/products"
                className=" text-md font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                Shop
              </Link>
              <Link
                href="/flashSell"
                className=" text-md font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                Flash Sale
              </Link>
              <Link
                href="/contact-us"
                className=" text-md font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                Contact
              </Link>
              <Link
                href="/order-tracking"
                className=" text-md font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                Order Tracking
              </Link>
            </ul>
          </div>
          <div className=" flex gap-4 items-center  ">
            <div className="">
              <CartDrawer />
            </div>

            <div className="md:block hidden">
              {authLoading ? (
                <div className="h-9 w-20  rounded-[40px] border border-gray-200 bg-gray-50" />
              ) : isAuthenticated ? (
                <ProfileDropDown />
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 ease-linear"
                  >
                    <IoLogInOutline size={18} />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primaryDark transition-colors duration-200 ease-linear"
                  >
                    <FaRegUser size={16} />
                    Register
                  </Link>
                </div>
              )}
            </div>

            <div
              onClick={() => setToggle(!toggle)}
              className="
    py-2 pl-2 
    lg:hidden
    md:block
    hidden       
    text-2xl 
    cursor-pointer
  "
            >
              {toggle ? <FaXmark /> : <FaBars />}
            </div>
          </div>
        </div>
      </div>
      {/* small device menu bar  */}

      <div
        className={`bg-white shadow-md absolute backdrop-blur-xl 
          min-[950px]:hidden block  transition-all ease-linear duration-200 border-r border-gray-200 ${cn(
          toggle ? "left-0" : "-left-80",
          toggle && "right-0",
        )}`}
      >
        <ul className=" flex flex-col bg gap-2">
          <Link
            onClick={() => setToggle(!toggle)}
            href="/"
            className=" text-lg font-medium px-5 py-2 hover:text-primary tran95ion-all ease-linear duration-200  hover:bg-primary/5"
          >
            Home
          </Link>

          <Link
            onClick={() => setToggle(!toggle)}
            href="/products"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200 hover:bg-primary/5"
          >
            Shop
          </Link>
          <Link
            onClick={() => setToggle(!toggle)}
            href="/flashSell"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200 hover:bg-primary/5"
          >
            Flash Sale
          </Link>
          <Link
            onClick={() => setToggle(!toggle)}
            href="/contact-us"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200 hover:bg-primary/5"
          >
            Contact
          </Link>
          <Link
            onClick={() => setToggle(!toggle)}
            href="/order-tracking"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200 hover:bg-primary/5"
          >
            Order Tracking
          </Link>

          {!authLoading && !isAuthenticated && (
            <div className="mt-auto  border-t border-gray-100/70 pt-7 pb-10 px-5 sm:px-6 space-y-4">
              <Link
                onClick={() => setToggle(false)}
                href="/login"
                className={`
        flex items-center justify-center gap-3.5
        w-full py-2.5 px-5
        bg-white text-gray-800 font-medium text-base
        rounded-2xl border border-gray-200/80
        shadow-[0_4px_15px_rgba(0,0,0,0.08)]
        hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)]
        hover:border-gray-300 hover:text-primary
        active:scale-[0.98]
        transition-all duration-300
      `}
              >
                <FiLogIn className="text-2xl text-gray-700" />
                <span>Login</span>
              </Link>

              <Link
                onClick={() => setToggle(false)}
                href="/register"
                className={`
        flex items-center justify-center gap-3.5
        w-full py-2.5 px-5
        bg-primary text-white font-medium text-base
        rounded-2xl
        shadow-[0_6px_20px_rgba(var(--primary-rgb),0.25)]
        hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.35)]
        hover:bg-primary/95
        active:scale-[0.98]
        transition-all duration-300
      `}
              >
                <FiUserPlus className="text-2xl" />
                <span>Register</span>
              </Link>

              <p className="text-center text-xs text-gray-500 mt-2">
                No account? Register now • Fast & Easy
              </p>
            </div>
          )}
          {isAuthenticated && (
            <div className="px-5 py-2">
              <ProfileDropDown onMenuAction={() => setToggle(false)} />
            </div>
          )}
        </ul>
      </div>

      <Modal
        title="Logout"
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setLogoutModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={() => {
              logout();
              setLogoutModalOpen(false);
            }}
          >
            Yes, Logout
          </Button>,
        ]}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </nav>
  );
};

export default Header;

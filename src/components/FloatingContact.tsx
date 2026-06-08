import Link from "next/link";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

export default function FloatingContact() {
  const whatsappNumber = "+8801942142346";
  const messengerId = "61590682648816";

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      <Link
        href={`https://m.me/${messengerId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#0084FF] text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 relative group"
        aria-label="Contact on Messenger"
      >
        <FaFacebookMessenger />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat on Messenger
        </span>
      </Link>
      <Link
        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 relative group"
        aria-label="Contact on WhatsApp"
      >
        <FaWhatsapp />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat on WhatsApp
        </span>
      </Link>
    </div>
  );
}

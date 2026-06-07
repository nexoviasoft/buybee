"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../../utils/cn";
import { menuItems } from "./side_bar/Menu";
import { useAuth } from "../../../context/AuthContext";
import { MdLogout } from "react-icons/md";
import { Button, Modal } from "antd";

const MobileTabs = () => {
  const path = usePathname().split("/").pop();
  const { logout } = useAuth();
  const router = useRouter();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    setLogoutModalOpen(false);
    router.push("/");
  };

  return (
    <nav className="md:hidden sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 -mx-5 px-5 py-3 mb-6">
      <div className="grid grid-cols-3 gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={`/my-account/${item.link}`}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 text-center h-full",
              path === item.link
                ? "bg-primary text-white shadow-md"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
            )}
          >
            <span className="text-xl">
              {item.icon}
            </span>
            <span className="truncate w-full">{item.name}</span>
          </Link>
        ))}
        
        <button
          type="button"
          onClick={() => setLogoutModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100 h-full"
        >
          <MdLogout size={20} />
          <span>Logout</span>
        </button>
      </div>

      <Modal
        title="Logout"
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        centered
        footer={[
          <Button key="cancel" onClick={() => setLogoutModalOpen(false)} className="rounded-full">
            Cancel
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            danger 
            onClick={handleConfirmLogout}
            className="rounded-full bg-red-600"
          >
            Yes, Logout
          </Button>,
        ]}
      >
        <p className="py-4 text-gray-600">Are you sure you want to logout from your account?</p>
      </Modal>
    </nav>
  );
};

export default MobileTabs;


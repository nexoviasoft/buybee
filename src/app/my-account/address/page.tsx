"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getApiUrl, getApiHeaders } from "../../../lib/api-config";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiMapPin, FiPhone } from "react-icons/fi";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  district?: string;
}

export default function Address() {
  const { userSession } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    district: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(getApiUrl("/users/me"), {
        headers: getApiHeaders(userSession?.accessToken),
      });
      const userData = response.data.data;
      setProfile(userData);
      setFormData({
        address: userData.address || "",
        district: userData.district || "",
        phone: userData.phone || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [userSession?.accessToken]);

  useEffect(() => {
    if (userSession?.accessToken) {
      fetchProfile();
    }
  }, [userSession, fetchProfile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await axios.patch(getApiUrl("/users/me"), formData, {
        headers: getApiHeaders(userSession?.accessToken),
      });
      setProfile(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        address: profile.address || "",
        district: profile.district || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <section className="w-full flex justify-center items-center min-h-[320px]">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-1 border border-gray-100">
            <span className="h-2 w-2 rounded-full bg-gray-500 animate-pulse" />
            <span className="text-[11px] font-medium text-gray-700">
              Loading your address
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Loading your saved delivery address, please wait.
          </p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="w-full flex justify-center items-center min-h-[320px]">
        <div className="max-w-md w-full text-center space-y-3 rounded-2xl border border-gray-200 bg-gray-50/70 px-6 py-6">
          <p className="text-sm font-semibold text-gray-700">
            Failed to load address
          </p>
          <p className="text-xs md:text-sm text-gray-600">
            Please refresh the page or try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="rounded-2xl bg-primary text-white shadow-md px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-100/90">
              My Account
            </p>
            <h2 className="text-xl md:text-2xl font-semibold">Saved Address</h2>
            <p className="text-xs sm:text-sm text-gray-50/95 max-w-md">
              Update your preferred delivery address for faster orders.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs sm:text-sm">
            <FiMapPin className="text-gray-100" />
            <span>Default Delivery Location</span>
          </div>
        </div>
      </div>

      <div className="bg-white/95 rounded-2xl shadow-sm border border-gray-50 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center">
              <FiMapPin size={18} />
            </span>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Default Address
              </h3>
              <p className="text-xs text-gray-500">
                Your orders will be delivered to this address.
              </p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <FaEdit className="text-[11px]" />
              Edit Address
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                <FaSave className="text-[11px]" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                <FaTimes className="text-[11px]" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2">
                  <FiPhone className="text-gray-400" size={16} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">
                  District
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2">
                  <FiMapPin className="text-gray-400" size={16} />
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    placeholder="Enter district"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Full Address
              </label>
              <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2">
                <FiMapPin className="mt-0.5 text-gray-400" size={16} />
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter full address"
                  rows={3}
                  className="w-full bg-transparent text-sm outline-none resize-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-8 w-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center">
                <FiPhone size={16} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Phone Number
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {profile.phone || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-8 w-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center">
                <FiMapPin size={16} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  District
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {profile.district || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-8 w-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center">
                <FiMapPin size={16} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Full Address
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {profile.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

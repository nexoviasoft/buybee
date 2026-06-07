"use client";

import { IoCartOutline } from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";

interface CustomerInfoProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  district?: string;
  setDistrict?: (v: string) => void;
  upazila?: string;
  setUpazila?: (v: string) => void;
  deliveryType?: "inside" | "outside" | "";
  setDeliveryType?: (v: "inside" | "outside" | "") => void;
  paymentMethod?: "cod" | "prepaid";
  setPaymentMethod?: (v: "cod" | "prepaid") => void;
  onSubmit: () => void;
  submitting?: boolean;
}

const CustomerInfo = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  district,
  setDistrict,
  upazila,
  setUpazila,
  deliveryType,
  setDeliveryType,
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  submitting,
}: CustomerInfoProps) => {
  const [enZilaData, setEnZilaData] = useState<
    Array<{ id: number; district: string; upazilas: string[] }>
  >([]);
  const [bnZilaData, setBnZilaData] = useState<
    Array<{ id: number; district: string; upazilas: string[] }>
  >([]);
  const [zilaLoading, setZilaLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setZilaLoading(true);

        const normalize = (
          json: unknown,
        ): Array<{ id: number; district: string; upazilas: string[] }> => {
          const obj = (json || {}) as any;
          const list: Array<Record<string, unknown>> = Array.isArray(
            obj?.districts,
          )
            ? (obj.districts as Array<Record<string, unknown>>)
            : Array.isArray(obj?.["জেলা_সমূহ"])
              ? (obj["জেলা_সমূহ"] as Array<Record<string, unknown>>)
              : [];

          return list
            .map((d, idx) => {
              const idRaw = (d as any)?.id;
              const idNum = typeof idRaw === "number" ? idRaw : Number(idRaw);
              const id =
                Number.isFinite(idNum) && idNum > 0
                  ? Math.floor(idNum)
                  : idx + 1;

              const districtName =
                typeof (d as any)?.name === "string"
                  ? String((d as any).name).trim()
                  : typeof (d as any)?.["জেলার_নাম"] === "string"
                    ? String((d as any)["জেলার_নাম"]).trim()
                    : "";

              const upazilasRaw =
                (d as any)?.upazilas ?? (d as any)?.["উপজেলা_সমূহ"];
              const upazilas = Array.isArray(upazilasRaw)
                ? upazilasRaw
                    .filter(
                      (u): u is string => typeof u === "string" && !!u.trim(),
                    )
                    .map((u) => u.trim())
                : [];

              return districtName
                ? { id, district: districtName, upazilas }
                : null;
            })
            .filter(
              (v): v is { id: number; district: string; upazilas: string[] } =>
                !!v,
            );
        };

        const [enRes, bnRes] = await Promise.allSettled([
          fetch("/images/Eglish.json"),
          fetch("/images/zlia.json"),
        ]);

        const readJson = async (
          res: Response | null,
        ): Promise<unknown | null> => {
          if (!res || !res.ok) return null;
          try {
            return await res.json();
          } catch {
            return null;
          }
        };

        const enJson =
          enRes.status === "fulfilled" && enRes.value.ok
            ? await readJson(enRes.value)
            : null;
        const bnJson =
          bnRes.status === "fulfilled" && bnRes.value.ok
            ? await readJson(bnRes.value)
            : null;

        if (cancelled) return;

        const enData = normalize(enJson);
        const bnData = normalize(bnJson);

        setEnZilaData(enData);
        setBnZilaData(bnData);
      } catch {
        if (cancelled) return;
        setEnZilaData([]);
        setBnZilaData([]);
      } finally {
        if (cancelled) return;
        setZilaLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!district || !setDistrict) return;
    if (!enZilaData.length || !bnZilaData.length) return;
    if (enZilaData.some((d) => d.district === district)) return;

    const bnDistrict = bnZilaData.find((d) => d.district === district);
    if (!bnDistrict) return;

    const enDistrict = enZilaData.find((d) => d.id === bnDistrict.id);
    if (!enDistrict) return;

    setDistrict(enDistrict.district);

    if (upazila && setUpazila) {
      const idx = bnDistrict.upazilas.indexOf(upazila);
      const mapped = idx >= 0 ? enDistrict.upazilas[idx] : undefined;
      if (mapped) setUpazila(mapped);
    }
  }, [district, enZilaData, bnZilaData, setDistrict, setUpazila, upazila]);

  const districtOptions = useMemo(
    () => (enZilaData.length ? enZilaData : bnZilaData),
    [enZilaData, bnZilaData],
  );

  const selectedUpazilas = useMemo(() => {
    if (!district) return [];
    return districtOptions.find((d) => d.district === district)?.upazilas ?? [];
  }, [district, districtOptions]);

  return (
    <section>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* customer info start */}
        <div className="flex flex-col gap-3  border border-gray-100 bg-white p-4 shadow-sm rounded-lg">
          <h1 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
            Shipping Address
          </h1>
          <div className="flex flex-col gap-3">
            <div className="grid min-[550px]:grid-cols-2 grid-cols-1 gap-3">
              <input
                className="border border-gray-200 outline-none  py-2.5 px-3 text-sm focus:border-black placeholder:text-gray-400 bg-gray-50/30 focus:bg-white transition-all rounded-lg"
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="border border-gray-200 outline-none  py-2.5 px-3 text-sm focus:border-black placeholder:text-gray-400 bg-gray-50/30 focus:bg-white transition-all rounded-lg"
                type="tel"
                inputMode="numeric"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  setPhone(onlyDigits);
                }}
                required
              />
            </div>
            <div className="grid min-[550px]:grid-cols-2 grid-cols-1 gap-3">
              <input
                className="border border-gray-200 outline-none  py-2.5 px-3 text-sm focus:border-black placeholder:text-gray-400 bg-gray-50/30 focus:bg-white transition-all rounded-lg"
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <select
                className="border border-gray-200 outline-none py-2.5 px-3 text-sm focus:border-black bg-gray-50/30 focus:bg-white transition-all rounded-lg"
                value={district || ""}
                onChange={(e) => {
                  const next = e.target.value;
                  setDistrict?.(next);
                  setUpazila?.("");
                }}
                required
                disabled={zilaLoading}
              >
                <option value="" disabled>
                  {zilaLoading ? "Loading districts..." : "Select District *"}
                </option>
                {districtOptions.map((d) => (
                  <option key={d.id} value={d.district}>
                    {d.district}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid min-[550px]:grid-cols-2 grid-cols-1 gap-3">
              <select
                className="border border-gray-200 outline-none py-2.5 px-3 text-sm focus:border-black bg-gray-50/30 focus:bg-white transition-all rounded-lg disabled:opacity-60"
                value={upazila || ""}
                onChange={(e) => setUpazila?.(e.target.value)}
                required
                disabled={
                  !district || zilaLoading || selectedUpazilas.length === 0
                }
              >
                <option value="" disabled>
                  {!district ? "Select district first *" : "Select Upazila *"}
                </option>
                {selectedUpazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <input
                className="border border-gray-200 outline-none  py-2.5 px-3 text-sm focus:border-black placeholder:text-gray-400 bg-gray-50/30 focus:bg-white transition-all rounded-lg"
                type="text"
                placeholder="Street Address *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        {/* customer info end  */}

        {/* delivery type & payment method */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 border border-gray-100 bg-white p-4 shadow-sm rounded-lg">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Delivery Type
            </h2>
            <div className="flex flex-col gap-2">
              <select
                className="border border-gray-200 outline-none py-2.5 px-3 text-sm focus:border-black bg-gray-50/30 focus:bg-white transition-all rounded-lg"
                value={deliveryType || ""}
                onChange={(e) =>
                  setDeliveryType?.(e.target.value as "inside" | "outside")
                }
                required
              >
                <option value="" disabled>
                  Select Delivery Type *
                </option>
                <option value="inside">Inside Dhaka (60৳)</option>
                <option value="outside">Outside Dhaka (120৳)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3  border border-gray-100 bg-white p-4 shadow-sm rounded-lg">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Payment Method
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className={`flex items-center gap-3 p-3  border cursor-pointer transition-all rounded-lg ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod?.("cod")}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-black hover:bg-gray-900 transition-all text-white text-sm font-bold py-3.5 flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-black/10 hover:shadow-lg hover:-translate-y-0.5 mt-2 !rounded-full"
        >
          <IoCartOutline size={18} />
          {submitting ? "Ordering..." : "Confirm Order"}
        </button>
      </form>
    </section>
  );
};

export default CustomerInfo;

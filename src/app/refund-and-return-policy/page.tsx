"use client";

import { useEffect, useState, useRef } from "react";
import { FiCheckCircle, FiClock, FiRefreshCw, FiXCircle } from "react-icons/fi";
import { getRefundPolicies } from "@/lib/api-services";
import type { ReturnPolicy } from "@/types/return-policy";

const RefundPolicyPage = () => {
  const [policyContent, setPolicyContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPolicy = async () => {
      try {
        const data: ReturnPolicy[] = await getRefundPolicies();
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0 && data[0]?.content) {
          setPolicyContent(data[0].content);
        }
      } catch (error) {
        console.error("Failed to load refund policy content:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPolicy();

    return () => {
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    if (!policyContent || !contentRef.current) return;
    const root = contentRef.current;
    const tables = root.querySelectorAll("table");
    tables.forEach((table) => {
      table.classList.add("w-full", "border", "border-gray-300");
      (table as HTMLTableElement).style.borderCollapse = "collapse";
      const cells = table.querySelectorAll("th, td");
      cells.forEach((cell) => {
        (cell as HTMLElement).classList.add("border", "border-gray-300", "p-2");
      });
    });
    const uls = root.querySelectorAll("ul");
    uls.forEach((ul) => {
      (ul as HTMLElement).classList.add("list-disc", "list-inside", "ml-4");
    });
    const ols = root.querySelectorAll("ol");
    ols.forEach((ol) => {
      (ol as HTMLElement).classList.add("list-decimal", "list-inside", "ml-4");
    });
    const bolds = root.querySelectorAll("b, strong");
    bolds.forEach((b) => {
      (b as HTMLElement).classList.add("font-bold");
    });
    const italics = root.querySelectorAll("i, em");
    italics.forEach((i) => {
      (i as HTMLElement).classList.add("italic");
    });
  }, [policyContent]);
  return (
    <main className="max-w-5xl mx-auto sm:px-5 px-3 py-10 space-y-10">
      <header className="space-y-3 text-center md:text-left">
        <span className="inline-block text-xs font-bold tracking-widest text-white px-4 py-2 rounded-full bg-primary mb-2">
          Refund & Return Policy
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">
          When, how and under what conditions you will get a refund
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl">
          Our goal is to follow a simple, clear, and fair refund and return policy so that you can order with confidence. Below are the steps and conditions explained step by step.
        </p>
      </header>

      <section className="grid grid-cols-2  md:grid-cols-4 sm:gap-4 gap-2">
        <div className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col gap-1">
          <div className="text-primary sm:text-xl text-lg">
            <FiClock />
          </div>
          <p className="text-xs font-semibold text-gray-900">
            Refund Timeframe
          </p>
          <p className="text-xs text-[10px] text-gray-600">
            Refunds are processed usually within 7-10 working days after product delivery.
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col gap-1">
          <div className="text-primary sm:text-xl text-lgl">
            <FiRefreshCw />
          </div>
          <p className="text-xs font-semibold text-gray-900">Return Window</p>
          <p className="text-xs text-[10px] text-gray-600">
            Return request must be made within a specified period (e.g., 3-7 days) after delivery.
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col gap-1">
          <div className="text-green-500 sm:text-xl text-lg">
            <FiCheckCircle />
          </div>
          <p className="text-xs font-semibold text-gray-900">Approved Conditions</p>
          <p className="text-xs text-[10px] text-gray-600">
            Refund/replacement applies to wrong, defective, or damaged products.
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col gap-1">
          <div className="text-gray-600 sm:text-xl text-lg">
            <FiXCircle />
          </div>
          <p className="text-xs font-semibold text-gray-900">Non-refundable</p>
          <p className="sm:text-xs text-[10px] text-gray-600">
            Some categories of products are not eligible for refund (see details below).
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-gray-200 px-6 py-8 md:px-8 md:py-9 shadow-sm space-y-8 text-gray-800">
        {isLoading && !policyContent && (
          <p className="text-sm text-gray-500">Loading refund policy...</p>
        )}

        {policyContent ? (
          <article
            className="prose max-w-none prose-sm sm:prose-base text-gray-800"
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: policyContent }}
          />
        ) : (
          <article className="prose max-w-none prose-sm sm:prose-base text-gray-800 flex flex-col gap-4">
          <section>
            <h2>1. Return Window</h2>
            <p>
              Generally, after receiving product delivery, you can apply for a return or refund within{" "}
              <strong>3-7 working days</strong> (this timeframe may change according to business policy). Requests made after the specified time are usually not accepted unless there are special circumstances.
            </p>
            <ul>
              <li>The count starts from the delivery date.</li>
              <li>If necessary, the delivery slip/message may need to be shown as proof.</li>
              <li>You must contact the support team before the timeframe ends.</li>
            </ul>
          </section>

          <section>
            <h2>2. Under what conditions is a refund/replacement applicable?</h2>
            <p>
              You can request a refund or replacement in any of the following situations:
            </p>
            <ul>
              <li>Receiving the wrong product (does not match your order).</li>
              <li>Receiving a damaged or defective product.</li>
              <li>Receiving something other than the ordered size/variant.</li>
              <li>Order cancellation request being approved before delivery.</li>
            </ul>
            <p>
              In all cases, we may offer a product replacement first; if replacement is not possible, a refund will be processed.
            </p>
          </section>

          <section>
            <h2>3. Circumstances where a refund is not applicable</h2>
            <p>
              Some categories of products are not eligible for refunds or returns due to consumer safety and policies:
            </p>
            <ul>
              <li>Products that have been used or clearly damaged.</li>
              <li>Products whose tags/seals/packaging have been intentionally destroyed.</li>
              <li>Intimate, personal care, or hygiene products (as per policy).</li>
              <li>Digital products or e-services that have already been delivered.</li>
              <li>Offer products marked as "Final Sale" or non-refundable.</li>
            </ul>
          </section>

          <section>
            <h2>4. Return conditions and product state</h2>
            <p>
              To accept a return, the following conditions must usually be met:
            </p>
            <ul>
              <li>The product must be kept in its original condition as much as possible.</li>
              <li>Original box, tags, manuals, and accessories must be returned along with the product.</li>
              <li>A copy of the order invoice/slip may need to be provided.</li>
              <li>If there are free gifts, they may also need to be returned where applicable.</li>
            </ul>
          </section>

          <section>
            <h2>5. Refund process and when you will receive the money</h2>
            <p>
              The refund process begins after the returned product has been checked by our team or partner.
            </p>
            <ul>
              <li>For Cash on Delivery orders, refunds may be given to a bank/mobile banking account.</li>
              <li>For online payments, refunds are usually processed to the same payment method.</li>
              <li>It can generally take 7-10 working days for the refund to be completed.</li>
              <li>Processing delays by the bank/payment gateway are not under our control.</li>
            </ul>
          </section>

          <section>
            <h2>6. Return shipping charges</h2>
            <p>
              Who bears the return shipping charges may vary according to the condition:
            </p>
            <ul>
              <li>For wrong or damaged products, we usually bear the shipping charges.</li>
              <li>If the return is due to a change of mind or disliking the product, a case-by-case policy applies.</li>
              <li>Detailed shipping charge policies may be updated from time to time.</li>
            </ul>
          </section>

          <section>
            <h2>7. Partial refunds and adjustments</h2>
            <p>
              In some cases, a partial refund or adjustment may be made instead of a full refund:
            </p>
            <ul>
              <li>If the box/accessories are missing, some value may be deducted.</li>
              <li>If the product has been partially used, a partial refund may apply.</li>
              <li>There may be an opportunity to adjust the amount as a voucher/credit for future orders.</li>
            </ul>
          </section>

          <section>
            <h2>8. Refund examples by product type</h2>
            <p>
              Refund policies may vary slightly in practice for different types of products. Below are some practical examples based on common product types:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-900 mb-1">
                  Electronics / Gadgets
                </p>
                <ul className="text-xs text-gray-700 list-disc list-inside space-y-1">
                  <li>Refund/replace if dead/defective within a short time after delivery.</li>
                  <li>Box, charger, cable, warranty card, etc. must be provided if available.</li>
                  <li>Different policies may apply to earphones/headphones used on the body.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-900 mb-1">
                  Fashion / Clothing / Shoes
                </p>
                <ul className="text-xs text-gray-700 list-disc list-inside space-y-1">
                  <li>Returns are possible for size issues if the tag is uncut and the item is unused.</li>
                  <li>Refunds may not apply if there are clear stains, damage, or signs of use.</li>
                  <li>Limited edition or customized items may have a non-refundable policy.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-900 mb-1">
                  Beauty / Cosmetics / Hygiene
                </p>
                <ul className="text-xs text-gray-700 list-disc list-inside space-y-1">
                  <li>Returns are not usually accepted if the seal/security seal is broken.</li>
                  <li>Damage or leakage during delivery must be reported promptly with evidence.</li>
                  <li>Personal care products may have a strict non-refundable policy according to health regulations.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-900 mb-1">
                  Home & Decor / Others
                </p>
                <ul className="text-xs text-gray-700 list-disc list-inside space-y-1">
                  <li>Check breakable items immediately upon delivery and report issues right away.</li>
                  <li>Advance payments for custom-made or pre-ordered items may be partially non-refundable.</li>
                  <li>Additional category-specific conditions may be mentioned in the product details as needed.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2>9. Policy changes and updates</h2>
            <p>
              Our refund and return policy may be updated from time to time due to legal updates, partner changes, or service modifications. In case of significant changes, we will notify you through the website, notifications, or any other means.
            </p>
          </section>

          <section>
            <h2>10. Need help?</h2>
            <p>
              If you have any questions, complaints, or special circumstances regarding refunds or returns, please contact our Customer Support team directly. We try to handle every case fairly and quickly.
            </p>
          </section>
        </article>
        )}
      </section>
    </main>
  );
};

export default RefundPolicyPage;

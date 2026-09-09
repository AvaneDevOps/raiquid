"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What happens if the buyer does not pay?",
    answer:
      "The reserve pool, funded by a small share of every transaction, covers investors first. A buyer who does not pay also sees it reflected in their provenance record for future invoices.",
  },
  {
    question: "What is tokenisation? Do I need to understand it?",
    answer:
      "Tokenisation converts invoice ownership into secure digital units. You do not need any technical knowledge to participate.",
  },
  {
    question: "How much can I invest in a single invoice?",
    answer: "Investment limits depend on the invoice and the available offering.",
  },
  {
    question: "As a buyer, does accepting an invoice mean I am taking a loan?",
    answer:
      "No. Accepting an invoice gives you access to transparent payment terms without taking out a traditional loan.",
  },
  {
    question: "Is my data and business information secure?",
    answer: "Yes. Your information is protected using secure infrastructure and access controls.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#13120e] text-[#eee7d9]">
      <div className="mx-auto max-w-232.5 px-8 py-20 md:px-10 md:py-20.5">
        <h2 className="font-serif text-[22px] font-semibold tracking-[-0.02em]">FAQs</h2>

        <div className="mt-7 max-w-130.75">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="border-b border-[#28251b]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 py-3.5 text-left text-[10px] leading-4 font-medium text-[#eee7d9]"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-[12px] font-light text-[#bcb19d]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <p className="max-w-130.75 pr-8 pb-3 text-[9px] leading-4.25 text-[#857d6d]">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#2a271e] bg-[#1c1a14]">
        <div className="mx-auto flex max-w-232.5 flex-col items-center px-8 py-11.5 text-center">
          <h3 className="font-serif text-[21px] font-semibold tracking-[-0.02em]">
            Ready to get started?
          </h3>

          <p className="mt-2 max-w-82.5 text-[10px] leading-4.25 text-[#918979]">
            Join businesses, investors, and buyers building a more transparent invoice economy.
          </p>

          <div className="mt-5 flex gap-2">
            <a
              href="#get-started"
              className="rounded-[7px] bg-[#e5ad4c] px-3.75 py-2.25 text-[9px] font-semibold text-[#1d180f] transition hover:bg-[#f0bd5c]"
            >
              Get started
            </a>

            <a
              href="#investments"
              className="rounded-[7px] border border-[#5b4828] px-3.75 py-2 text-[9px] font-semibold text-[#eee7d9] transition hover:bg-[#282218]"
            >
              Explore investments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

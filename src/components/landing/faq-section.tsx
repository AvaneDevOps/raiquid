"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/shared/ui/button";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "What happens if the buyer doesn't pay?",
    answer:
      "The reserve pool, funded by a small share of every transaction, covers investors first. A buyer who doesn't pay also sees it reflected in their provenance record for future invoices.",
  },
  {
    question: "What is tokenization? Do I need to understand it?",
    answer:
      "Tokenization converts invoice ownership into secure digital units. You don't need any technical knowledge to participate.",
  },
  {
    question: "How much can I invest in a single invoice?",
    answer: "Investment limits depend on the invoice and the available offering.",
  },
  {
    question: "As a buyer, does accepting an invoice mean I'm taking a loan?",
    answer:
      "No. Accepting an invoice gives you access to transparent payment terms without taking out a traditional loan.",
  },
  {
    question: "Is my data and business information secure?",
    answer: "Yes. Your information is protected using secure infrastructure and access controls.",
  },
];

function FaqRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-border border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-foreground font-semibold">{item.question}</span>
        {isOpen ? (
          <Minus className="text-muted-foreground size-4 shrink-0" aria-hidden />
        ) : (
          <Plus className="text-muted-foreground size-4 shrink-0" aria-hidden />
        )}
      </button>

      {isOpen ? (
        <p className="text-muted-foreground mt-0 max-w-xl pb-5 text-sm leading-relaxed">
          {item.answer}
        </p>
      ) : null}
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <section className="border-border border-t py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-foreground text-4xl font-semibold md:text-5xl">
            Common questions
          </h2>

          <div className="mt-10 max-w-2xl">
            {FAQS.map((item, index) => (
              <FaqRow
                key={item.question}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-border bg-surface-raised border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center md:py-24">
          <h2 className="font-display text-foreground text-3xl font-semibold md:text-4xl">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md">
            Join businesses, investors, and buyers building a more transparent invoice economy.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/auth">Get started</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/#for-investors">Explore investments</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState, type FormEvent } from "react";

import { BUYER_SUMMARIES } from "@/components/business/fixtures";
import { ProvenanceTierBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { Textarea } from "@/components/shared/ui/textarea";

import { ProofOfDeliveryDropzone } from "./_components/proof-of-delivery-dropzone";

type FormErrors = Partial<
  Record<"buyerName" | "amount" | "dueDate" | "description" | "file", string>
>;

// Screen 05-bizUpload. No backend exists yet (see docs/RAIQUID_CONTEXT.md,
// "Open decisions") — validation below is real, but a successful submit
// says so plainly rather than pretending an invoice was actually created.
export default function Page() {
  const [buyerName, setBuyerName] = useState("Distify Distribution Ltd");
  const [amountDisplay, setAmountDisplay] = useState("2,000,000");
  const [dueDate, setDueDate] = useState("2026-10-30");
  const [description, setDescription] = useState(
    "400 units of woven fabric, delivered 28 Aug 2026.",
  );
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Only buyer_1 (Distify) has real evidence for this summary (screen
  // 05 itself). Matching by exact name is a stand-in for a real buyer
  // lookup/autocomplete, which doesn't exist yet — this only reacts to
  // the prefilled default, not arbitrary typed input.
  const buyerSummary =
    buyerName === "Distify Distribution Ltd" ? BUYER_SUMMARIES.buyer_1 : undefined;

  function handleAmountChange(rawValue: string) {
    const digitsOnly = rawValue.replace(/[^\d]/g, "");
    setAmountDisplay(digitsOnly ? Number(digitsOnly).toLocaleString("en-US") : "");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const amount = Number(amountDisplay.replace(/,/g, ""));

    if (!buyerName.trim()) nextErrors.buyerName = "Enter the buyer's name.";
    if (!amountDisplay || !(amount > 0)) nextErrors.amount = "Enter a valid invoice amount.";
    if (!dueDate) nextErrors.dueDate = "Choose a due date.";
    if (!description.trim()) nextErrors.description = "Describe the goods or services delivered.";
    if (!file) nextErrors.file = "Attach proof of delivery.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setSubmitted(true);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-foreground text-3xl font-semibold">Upload an invoice</h1>
      <p className="text-muted-foreground mt-1">
        We&apos;ll send this to your buyer for confirmation before it can be listed.
      </p>

      <form onSubmit={handleSubmit} className="mt-8" noValidate>
        <fieldset disabled={submitted} className="space-y-6 disabled:opacity-60">
          <Card className="space-y-6 p-6">
            <div>
              <label htmlFor="buyerName" className="text-muted-foreground text-sm">
                Buyer
              </label>
              <Input
                id="buyerName"
                className="mt-2"
                value={buyerName}
                onChange={(event) => setBuyerName(event.target.value)}
                aria-invalid={Boolean(errors.buyerName)}
              />
              {errors.buyerName ? (
                <p className="text-danger mt-1 text-sm">{errors.buyerName}</p>
              ) : null}
              {buyerSummary ? (
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <ProvenanceTierBadge tier={buyerSummary.tier} className="shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    {buyerSummary.acceptedOnTime} of {buyerSummary.totalSent} invoices paid on time
                  </span>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="amount" className="text-muted-foreground text-sm">
                  Invoice amount (₦)
                </label>
                <Input
                  id="amount"
                  className="mt-2"
                  inputMode="numeric"
                  value={amountDisplay}
                  onChange={(event) => handleAmountChange(event.target.value)}
                  aria-invalid={Boolean(errors.amount)}
                />
                {errors.amount ? <p className="text-danger mt-1 text-sm">{errors.amount}</p> : null}
              </div>

              <div>
                <label htmlFor="dueDate" className="text-muted-foreground text-sm">
                  Due date
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  className="mt-2"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  aria-invalid={Boolean(errors.dueDate)}
                />
                {errors.dueDate ? (
                  <p className="text-danger mt-1 text-sm">{errors.dueDate}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="text-muted-foreground text-sm">
                Description of goods or services
              </label>
              <Textarea
                id="description"
                className="mt-2"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description ? (
                <p className="text-danger mt-1 text-sm">{errors.description}</p>
              ) : null}
            </div>

            <ProofOfDeliveryDropzone file={file} onFileChange={setFile} error={errors.file} />
          </Card>
        </fieldset>

        {submitted ? (
          <InlineNotice tone="success" className="mt-6">
            Looks good — in the full product this would now be sent to{" "}
            {buyerName.split(" ")[0] || "your buyer"} for confirmation. No backend exists yet, so
            nothing was actually submitted.
          </InlineNotice>
        ) : (
          <InlineNotice tone="info" className="mt-6">
            {buyerName.split(" ")[0] || "Your buyer"} will need to confirm this invoice is genuine
            before it&apos;s listed to investors. This usually takes 1–2 business days.
          </InlineNotice>
        )}

        <Button type="submit" size="lg" className="mt-6" disabled={submitted}>
          {submitted ? "Sent for buyer acceptance" : "Send for buyer acceptance"}
        </Button>
      </form>
    </div>
  );
}

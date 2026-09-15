"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { Textarea } from "@/components/shared/ui/textarea";
import { createInvoice } from "@/services/business";

import { ProofOfDeliveryDropzone } from "./_components/proof-of-delivery-dropzone";

type FormErrors = Partial<
  Record<
    | "buyerName"
    | "invoiceNumber"
    | "buyerContactEmail"
    | "amount"
    | "dueDate"
    | "description"
    | "file",
    string
  >
>;

// Screen 05-bizUpload, wired to POST /business/invoices (CreateInvoiceDto —
// see src/types/api-generated.ts). invoiceNumber and buyerContactEmail are
// required by the DTO but weren't part of the original fixture-driven form,
// so they're added here. Proof of delivery is still collected and validated
// but not sent — CreateInvoiceDto has no field for it and no upload endpoint
// exists yet for business invoices (unlike the investor KYC upload-url
// flow). The buyer-reputation summary (provenance tier, on-time count) that
// used to show under the Buyer field is gone — it was BUYER_SUMMARIES
// fixture data keyed on typing the exact demo name, and no endpoint exists
// to look up a buyer's reputation by name/email while filling this form.
// See docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  const { getToken } = useAuth();
  const [buyerName, setBuyerName] = useState("Distify Distribution Ltd");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-0100");
  const [buyerContactEmail, setBuyerContactEmail] = useState("ap@distify.example");
  const [amountDisplay, setAmountDisplay] = useState("2,000,000");
  const [dueDate, setDueDate] = useState("2026-10-30");
  const [description, setDescription] = useState(
    "400 units of woven fabric, delivered 28 Aug 2026.",
  );
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleAmountChange(rawValue: string) {
    const digitsOnly = rawValue.replace(/[^\d]/g, "");
    setAmountDisplay(digitsOnly ? Number(digitsOnly).toLocaleString("en-US") : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const amount = Number(amountDisplay.replace(/,/g, ""));

    if (!buyerName.trim()) nextErrors.buyerName = "Enter the buyer's name.";
    if (!invoiceNumber.trim()) nextErrors.invoiceNumber = "Enter an invoice number.";
    if (!buyerContactEmail.trim())
      nextErrors.buyerContactEmail = "Enter the buyer's contact email.";
    if (!amountDisplay || !(amount > 0)) nextErrors.amount = "Enter a valid invoice amount.";
    if (!dueDate) nextErrors.dueDate = "Choose a due date.";
    if (!description.trim()) nextErrors.description = "Describe the goods or services delivered.";
    if (!file) nextErrors.file = "Attach proof of delivery.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const token = await getToken();
      await createInvoice(
        {
          invoiceNumber,
          amount,
          currency: "NGN",
          dueDate,
          description,
          buyerLegalName: buyerName,
          buyerContactEmail,
        },
        token,
      );
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-foreground text-3xl font-semibold">Upload an invoice</h1>
      <p className="text-muted-foreground mt-1">
        We&apos;ll send this to your buyer for confirmation before it can be listed.
      </p>

      <form onSubmit={handleSubmit} className="mt-8" noValidate>
        <fieldset disabled={submitted || submitting} className="space-y-6 disabled:opacity-60">
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
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="invoiceNumber" className="text-muted-foreground text-sm">
                  Invoice number
                </label>
                <Input
                  id="invoiceNumber"
                  className="mt-2"
                  value={invoiceNumber}
                  onChange={(event) => setInvoiceNumber(event.target.value)}
                  aria-invalid={Boolean(errors.invoiceNumber)}
                />
                {errors.invoiceNumber ? (
                  <p className="text-danger mt-1 text-sm">{errors.invoiceNumber}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="buyerContactEmail" className="text-muted-foreground text-sm">
                  Buyer contact email
                </label>
                <Input
                  id="buyerContactEmail"
                  type="email"
                  className="mt-2"
                  value={buyerContactEmail}
                  onChange={(event) => setBuyerContactEmail(event.target.value)}
                  aria-invalid={Boolean(errors.buyerContactEmail)}
                />
                {errors.buyerContactEmail ? (
                  <p className="text-danger mt-1 text-sm">{errors.buyerContactEmail}</p>
                ) : null}
              </div>
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

        {submitError ? (
          <InlineNotice tone="danger" className="mt-6">
            {submitError}
          </InlineNotice>
        ) : submitted ? (
          <InlineNotice tone="success" className="mt-6">
            Submitted — {buyerName.split(" ")[0] || "your buyer"} will need to confirm it before
            it&apos;s listed to investors.
          </InlineNotice>
        ) : (
          <InlineNotice tone="info" className="mt-6">
            {buyerName.split(" ")[0] || "Your buyer"} will need to confirm this invoice is genuine
            before it&apos;s listed to investors. This usually takes 1–2 business days.
          </InlineNotice>
        )}

        <Button type="submit" size="lg" className="mt-6" disabled={submitted || submitting}>
          {submitting
            ? "Sending…"
            : submitted
              ? "Sent for buyer acceptance"
              : "Send for buyer acceptance"}
        </Button>
      </form>
    </div>
  );
}

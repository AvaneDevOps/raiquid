"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { Textarea } from "@/components/shared/ui/textarea";
import { businessService } from "@/services/business";

import { ProofOfDeliveryDropzone } from "./_components/proof-of-delivery-dropzone";

type FormErrors = Partial<
  Record<"buyerName" | "buyerEmail" | "amount" | "dueDate" | "description" | "file", string>
>;

export default function Page() {
  const { getToken } = useAuth();
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function handleAmountChange(rawValue: string) {
    const digitsOnly = rawValue.replace(/[^\d]/g, "");
    setAmountDisplay(digitsOnly ? Number(digitsOnly).toLocaleString("en-US") : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError(null);

    const nextErrors: FormErrors = {};
    const amount = Number(amountDisplay.replace(/,/g, ""));

    if (!buyerName.trim()) nextErrors.buyerName = "Enter the buyer's legal name.";
    if (!buyerEmail.trim()) nextErrors.buyerEmail = "Enter the buyer's contact email.";
    if (!amountDisplay || !(amount > 0)) nextErrors.amount = "Enter a valid invoice amount.";
    if (!dueDate) nextErrors.dueDate = "Choose a due date.";
    if (!description.trim()) nextErrors.description = "Describe the goods or services delivered.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const token = await getToken();
      await businessService.createInvoice(
        {
          invoiceNumber: `INV-${Date.now()}`,
          amount,
          currency: "NGN",
          dueDate,
          description,
          buyerLegalName: buyerName.trim(),
          buyerContactEmail: buyerEmail.trim(),
        },
        token,
      );
      setSubmitted(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "The invoice could not be submitted.");
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
                Buyer legal name
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

            <div>
              <label htmlFor="buyerEmail" className="text-muted-foreground text-sm">
                Buyer contact email
              </label>
              <Input
                id="buyerEmail"
                type="email"
                className="mt-2"
                value={buyerEmail}
                onChange={(event) => setBuyerEmail(event.target.value)}
                aria-invalid={Boolean(errors.buyerEmail)}
              />
              {errors.buyerEmail ? (
                <p className="text-danger mt-1 text-sm">{errors.buyerEmail}</p>
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

        {apiError ? (
          <InlineNotice tone="danger" className="mt-6">
            {apiError}
          </InlineNotice>
        ) : null}

        {submitted ? (
          <InlineNotice tone="success" className="mt-6">
            Invoice submitted successfully and is now awaiting buyer confirmation.
          </InlineNotice>
        ) : (
          <InlineNotice tone="info" className="mt-6">
            Your buyer will need to confirm this invoice before it can be listed to investors.
          </InlineNotice>
        )}

        <Button type="submit" size="lg" className="mt-6" disabled={submitted || submitting}>
          {submitted
            ? "Sent for buyer acceptance"
            : submitting
              ? "Submitting…"
              : "Send for buyer acceptance"}
        </Button>
      </form>
    </div>
  );
}

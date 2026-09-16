"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { ApiError, investorService } from "@/services";

const ISO_ALPHA_2 = /^[A-Za-z]{2}$/;

type FormErrors = Partial<Record<"legalName" | "countryOfResidence", string>>;

// POST /investor/whitelisting (SubmitWhitelistingDto — confirmed against
// raiquid-api's submit-whitelisting.dto.ts): legalName (string, required)
// and countryOfResidence (exactly 2 chars, ISO 3166-1 alpha-2, required).
// identityDocumentKey/proofOfAddressKey are optional there — document
// upload is skipped entirely here, not faked. See
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export function WhitelistingForm() {
  const { getToken } = useAuth();
  const [legalName, setLegalName] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const country = countryOfResidence.trim().toUpperCase();

    if (!legalName.trim()) nextErrors.legalName = "Enter your legal name.";
    if (!ISO_ALPHA_2.test(country)) {
      nextErrors.countryOfResidence =
        "Enter a 2-letter ISO country code (e.g. NG), not the full country name.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const token = await getToken();
      await investorService.post(
        "/investor/whitelisting",
        { legalName, countryOfResidence: country },
        token,
      );
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <InlineNotice tone="success">
        Submitted — your details are now in review. This usually takes one business day.
      </InlineNotice>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="space-y-6 p-6">
        <div>
          <label htmlFor="legalName" className="text-muted-foreground text-sm">
            Legal name
          </label>
          <Input
            id="legalName"
            className="mt-2"
            value={legalName}
            onChange={(event) => setLegalName(event.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.legalName)}
          />
          {errors.legalName ? <p className="text-danger mt-1 text-sm">{errors.legalName}</p> : null}
        </div>

        <div>
          <label htmlFor="countryOfResidence" className="text-muted-foreground text-sm">
            Country of residence (2-letter ISO code, e.g. NG)
          </label>
          <Input
            id="countryOfResidence"
            className="mt-2 uppercase"
            maxLength={2}
            value={countryOfResidence}
            onChange={(event) => setCountryOfResidence(event.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.countryOfResidence)}
          />
          {errors.countryOfResidence ? (
            <p className="text-danger mt-1 text-sm">{errors.countryOfResidence}</p>
          ) : null}
        </div>
      </Card>

      {submitError ? (
        <InlineNotice tone="danger" className="mt-6">
          {submitError}
        </InlineNotice>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}

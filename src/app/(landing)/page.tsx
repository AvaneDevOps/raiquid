import { ForBusinessesSection, HowItWorksSection } from "@/components/landing";

// Screen 01-landing, top to bottom. Only "How it works" and "For
// businesses" are implemented so far (scoped work) — the remaining
// sections are deliberately left as commented placeholders, not built
// around silently, per CONTRIBUTING.md #6:
//   - Hero (headline, stat strip)
//   - HowItWorksSection [x] — id="how-it-works"
//   - ForBusinessesSection [x] — id="for-businesses"
//   - For investors — id="for-investors" (see LANDING_NAV)
//   - Why provenance matters
//   - Common questions (FAQ)
//   - Final "Ready to get started?" CTA band
// LandingHeader/LandingFooter come from (landing)/layout.tsx.
export default function Page() {
  return (
    <>
      {/* TODO: Hero section — not yet built. */}
      <HowItWorksSection />
      <ForBusinessesSection />
      {/* TODO: For investors, Why provenance matters, FAQ, final CTA —
          not yet built. */}
    </>
  );
}

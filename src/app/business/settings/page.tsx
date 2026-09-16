import { auth } from "@clerk/nextjs/server";

import { businessService } from "@/services/business";

import { BusinessSettingsForm } from "./_components/business-settings-form";

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  const settings = await businessService.getSettings(token);

  return <BusinessSettingsForm initialSettings={settings} />;
}

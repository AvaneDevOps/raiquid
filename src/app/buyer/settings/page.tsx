import { auth } from "@clerk/nextjs/server";

import { buyerService } from "@/services/buyer";

import { BuyerSettingsForm } from "./_components/buyer-settings-form";

export default async function Page() {
  const { getToken } = await auth();

  const token = await getToken();

  const settings = await buyerService.getSettings(token);

  return <BuyerSettingsForm initialSettings={settings} />;
}

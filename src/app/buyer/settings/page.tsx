import { auth } from "@clerk/nextjs/server";

import { buyerService } from "@/services/buyer";

import { BuyerSettingsForm } from "./_components/buyer-settings-form";
import { BUYER_SETTINGS_FALLBACKS, type BuyerSettingsDataSource } from "./_components/fallbacks";

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  const settings = await buyerService.getSettings(token);

  const supplementalDataSource: BuyerSettingsDataSource = "fallback";

  return (
    <BuyerSettingsForm
      initialSettings={settings}
      authorizedContacts={BUYER_SETTINGS_FALLBACKS.authorizedContacts}
      notificationPreferences={BUYER_SETTINGS_FALLBACKS.notificationPreferences}
      supplementalDataSource={supplementalDataSource}
    />
  );
}

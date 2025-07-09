export interface AirtableConfig {
  apiKey: string;
  baseId: string;
  baseUrl: string;
}

export const airtableConfig: AirtableConfig = {
  apiKey:
    process.env.AIRTABLE_API_KEY ||
    "pat8hC4zuGSORvwSC.5dd580db4876455b9ad26c7809cbe59e0bdc56d819e53da28181850f749c0ff4",
  baseId: process.env.AIRTABLE_BASE_ID || "appnIUwq8GqXprPK8",
  baseUrl: "https://api.airtable.com/v0",
};

export const validateConfig = (): boolean => {
  if (!airtableConfig.apiKey) {
    console.error("AIRTABLE_API_KEY is not set");
    return false;
  }
  if (!airtableConfig.baseId) {
    console.error("AIRTABLE_BASE_ID is not set");
    return false;
  }
  return true;
};

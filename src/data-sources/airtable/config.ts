export interface AirtableConfig {
  apiKey: string;
  baseId: string;
  baseUrl: string;
}

export const airtableConfig: AirtableConfig = {
  apiKey:
    process.env.AIRTABLE_API_KEY ,
  baseId: process.env.AIRTABLE_BASE_ID,
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

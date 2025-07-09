import AirtableLib from "airtable";
import { airtableConfig, validateConfig } from "./config";
import { AirtableRecord, AirtableResponse } from "./types";

console.log("🔧 Airtable config check:", {
  hasApiKey: !!airtableConfig.apiKey,
  hasBaseId: !!airtableConfig.baseId,
  baseId: airtableConfig.baseId,
});

if (!validateConfig()) {
  throw new Error("Airtable configuration is invalid.");
}

const base = new AirtableLib({ apiKey: airtableConfig.apiKey }).base(
  airtableConfig.baseId
);

export const AirtableClient = {
  async getRecords<T = any>(
    table: string,
    options?: AirtableLib.SelectOptions<any>
  ): Promise<AirtableRecord<T>[]> {
    console.log(`🔍 Fetching records from table: ${table}`);
    console.log(`🔧 Options:`, options);

    return new Promise((resolve, reject) => {
      const records: AirtableRecord<T>[] = [];
      base(table)
        .select(options || {})
        .eachPage(
          (fetchedRecords, fetchNextPage) => {
            console.log(
              `📄 Fetched ${fetchedRecords.length} records from page`
            );
            fetchedRecords.forEach((record) => {
              records.push({
                id: record.id,
                createdTime: record._rawJson.createdTime,
                fields: record.fields as T,
              });
            });
            fetchNextPage();
          },
          (err) => {
            if (err) {
              console.error("❌ Airtable error:", err);
              reject(err);
            } else {
              console.log(
                `✅ Successfully fetched ${records.length} total records`
              );
              resolve(records);
            }
          }
        );
    });
  },

  async insertRecord<T = any>(
    table: string,
    fields: T
  ): Promise<AirtableRecord<T>> {
    console.log(`📝 Inserting record into table: ${table}`);
    console.log(`📄 Fields:`, fields);

    return new Promise((resolve, reject) => {
      base(table).create(
        [
          {
            fields: fields as any,
          },
        ],
        (err: any, records: any) => {
          if (err) {
            console.error("❌ Airtable insert error:", err);
            reject(err);
          } else if (records && records.length > 0) {
            const record = records[0];
            console.log(
              `✅ Successfully inserted record with ID: ${record.id}`
            );
            resolve({
              id: record.id,
              createdTime: record._rawJson.createdTime,
              fields: record.fields as T,
            });
          } else {
            const error = new Error("No record was created");
            console.error("❌ Airtable insert error:", error);
            reject(error);
          }
        }
      );
    });
  },
};

// Legacy exports for backward compatibility
export const getAirtableRecords = AirtableClient.getRecords;
export const insertAirtableRecord = AirtableClient.insertRecord;

const fs = require("fs");
const path = require("path");
const Airtable = require("airtable");

// This script runs during build time to fetch catalog data from Airtable
// and generate a static JSON file that can be imported by the application

const airtableConfig = {
  apiKey:
    process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  baseUrl: "https://api.airtable.com/v0",
};

async function fetchCatalogData() {
  try {
    console.log("🔄 Fetching catalog data from Airtable...");

    // Get environment variables
    const apiKey = airtableConfig.apiKey;
    const baseId = airtableConfig.baseId;

    if (!apiKey || !baseId) {
      console.warn(
        "⚠️ Missing Airtable environment variables: AIRTABLE_API_KEY and AIRTABLE_BASE_ID"
      );
      console.log("📝 Creating empty catalog data file...");

      // Create empty catalog data
      const catalogData = [];

      // Create the output directory if it doesn't exist
      const outputDir = path.join(__dirname, "../src/data");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write empty catalog data to a JSON file
      const outputPath = path.join(outputDir, "catalog.json");
      fs.writeFileSync(outputPath, JSON.stringify(catalogData, null, 2));

      console.log(`✅ Empty catalog data written to ${outputPath}`);

      // Also generate a TypeScript declaration file for better type safety
      const dtsPath = path.join(outputDir, "catalog.d.ts");
      const dtsContent = `// Auto-generated catalog data types
import { CatalogItemFields } from '../services/catalog';

export const catalogData: CatalogItemFields[];
`;
      fs.writeFileSync(dtsPath, dtsContent);

      console.log(`✅ TypeScript declarations written to ${dtsPath}`);
      console.log(
        "💡 Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables to fetch real data"
      );

      return 0;
    }

    console.log("🔧 Airtable config check:", {
      hasApiKey: !!apiKey,
      hasBaseId: !!baseId,
      baseId: baseId,
    });

    // Initialize Airtable
    const base = new Airtable({ apiKey }).base(baseId);

    // Fetch all catalog records
    console.log("🔍 Fetching records from table: catalog");

    const records = await new Promise((resolve, reject) => {
      const allRecords = [];
      base("catalog")
        .select({})
        .eachPage(
          (fetchedRecords, fetchNextPage) => {
            console.log(
              `📄 Fetched ${fetchedRecords.length} records from page`
            );
            fetchedRecords.forEach((record) => {
              allRecords.push({
                id: record.id,
                createdTime: record._rawJson.createdTime,
                fields: record.fields,
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
                `✅ Successfully fetched ${allRecords.length} total records`
              );
              resolve(allRecords);
            }
          }
        );
    });

    // Transform to the format expected by the application
    const catalogData = records.map((record) => record.fields);

    console.log(`📊 Fetched ${catalogData.length} catalog items`);

    // Create the output directory if it doesn't exist
    const outputDir = path.join(__dirname, "../src/data");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the catalog data to a JSON file
    const outputPath = path.join(outputDir, "catalog.json");
    fs.writeFileSync(outputPath, JSON.stringify(catalogData, null, 2));

    console.log(`✅ Catalog data written to ${outputPath}`);

    // Also generate a TypeScript declaration file for better type safety
    const dtsPath = path.join(outputDir, "catalog.d.ts");
    const dtsContent = `// Auto-generated catalog data types
import { CatalogItemFields } from '../services/catalog';

export const catalogData: CatalogItemFields[];
`;
    fs.writeFileSync(dtsPath, dtsContent);

    console.log(`✅ TypeScript declarations written to ${dtsPath}`);

    return catalogData.length;
  } catch (error) {
    console.error("❌ Error fetching catalog data:", error);
    process.exit(1);
  }
}

// Run the script
fetchCatalogData();

const fs = require("fs");
const path = require("path");

// This script runs during build time to fetch catalog data from Airtable
// and generate a static JSON file that can be imported by the application

async function fetchCatalogData() {
  try {
    console.log("🔄 Fetching catalog data from Airtable...");

    // Import the Airtable client dynamically
    const { AirtableClient } = await import(
      "../src/data-sources/airtable/client.js"
    );

    // Fetch all catalog records
    const records = await AirtableClient.getRecords("catalog");

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

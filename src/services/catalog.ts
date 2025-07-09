import { AirtableClient } from "@/data-sources/airtable/client";

// DTO for catalog item fields from Airtable
export interface CatalogItemFields {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  availability: string;
  condition: string;
  price: number;
  pre_discount_price?: number;
  link: string;
  image_link: string;
  brand: string;
  category: string;
  type?: string;
}

// Full catalog item with Airtable record structure
export interface CatalogItem {
  id: string;
  createdTime: string;
  fields: CatalogItemFields;
}

// Catalog Service Class
export class CatalogService {
  static async getAll(): Promise<CatalogItemFields[]> {
    try {
      console.log("🔍 CatalogService.getAll() called");
      const records = await AirtableClient.getRecords<CatalogItemFields>(
        "catalog"
      );
      console.log("📊 Records received from Airtable:", records);
      return records.map((record) => record.fields);
    } catch (error) {
      console.error("Error fetching catalog items:", error);
      throw error;
    }
  }

  static async getByCategory(category: string): Promise<CatalogItemFields[]> {
    try {
      const records = await AirtableClient.getRecords<CatalogItemFields>(
        "catalog",
        {
          filterByFormula: `{category} = '${category}'`,
        }
      );
      return records.map((record) => record.fields);
    } catch (error) {
      console.error(
        `Error fetching catalog items for category ${category}:`,
        error
      );
      throw error;
    }
  }

  static async getById(itemId: string): Promise<CatalogItemFields | null> {
    try {
      const records = await AirtableClient.getRecords<CatalogItemFields>(
        "catalog",
        {
          filterByFormula: `{id} = '${itemId}'`,
        }
      );
      return records.length > 0 ? records[0].fields : null;
    } catch (error) {
      console.error(`Error fetching catalog item with id ${itemId}:`, error);
      throw error;
    }
  }

  static async getInStock(): Promise<CatalogItemFields[]> {
    try {
      const records = await AirtableClient.getRecords<CatalogItemFields>(
        "catalog",
        {
          filterByFormula: `{availability} = 'in stock'`,
        }
      );
      return records.map((record) => record.fields);
    } catch (error) {
      console.error("Error fetching in-stock items:", error);
      throw error;
    }
  }
}

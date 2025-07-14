import { AirtableClient } from "@/data-sources/airtable/client";
import { CacheService } from "./cache";

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
  image_2_link?: string;
  image_3_link?: string;
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
  // Initialize cache with build-time data when the service is first used
  private static initialized = false;

  private static initialize() {
    if (!this.initialized) {
      CacheService.initializeWithBuildData();
      this.initialized = true;
    }
  }

  static async getAll(): Promise<CatalogItemFields[]> {
    try {
      console.log("🔍 CatalogService.getAll() called");

      // Initialize cache with build data if not done yet
      this.initialize();

      // Check cache first
      const cachedData = CacheService.getAll();
      if (cachedData) {
        console.log("📦 Returning cached catalog data");
        return cachedData;
      }

      // Fetch from API if not in cache
      console.log("🌐 Fetching catalog data from API");
      const records = await AirtableClient.getRecords<CatalogItemFields>(
        "catalog"
      );
      console.log("📊 Records received from Airtable:", records);

      const items = records.map((record) => record.fields);

      // Store in cache
      CacheService.setAll(items);
      console.log("💾 Catalog data cached");

      return items;
    } catch (error) {
      console.error("Error fetching catalog items:", error);
      throw error;
    }
  }

  static async getByCategory(category: string): Promise<CatalogItemFields[]> {
    try {
      console.log(`🔍 CatalogService.getByCategory(${category}) called`);

      // Initialize cache with build data if not done yet
      this.initialize();

      // Check cache first - filter all cached items by category
      const cachedData = CacheService.getAll();
      if (cachedData) {
        const filteredItems = cachedData.filter(
          (item) => item.category === category
        );
        if (filteredItems.length > 0) {
          console.log(
            `📦 Returning ${filteredItems.length} cached items for category: ${category}`
          );
          return filteredItems;
        }
      }

      // Fetch from API if not in cache or category not found
      console.log(`🌐 Fetching items for category ${category} from API`);
      const records = await AirtableClient.getRecords<CatalogItemFields>(
        "catalog",
        {
          filterByFormula: `{category} = '${category}'`,
        }
      );

      const items = records.map((record) => record.fields);

      // Note: We don't cache filtered results separately since they're already in the main cache
      // The filtered results will be available from the main cache on subsequent calls

      return items;
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
      console.log(`🔍 CatalogService.getById(${itemId}) called`);

      // Initialize cache with build data if not done yet
      this.initialize();

      // Check cache first
      const cachedItem = CacheService.getById(itemId);
      if (cachedItem) {
        console.log(`📦 Returning cached item: ${itemId}`);
        return cachedItem;
      }

      // Fetch from API if not in cache
      console.log(`🌐 Fetching item ${itemId} from API`);
      const records = await AirtableClient.getRecords<CatalogItemFields>(
        "catalog",
        {
          filterByFormula: `{id} = '${itemId}'`,
        }
      );

      const item = records.length > 0 ? records[0].fields : null;

      // Store in cache if found
      if (item) {
        CacheService.setById(itemId, item);
        console.log(`💾 Item ${itemId} cached`);
      }

      return item;
    } catch (error) {
      console.error(`Error fetching catalog item with id ${itemId}:`, error);
      throw error;
    }
  }

  static async getInStock(): Promise<CatalogItemFields[]> {
    try {
      console.log("🔍 CatalogService.getInStock() called");

      // Initialize cache with build data if not done yet
      this.initialize();

      // Check cache first - filter all cached items by availability
      const cachedData = CacheService.getAll();
      if (cachedData) {
        const inStockItems = cachedData.filter(
          (item) => item.availability === "in stock"
        );
        if (inStockItems.length > 0) {
          console.log(
            `📦 Returning ${inStockItems.length} cached in-stock items`
          );
          return inStockItems;
        }
      }

      // Fetch from API if not in cache
      console.log("🌐 Fetching in-stock items from API");
      const records = await AirtableClient.getRecords<CatalogItemFields>(
        "catalog",
        {
          filterByFormula: `{availability} = 'in stock'`,
        }
      );

      const items = records.map((record) => record.fields);

      // Note: We don't cache filtered results separately since they're already in the main cache
      // The filtered results will be available from the main cache on subsequent calls

      return items;
    } catch (error) {
      console.error("Error fetching in-stock items:", error);
      throw error;
    }
  }

  /**
   * Clear all cached catalog data
   */
  static clearCache(): void {
    CacheService.clearAll();
    console.log("🗑️ Catalog cache cleared");
  }

  /**
   * Clear cache for a specific item
   */
  static clearItemCache(itemId: string): void {
    CacheService.clearById(itemId);
    console.log(`🗑️ Cache cleared for item: ${itemId}`);
  }
}

import { CatalogItemFields } from "./catalog";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class CacheService {
  private static readonly CATALOG_CACHE_KEY = "wildink_catalog_cache";
  private static readonly CATALOG_ITEM_CACHE_PREFIX = "wildink_catalog_item_";
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private static readonly BUILD_DATA_TTL = 365 * 24 * 60 * 60 * 1000; // 1 year for build data

  /**
   * Get all catalog items from cache
   */
  static getAll(): CatalogItemFields[] | null {
    try {
      const cached = localStorage.getItem(this.CATALOG_CACHE_KEY);
      if (!cached) return null;

      const entry: CacheEntry<CatalogItemFields[]> = JSON.parse(cached);

      // Check if cache is expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.clearAll();
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  }

  /**
   * Get a specific catalog item by ID from cache
   */
  static getById(itemId: string): CatalogItemFields | null {
    try {
      const cacheKey = `${this.CATALOG_ITEM_CACHE_PREFIX}${itemId}`;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const entry: CacheEntry<CatalogItemFields> = JSON.parse(cached);

      // Check if cache is expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.clearById(itemId);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error(`Error reading item ${itemId} from cache:`, error);
      return null;
    }
  }

  /**
   * Store all catalog items in cache
   */
  static setAll(
    items: CatalogItemFields[],
    ttl: number = this.DEFAULT_TTL
  ): void {
    try {
      const entry: CacheEntry<CatalogItemFields[]> = {
        data: items,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(this.CATALOG_CACHE_KEY, JSON.stringify(entry));
    } catch (error) {
      console.error("Error writing to cache:", error);
    }
  }

  /**
   * Store a specific catalog item in cache
   */
  static setById(
    itemId: string,
    item: CatalogItemFields,
    ttl: number = this.DEFAULT_TTL
  ): void {
    try {
      const cacheKey = `${this.CATALOG_ITEM_CACHE_PREFIX}${itemId}`;
      const entry: CacheEntry<CatalogItemFields> = {
        data: item,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.error(`Error writing item ${itemId} to cache:`, error);
    }
  }

  /**
   * Clear all catalog cache
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(this.CATALOG_CACHE_KEY);

      // Clear individual item caches
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.CATALOG_ITEM_CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  /**
   * Clear cache for a specific item
   */
  static clearById(itemId: string): void {
    try {
      const cacheKey = `${this.CATALOG_ITEM_CACHE_PREFIX}${itemId}`;
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error(`Error clearing cache for item ${itemId}:`, error);
    }
  }

  /**
   * Check if cache has data
   */
  static hasData(): boolean {
    return this.getAll() !== null;
  }

  /**
   * Check if cache has a specific item
   */
  static hasItem(itemId: string): boolean {
    return this.getById(itemId) !== null;
  }

  /**
   * Pre-populate cache with build-time data (long TTL)
   */
  static prePopulateWithBuildData(items: CatalogItemFields[]): void {
    try {
      console.log(
        `🏗️ Pre-populating cache with ${items.length} build-time items`
      );

      // Store all items with long TTL
      this.setAll(items, this.BUILD_DATA_TTL);

      // Also store individual items for faster lookups
      items.forEach((item) => {
        this.setById(item.id, item, this.BUILD_DATA_TTL);
      });

      console.log("✅ Build-time data pre-populated in cache");
    } catch (error) {
      console.error("Error pre-populating cache with build data:", error);
    }
  }

  /**
   * Initialize cache with build-time data if available
   */
  static initializeWithBuildData(): void {
    try {
      // Try to import build-time data
      import("../data/catalog.json")
        .then(({ default: buildData }) => {
          if (buildData && buildData.length > 0) {
            this.prePopulateWithBuildData(buildData);
          }
        })
        .catch(() => {
          console.log(
            "📝 No build-time catalog data found, will use API calls"
          );
        });
    } catch (error) {
      console.log("📝 No build-time catalog data available");
    }
  }
}

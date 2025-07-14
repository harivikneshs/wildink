# Catalog Caching System

This document explains how the catalog caching system works to minimize API calls to Airtable.

## Overview

Since Airtable data changes very rarely, we've implemented a build-time caching system that:

1. **Fetches catalog data during build/deployment** - No runtime API calls needed
2. **Pre-populates the cache** - Data is immediately available on first load
3. **Uses long TTL** - Build data stays cached for 1 year
4. **Graceful fallback** - Falls back to API calls if build data isn't available

## How It Works

### Build Process

1. **Pre-build script runs**: `npm run build:catalog` fetches data from Airtable
2. **Data is saved**: Catalog data is written to `src/data/catalog.json`
3. **Application builds**: Next.js builds with the static data included
4. **Cache is pre-populated**: On first load, the cache is filled with build-time data

### Runtime Behavior

1. **First load**: Cache is initialized with build-time data (1 year TTL)
2. **Subsequent requests**: Data is served from cache, no API calls
3. **Fallback**: If build data isn't available, falls back to API calls

## Usage

### Normal Development

```bash
npm run dev
```

The app will use API calls during development since build data isn't generated.

### Production Build

```bash
npm run build
```

This automatically runs the catalog build script first, then builds the application.

### Manual Catalog Update

If you need to update catalog data without a full build:

```bash
npm run build:catalog
```

This will fetch fresh data from Airtable and update `src/data/catalog.json`.

## Deployment Workflow

1. **Update Airtable data** (when needed)
2. **Trigger deployment** - This will:
   - Run `npm run build:catalog` to fetch fresh data
   - Build the application with the new data
   - Deploy with pre-populated cache

## Benefits

- **Zero API calls** in production (after first load)
- **Faster page loads** - No waiting for API responses
- **Reduced costs** - Fewer Airtable API calls
- **Better reliability** - No dependency on Airtable availability
- **Automatic updates** - Fresh data on every deployment

## Cache Management

### Clear Cache

```typescript
import { CatalogService } from "@/services/catalog";

// Clear all cache
CatalogService.clearCache();

// Clear specific item
CatalogService.clearItemCache("item-id");
```

### Check Cache Status

```typescript
import { CacheService } from "@/services/cache";

// Check if cache has data
const hasData = CacheService.hasData();

// Check if specific item is cached
const hasItem = CacheService.hasItem("item-id");
```

## Configuration

### TTL Settings

- **Build data TTL**: 1 year (365 days)
- **API data TTL**: 5 minutes
- **Individual items**: Cached separately for faster lookups

### Environment Variables

The build script uses the same environment variables as the runtime Airtable client:

- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`

## Troubleshooting

### Build Script Fails

If the build script fails to fetch data:

1. Check environment variables are set
2. Verify Airtable API key has correct permissions
3. Ensure the catalog table exists and is accessible

### No Build Data Available

If build data isn't available at runtime:

1. The app will fall back to API calls automatically
2. Check that `src/data/catalog.json` exists and has content
3. Verify the build script ran successfully

### Cache Not Working

If cache isn't working as expected:

1. Check browser localStorage is available
2. Verify cache keys are correct
3. Check for JavaScript errors in console

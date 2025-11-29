import { test, expect } from '@playwright/test';

test.describe('AOI Creation Map Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the sidebar with search input', async ({ page }) => {
    // Check sidebar header
    await expect(page.getByText('Define Area of Interest')).toBeVisible();
    
    // Check description text
    await expect(page.getByText(/Define the area\(s\)/)).toBeVisible();
    
    // Check search input
    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search for a city, town...');
  });

  test('should load the map container', async ({ page }) => {
    // Check map container is rendered
    const mapContainer = page.getByTestId('map-container');
    await expect(mapContainer).toBeVisible();
    
    // Check map has loaded (Leaflet adds specific classes)
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Check zoom controls are present
    await expect(page.locator('.leaflet-control-zoom')).toBeVisible();
  });

  test('should perform geocoding search and display results', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    
    // Type a search query
    await searchInput.fill('Cologne');
    
    // Wait for debounced search and results
    const searchResults = page.getByTestId('search-results');
    await expect(searchResults).toBeVisible({ timeout: 5000 });
    
    // Should have at least one result
    const resultItems = searchResults.locator('button');
    await expect(resultItems.first()).toBeVisible();
  });

  test('should toggle the WMS satellite layer', async ({ page }) => {
    const layerToggle = page.getByTestId('layer-toggle');
    
    // Initial state should show "Layers"
    await expect(layerToggle).toContainText('Layers');
    
    // Click to enable satellite layer
    await layerToggle.click();
    
    // Should now show "Satellite"
    await expect(layerToggle).toContainText('Satellite');
    
    // Click again to disable
    await layerToggle.click();
    
    // Should show "Layers" again
    await expect(layerToggle).toContainText('Layers');
  });

  test('should display shape upload button', async ({ page }) => {
    const uploadButton = page.getByTestId('shape-upload-button');
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toContainText('Uploading a shape file');
  });

  test('should show empty state in feature list', async ({ page }) => {
    // Clear localStorage first
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Should show empty state message
    await expect(page.getByText('No areas defined yet')).toBeVisible();
  });

  test('should display draw controls including polyline', async ({ page }) => {
    // Check that drawing toolbar is present
    await expect(page.locator('.leaflet-draw-toolbar')).toBeVisible();
    
    // Check for polyline draw button
    await expect(page.locator('.leaflet-draw-draw-polyline')).toBeVisible();
    
    // Check for polygon draw button
    await expect(page.locator('.leaflet-draw-draw-polygon')).toBeVisible();
    
    // Check for rectangle draw button
    await expect(page.locator('.leaflet-draw-draw-rectangle')).toBeVisible();
    
    // Check for circle draw button
    await expect(page.locator('.leaflet-draw-draw-circle')).toBeVisible();
  });
});

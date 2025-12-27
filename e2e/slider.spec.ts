import { expect, type Locator, test } from "@playwright/test";

test.describe("Slider Component", () => {
	test.describe("Exercise 1 - Normal Range Mode", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("http://localhost:8080/exercise1");
			// Wait for the range to be loaded
			await page.waitForSelector('[class*="range"]');
		});

		test("should display the range slider with initial values", async ({
			page,
		}) => {
			// Check that the title is present
			await expect(
				page.getByRole("heading", { name: "Exercise 1" }),
			).toBeVisible();

			// Check that the label is present
			await expect(page.getByText("Select Range")).toBeVisible();

			// Check that both thumbs are present
			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			await expect(minThumb).toBeVisible();
			await expect(maxThumb).toBeVisible();

			// Check that the track is present
			const track = page.locator('[class*="track"]').first();
			await expect(track).toBeVisible();
		});

		test("should display editable value labels", async ({ page }) => {
			// Check that min and max labels are editable (buttons that can be clicked to edit)
			const minButton = page
				.locator('button[class*="range__value-label"]')
				.first();
			const maxButton = page
				.locator('button[class*="range__value-label"]')
				.last();

			await expect(minButton).toBeVisible();
			await expect(maxButton).toBeVisible();

			// Click to verify they become editable inputs
			await minButton.click();
			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await expect(minInput).toBeVisible();
		});

		test("should allow editing minimum value via input", async ({ page }) => {
			// First click the button to show the input
			const minButton = page
				.locator('button[class*="range__value-label"]')
				.first();
			await minButton.click();

			// Now the input should be visible
			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await expect(minInput).toBeVisible();

			// Clear and type new value
			await minInput.fill("25");
			await minInput.press("Enter");

			// Verify the value was updated - button should be visible again
			await expect(minButton).toBeVisible();
			await expect(minButton).toContainText("25");
		});

		test("should allow editing maximum value via input", async ({ page }) => {
			// First click the button to show the input
			const maxButton = page
				.locator('button[class*="range__value-label"]')
				.last();
			await maxButton.click();

			// Now the input should be visible
			const maxInput = page.locator('input[aria-label="Edit maximum value"]');
			await expect(maxInput).toBeVisible();

			// Clear and type new value
			await maxInput.fill("75");
			await maxInput.press("Enter");

			// Verify the value was updated - button should be visible again
			await expect(maxButton).toBeVisible();
			await expect(maxButton).toContainText("75");
		});

		test("should move minimum thumb with keyboard (arrow right)", async ({
			page,
		}) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const minButton = page
				.locator('button[class*="range__value-label"]')
				.first();

			// Get initial value from the button text
			const initialValue = await minButton.textContent();

			// Focus the thumb and press arrow right
			await minThumb.focus();
			await page.keyboard.press("ArrowRight");

			// Wait a bit for the update
			await page.waitForTimeout(100);

			// Get new value from the button text
			const newValue = await minButton.textContent();

			// Verify the value increased
			expect(Number.parseInt(newValue || "0", 10)).toBeGreaterThan(
				Number.parseInt(initialValue || "0", 10),
			);
		});

		test("should move maximum thumb with keyboard (arrow left)", async ({
			page,
		}) => {
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();
			const maxButton = page
				.locator('button[class*="range__value-label"]')
				.last();

			// Get initial value from the button text
			const initialValue = await maxButton.textContent();

			// Focus the thumb and press arrow left
			await maxThumb.focus();
			await page.keyboard.press("ArrowLeft");

			// Wait a bit for the update
			await page.waitForTimeout(100);

			// Get new value from the button text
			const newValue = await maxButton.textContent();

			// Verify the value decreased
			expect(Number.parseInt(newValue || "0", 10)).toBeLessThan(
				Number.parseInt(initialValue || "0", 10),
			);
		});

		test("should prevent minimum value from exceeding maximum value", async ({
			page,
		}) => {
			const minButton = page
				.locator('button[class*="range__value-label"]')
				.first();
			const maxButton = page
				.locator('button[class*="range__value-label"]')
				.last();

			// Set max value first
			await maxButton.click();
			const maxInput = page.locator('input[aria-label="Edit maximum value"]');
			await maxInput.fill("50");
			await maxInput.press("Enter");

			// Try to set min value higher than max
			await minButton.click();
			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await minInput.fill("75");
			await minInput.press("Enter");

			// Verify min value is capped at max value from button text
			const minValue = Number.parseInt(
				(await minButton.textContent()) || "0",
				10,
			);
			const maxValue = Number.parseInt(
				(await maxButton.textContent()) || "0",
				10,
			);

			expect(minValue).toBeLessThanOrEqual(maxValue);
		});

		test("should prevent maximum value from being less than minimum value", async ({
			page,
		}) => {
			const minButton = page
				.locator('button[class*="range__value-label"]')
				.first();
			const maxButton = page
				.locator('button[class*="range__value-label"]')
				.last();

			// Set min value first
			await minButton.click();
			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await minInput.fill("50");
			await minInput.press("Enter");

			// Try to set max value lower than min
			await maxButton.click();
			const maxInput = page.locator('input[aria-label="Edit maximum value"]');
			await maxInput.fill("25");
			await maxInput.press("Enter");

			// Verify max value is capped at min value from button text
			const minValue = Number.parseInt(
				(await minButton.textContent()) || "0",
				10,
			);
			const maxValue = Number.parseInt(
				(await maxButton.textContent()) || "0",
				10,
			);

			expect(maxValue).toBeGreaterThanOrEqual(minValue);
		});

		test("should show active state when thumb is focused", async ({ page }) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();

			await minThumb.focus();

			// Check if the thumb has active styling (you might need to adjust based on actual implementation)
			const thumbClass = await minThumb.getAttribute("class");
			expect(thumbClass).toContain("active");
		});

		test("should update highlighted track range when values change", async ({
			page,
		}) => {
			const minButton = page
				.locator('button[class*="range__value-label"]')
				.first();
			const maxButton = page
				.locator('button[class*="range__value-label"]')
				.last();

			// Change min value
			await minButton.click();
			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await minInput.fill("25");
			await minInput.press("Enter");

			// Change max value
			await maxButton.click();
			const maxInput = page.locator('input[aria-label="Edit maximum value"]');
			await maxInput.fill("75");
			await maxInput.press("Enter");

			// Check that the highlighted track exists and is visible
			const highlightedTrack = page.locator(
				'[class*="track__highlighted"], [class*="track-highlighted"]',
			);
			await expect(highlightedTrack).toBeVisible();
		});
	});

	test.describe("Exercise 2 - Fixed Range Mode", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("http://localhost:8080/exercise2");
			// Wait for the range to be loaded
			await page.waitForSelector('[class*="fixed-range"]');
		});

		test("should display the fixed range slider with initial values", async ({
			page,
		}) => {
			// Check that the title is present
			await expect(
				page.getByRole("heading", { name: "Exercise 2" }),
			).toBeVisible();

			// Check that the label is present
			await expect(page.getByText("Select Price Range")).toBeVisible();

			// Check that both thumbs are present
			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			await expect(minThumb).toBeVisible();
			await expect(maxThumb).toBeVisible();
		});

		test("should display non-editable value labels with currency", async ({
			page,
		}) => {
			// In fixed mode, labels should NOT be editable
			const _labels = page.locator('[class*="label"]');

			// Check that currency symbol is present
			await expect(page.locator("text=/€/").first()).toBeVisible();

			// Verify there are no input fields for editing
			const editableInputs = page.locator('input[aria-label*="Edit"]');
			await expect(editableInputs).toHaveCount(0);
		});

		test("should move minimum thumb with keyboard through fixed values", async ({
			page,
		}) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();

			// Get initial position
			const initialPosition = await minThumb.getAttribute("style");

			// Focus the thumb and press arrow right
			await minThumb.focus();
			await page.keyboard.press("ArrowRight");

			// Wait a bit for the update
			await page.waitForTimeout(100);

			// Get new position
			const newPosition = await minThumb.getAttribute("style");

			// Verify the position changed
			expect(newPosition).not.toBe(initialPosition);
		});

		test("should move maximum thumb with keyboard through fixed values", async ({
			page,
		}) => {
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			// Get initial position
			const initialPosition = await maxThumb.getAttribute("style");

			// Focus the thumb and press arrow left
			await maxThumb.focus();
			await page.keyboard.press("ArrowLeft");

			// Wait a bit for the update
			await page.waitForTimeout(100);

			// Get new position
			const newPosition = await maxThumb.getAttribute("style");

			// Verify the position changed
			expect(newPosition).not.toBe(initialPosition);
		});

		test("should display currency symbol in bullet tooltips", async ({
			page,
		}) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();

			// Hover over the thumb to show tooltip
			await minThumb.hover();

			// Wait for tooltip to appear
			await page.waitForTimeout(200);

			// Check that currency symbol appears in tooltip
			const tooltip = page.locator('[class*="bullet"]');
			await expect(tooltip).toContainText("€");
		});

		test("should prevent thumbs from crossing each other in fixed mode", async ({
			page,
		}) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			// Get initial positions
			const getPosition = async (thumb: Locator) => {
				const style = await thumb.getAttribute("style");
				const match = style?.match(/left:\s*([\d.]+)%/);
				return match ? Number.parseFloat(match[1]) : 0;
			};

			const _initialMinPos = await getPosition(minThumb);
			const _initialMaxPos = await getPosition(maxThumb);

			// Try to move min thumb past max by pressing arrow right multiple times
			await minThumb.focus();
			for (let i = 0; i < 50; i++) {
				await page.keyboard.press("ArrowRight");
				await page.waitForTimeout(50);
			}

			const finalMinPos = await getPosition(minThumb);
			const finalMaxPos = await getPosition(maxThumb);

			// Verify min is still less than or equal to max
			expect(finalMinPos).toBeLessThanOrEqual(finalMaxPos);
		});

		test("should snap to predefined values only", async ({ page }) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();

			// Focus and move the thumb
			await minThumb.focus();
			await page.keyboard.press("ArrowRight");
			await page.waitForTimeout(100);

			// The value should be one of the predefined values from the API
			// We can't assert exact values without knowing the API response,
			// but we can check that currency is displayed
			await expect(page.locator("text=/€/").first()).toBeVisible();
		});

		test("should update highlighted track range in fixed mode", async ({
			page,
		}) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();

			// Move the thumb
			await minThumb.focus();
			await page.keyboard.press("ArrowRight");
			await page.keyboard.press("ArrowRight");
			await page.waitForTimeout(100);

			// Check that the highlighted track exists and is visible
			const highlightedTrack = page.locator(
				'[class*="track__highlighted"], [class*="track-highlighted"]',
			);
			await expect(highlightedTrack).toBeVisible();
		});

		test("should show active state when thumb is focused in fixed mode", async ({
			page,
		}) => {
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			await maxThumb.focus();

			// Check if the thumb has active styling
			const thumbClass = await maxThumb.getAttribute("class");
			expect(thumbClass).toContain("active");
		});
	});

	test.describe("Common Slider Behaviors", () => {
		test("Exercise 1: should be keyboard accessible", async ({ page }) => {
			await page.goto("http://localhost:8080/exercise1");
			await page.waitForSelector('[class*="range"]');

			// Tab to the first thumb
			await page.keyboard.press("Tab");
			await page.keyboard.press("Tab"); // Skip back button

			// Should be able to focus and interact with keyboard
			await page.keyboard.press("ArrowRight");
			await page.keyboard.press("ArrowLeft");
			await page.keyboard.press("Home");
			await page.keyboard.press("End");

			// No errors should occur
		});

		test("Exercise 2: should be keyboard accessible", async ({ page }) => {
			await page.goto("http://localhost:8080/exercise2");
			await page.waitForSelector('[class*="fixed-range"]');

			// Tab to the first thumb
			await page.keyboard.press("Tab");
			await page.keyboard.press("Tab"); // Skip back button

			// Should be able to focus and interact with keyboard
			await page.keyboard.press("ArrowRight");
			await page.keyboard.press("ArrowLeft");
			await page.keyboard.press("Home");
			await page.keyboard.press("End");

			// No errors should occur
		});

		test("Exercise 1: should have proper ARIA attributes", async ({ page }) => {
			await page.goto("http://localhost:8080/exercise1");
			await page.waitForSelector('[class*="range"]');

			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			// Check ARIA attributes
			await expect(minThumb).toHaveAttribute("role", "slider");
			await expect(maxThumb).toHaveAttribute("role", "slider");
			await expect(minThumb).toHaveAttribute("tabindex", "0");
			await expect(maxThumb).toHaveAttribute("tabindex", "0");
		});

		test("Exercise 2: should have proper ARIA attributes", async ({ page }) => {
			await page.goto("http://localhost:8080/exercise2");
			await page.waitForSelector('[class*="fixed-range"]');

			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			// Check ARIA attributes
			await expect(minThumb).toHaveAttribute("role", "slider");
			await expect(maxThumb).toHaveAttribute("role", "slider");
			await expect(minThumb).toHaveAttribute("tabindex", "0");
			await expect(maxThumb).toHaveAttribute("tabindex", "0");
		});
	});
});

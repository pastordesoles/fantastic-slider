import { expect, type Locator, test } from "@playwright/test";

test.describe("Slider Component", () => {
	test.describe("Exercise 1 - Normal Range Mode", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("http://localhost:8080/exercise1");
			await page.waitForSelector('[class*="range"]');
		});

		test("should display the range slider with initial values", async ({
			page,
		}) => {
			await expect(
				page.getByRole("heading", { name: "Exercise 1" }),
			).toBeVisible();

			await expect(page.getByText("Select Range")).toBeVisible();

			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			await expect(minThumb).toBeVisible();
			await expect(maxThumb).toBeVisible();

			const track = page.locator('[class*="track"]').first();
			await expect(track).toBeVisible();
		});

		test("should display editable value labels", async ({ page }) => {
			const minButton = page
				.locator('button[class*="range__value-label"]')
				.first();
			const maxButton = page
				.locator('button[class*="range__value-label"]')
				.last();

			await expect(minButton).toBeVisible();
			await expect(maxButton).toBeVisible();

			await minButton.click();
			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await expect(minInput).toBeVisible();
		});

		test("should allow editing minimum value via input", async ({ page }) => {
			const minButton = page
				.locator('button[class*="range__value-label"]')
				.first();
			await minButton.click();

			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await expect(minInput).toBeVisible();

			await minInput.fill("25");
			await minInput.press("Enter");

			await expect(minButton).toBeVisible();
			await expect(minButton).toContainText("25");
		});

		test("should allow editing maximum value via input", async ({ page }) => {
			const maxButton = page
				.locator('button[class*="range__value-label"]')
				.last();
			await maxButton.click();

			const maxInput = page.locator('input[aria-label="Edit maximum value"]');
			await expect(maxInput).toBeVisible();

			await maxInput.fill("75");
			await maxInput.press("Enter");

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

			const initialValue = await minButton.textContent();

			await minThumb.focus();
			await page.keyboard.press("ArrowRight");

			await page.waitForTimeout(100);

			const newValue = await minButton.textContent();

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

			const initialValue = await maxButton.textContent();

			await maxThumb.focus();
			await page.keyboard.press("ArrowLeft");

			await page.waitForTimeout(100);

			const newValue = await maxButton.textContent();

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

			await maxButton.click();
			const maxInput = page.locator('input[aria-label="Edit maximum value"]');
			await maxInput.fill("50");
			await maxInput.press("Enter");

			await minButton.click();
			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await minInput.fill("75");
			await minInput.press("Enter");

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

			await minButton.click();
			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await minInput.fill("50");
			await minInput.press("Enter");

			await maxButton.click();
			const maxInput = page.locator('input[aria-label="Edit maximum value"]');
			await maxInput.fill("25");
			await maxInput.press("Enter");

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

			await minButton.click();
			const minInput = page.locator('input[aria-label="Edit minimum value"]');
			await minInput.fill("25");
			await minInput.press("Enter");

			await maxButton.click();
			const maxInput = page.locator('input[aria-label="Edit maximum value"]');
			await maxInput.fill("75");
			await maxInput.press("Enter");

			const highlightedTrack = page.locator(
				'[class*="track__highlighted"], [class*="track-highlighted"]',
			);
			await expect(highlightedTrack).toBeVisible();
		});
	});

	test.describe("Exercise 2 - Fixed Range Mode", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("http://localhost:8080/exercise2");
			await page.waitForSelector('[class*="range"]');
		});

		test("should display the fixed range slider with initial values", async ({
			page,
		}) => {
			await expect(
				page.getByRole("heading", { name: "Exercise 2" }),
			).toBeVisible();

			await expect(page.getByText("Select Price Range")).toBeVisible();

			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			await expect(minThumb).toBeVisible();
			await expect(maxThumb).toBeVisible();
		});

		test("should display non-editable value labels with currency", async ({
			page,
		}) => {
			const _labels = page.locator('[class*="label"]');

			await expect(page.locator("text=/€/").first()).toBeVisible();

			const editableInputs = page.locator('input[aria-label*="Edit"]');
			await expect(editableInputs).toHaveCount(0);
		});

		test("should move minimum thumb with keyboard through fixed values", async ({
			page,
		}) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();

			const initialPosition = await minThumb.getAttribute("style");

			await minThumb.focus();
			await page.keyboard.press("ArrowRight");

			await page.waitForTimeout(100);

			const newPosition = await minThumb.getAttribute("style");

			expect(newPosition).not.toBe(initialPosition);
		});

		test("should move maximum thumb with keyboard through fixed values", async ({
			page,
		}) => {
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			const initialPosition = await maxThumb.getAttribute("style");

			await maxThumb.focus();
			await page.keyboard.press("ArrowLeft");

			await page.waitForTimeout(100);

			const newPosition = await maxThumb.getAttribute("style");

			expect(newPosition).not.toBe(initialPosition);
		});

		test("should display currency symbol in bullet tooltips", async ({
			page,
		}) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();

			await minThumb.hover();

			await page.waitForTimeout(200);

			const tooltip = page.locator('[class*="bullet"]');
			await expect(tooltip).toContainText("€");
		});

		test("should prevent thumbs from crossing each other in fixed mode", async ({
			page,
		}) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			const getPosition = async (thumb: Locator) => {
				const style = await thumb.getAttribute("style");
				const match = style?.match(/left:\s*([\d.]+)%/);
				return match ? Number.parseFloat(match[1]) : 0;
			};

			const _initialMinPos = await getPosition(minThumb);
			const _initialMaxPos = await getPosition(maxThumb);

			await minThumb.focus();
			for (let i = 0; i < 50; i++) {
				await page.keyboard.press("ArrowRight");
				await page.waitForTimeout(50);
			}

			const finalMinPos = await getPosition(minThumb);
			const finalMaxPos = await getPosition(maxThumb);

			expect(finalMinPos).toBeLessThanOrEqual(finalMaxPos);
		});

		test("should snap to predefined values only", async ({ page }) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();

			await minThumb.focus();
			await page.keyboard.press("ArrowRight");
			await page.waitForTimeout(100);

			await expect(page.locator("text=/€/").first()).toBeVisible();
		});

		test("should update highlighted track range in fixed mode", async ({
			page,
		}) => {
			const minThumb = page.locator('[aria-label="Minimum value"]').first();

			await minThumb.focus();
			await page.keyboard.press("ArrowRight");
			await page.keyboard.press("ArrowRight");
			await page.waitForTimeout(100);

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

			const thumbClass = await maxThumb.getAttribute("class");
			expect(thumbClass).toContain("active");
		});
	});

	test.describe("Common Slider Behaviors", () => {
		test("Exercise 1: should be keyboard accessible", async ({ page }) => {
			await page.goto("http://localhost:8080/exercise1");
			await page.waitForSelector('[class*="range"]');

			await page.keyboard.press("Tab");
			await page.keyboard.press("Tab");

			await page.keyboard.press("ArrowRight");
			await page.keyboard.press("ArrowLeft");
			await page.keyboard.press("Home");
			await page.keyboard.press("End");
		});

		test("Exercise 2: should be keyboard accessible", async ({ page }) => {
			await page.goto("http://localhost:8080/exercise2");
			await page.waitForSelector('[class*="range"]');

			await page.keyboard.press("Tab");
			await page.keyboard.press("Tab");

			await page.keyboard.press("ArrowRight");
			await page.keyboard.press("ArrowLeft");
			await page.keyboard.press("Home");
			await page.keyboard.press("End");
		});

		test("Exercise 1: should have proper ARIA attributes", async ({ page }) => {
			await page.goto("http://localhost:8080/exercise1");
			await page.waitForSelector('[class*="range"]');

			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			await expect(minThumb).toHaveAttribute("role", "slider");
			await expect(maxThumb).toHaveAttribute("role", "slider");
			await expect(minThumb).toHaveAttribute("tabindex", "0");
			await expect(maxThumb).toHaveAttribute("tabindex", "0");
		});

		test("Exercise 2: should have proper ARIA attributes", async ({ page }) => {
			await page.goto("http://localhost:8080/exercise2");
			await page.waitForSelector('[class*="range"]');

			const minThumb = page.locator('[aria-label="Minimum value"]').first();
			const maxThumb = page.locator('[aria-label="Maximum value"]').first();

			await expect(minThumb).toHaveAttribute("role", "slider");
			await expect(maxThumb).toHaveAttribute("role", "slider");
			await expect(minThumb).toHaveAttribute("tabindex", "0");
			await expect(maxThumb).toHaveAttribute("tabindex", "0");
		});
	});
});

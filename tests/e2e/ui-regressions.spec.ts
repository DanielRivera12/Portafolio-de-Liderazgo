import { expect, test, type Page } from '@playwright/test';

async function useTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
}

test.describe('theme and navigation regressions', () => {
  test('theme toggle updates page, navbar, cards, and footer colors', async ({ page }) => {
    await useTheme(page, 'dark');
    await page.goto('/');

    const body = page.locator('body');
    const navbar = page.locator('header');
    const featureCard = page.locator('#features .glass-panel').first();
    const footer = page.locator('footer');

    const darkBodyColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
    const darkFooterColor = await footer.evaluate((el) => getComputedStyle(el).backgroundColor);

    await page.locator('[data-theme-toggle]:visible').first().click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    await expect
      .poll(() => body.evaluate((el) => getComputedStyle(el).backgroundColor))
      .not.toBe(darkBodyColor);
    await expect
      .poll(() => footer.evaluate((el) => getComputedStyle(el).backgroundColor))
      .not.toBe(darkFooterColor);

    await expect(navbar).toBeVisible();
    await expect(featureCard).toBeVisible();
  });

  test('theme toggle remains clickable after scrolling', async ({ page }) => {
    await useTheme(page, 'light');
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));

    const toggle = page.locator('[data-theme-toggle]:visible').first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('theme stays dark on pricing route', async ({ page }) => {
    await useTheme(page, 'dark');
    await page.goto('/pricing/');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('pricing page section links target homepage anchors', async ({ page }) => {
    await page.goto('/pricing/');

    await expect(page.locator('header nav a', { hasText: 'Features' })).toHaveAttribute('href', '/#features');
    await expect(page.locator('header nav a', { hasText: 'Testimonials' })).toHaveAttribute('href', '/#testimonials');
    await expect(page.locator('header nav a', { hasText: 'Pricing' })).toHaveAttribute('href', '/pricing/');
  });
});

test.describe('search modal regressions', () => {
  test('search results stay sharp and readable over blurred backdrop', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[onclick="window.toggleCommandPalette()"]:visible').first().click();
    await page.locator('#search-input').fill('zenix');

    const palette = page.locator('#command-palette > div').nth(1);
    const backdrop = page.locator('[data-command-backdrop]');
    const result = page.locator('#search-results li').first();

    await expect(result).toBeVisible();
    await expect(result).toContainText(/Zenix/i);
    await expect(backdrop).toHaveCSS('backdrop-filter', /blur/);
    await expect(palette).toHaveCSS('filter', 'none');
  });
});

test.describe('blog regressions', () => {
  test('blog detail renders author once with fallback avatar and balanced callouts', async ({ page }) => {
    await page.goto('/blog/introducing-zenix/');

    const authorName = page.getByText('Mochammad Farros F. R.');
    await expect(authorName).toHaveCount(2);

    const headerAuthor = page.locator('article').getByRole('link', { name: /Mochammad Farros F\. R\./ });
    await expect(headerAuthor).toBeVisible();
    await expect(headerAuthor).toContainText('MF');

    const authorCard = page.locator('text=About Author').locator('..');
    await expect(authorCard).toContainText('MF');
    await expect(authorCard).toContainText('Founder & Lead Developer');

    const callout = page.getByText('The Zenix Philosophy').locator('..').locator('..');
    const content = page.locator('.prose').first();
    const calloutBox = await callout.boundingBox();
    const contentBox = await content.boundingBox();
    expect(calloutBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    expect(calloutBox!.x).toBeGreaterThanOrEqual(contentBox!.x - 1);
    expect(calloutBox!.x + calloutBox!.width).toBeLessThanOrEqual(contentBox!.x + contentBox!.width + 1);
  });

  test('blog listing author metadata does not render broken image alt text', async ({ page }) => {
    await page.goto('/blog/');

    const cardMeta = page.locator('article').first().locator('div').first();
    await expect(cardMeta).toContainText('Mochammad Farros F. R.');
    await expect(cardMeta).toContainText('MF');
  });
});

test.describe('layout regressions', () => {
  test('footer newsletter form does not overlap footer columns', async ({ page, isMobile }) => {
    await page.goto('/');

    const input = page.locator('footer input[type="email"]');
    const button = page.locator('footer button[type="submit"]');
    const productHeading = page.locator('footer h3', { hasText: 'Product' });

    await expect(input).toBeVisible();
    await expect(button).toBeVisible();
    await expect(productHeading).toBeVisible();

    const inputBox = await input.boundingBox();
    const buttonBox = await button.boundingBox();
    const productBox = await productHeading.boundingBox();
    expect(inputBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();
    expect(productBox).not.toBeNull();

    if (isMobile) {
      const formBottom = Math.max(inputBox!.y + inputBox!.height, buttonBox!.y + buttonBox!.height);
      expect(formBottom).toBeLessThan(productBox!.y);
    } else {
      const formRight = Math.max(inputBox!.x + inputBox!.width, buttonBox!.x + buttonBox!.width);
      expect(formRight).toBeLessThan(productBox!.x);
    }
  });

  test('feature cards do not clip their text in light mode', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Feature clipping check targets tablet/desktop grid behavior.');

    await useTheme(page, 'light');
    await page.goto('/');

    for (const card of await page.locator('#features .glass-panel').all()) {
      const clipped = await card.evaluate((el) => el.scrollHeight > el.clientHeight + 1);
      expect(clipped).toBe(false);
    }
  });

  test('homepage feature cards do not overlap at iPad width', async ({ page, isMobile }) => {
    test.skip(isMobile, 'iPad layout check targets tablet/desktop grid behavior.');

    await useTheme(page, 'light');
    await page.goto('/');

    const cards = await page.locator('#features .glass-panel').all();
    const boxes = [];
    for (const card of cards) {
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      boxes.push(box!);
    }

    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i];
        const b = boxes[j];
        const overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
        const overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
        expect(overlapX * overlapY).toBe(0);
      }
    }
  });
});

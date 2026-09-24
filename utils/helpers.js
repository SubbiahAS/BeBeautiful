/**
 * utils/helpers.js
 * Reusable Playwright helper functions for all sites
 * 100% shared - never imports from sites/
 */

/**
 * Safely check if an element is visible on the page.
 * Returns true/false without throwing.
 */
async function isVisible(page, selector, timeout = 5000) {
	try {
		await page.waitForSelector(selector, { state: 'visible', timeout });
		return true;
	} catch {
		return false;
	}
}

/**
 * Safely get the count of elements matching a selector.
 */
async function getCount(page, selector) {
	try {
		return await page.locator(selector).count();
	} catch {
		return 0;
	}
}

/**
 * Try multiple selectors, return first one that matches.
 */
async function findFirst(page, selectors, timeout = 5000) {
	const selectorList = Array.isArray(selectors) ? selectors : selectors.split(', ');
	for (const sel of selectorList) {
		try {
			const el = page.locator(sel).first();
			await el.waitFor({ state: 'visible', timeout });
			return el;
		} catch {
			// try next
		}
	}
	return null;
}

/**
 * Scroll element into view.
 */
async function scrollTo(page, selector) {
	try {
		await page.locator(selector).first().scrollIntoViewIfNeeded();
		await page.waitForTimeout(500);
	} catch {
		// ignore
	}
}

/**
 * Safe click - scrolls into view then clicks.
 */
async function safeClick(page, selector) {
	const el = page.locator(selector).first();
	await el.scrollIntoViewIfNeeded();
	await el.click();
}

/**
 * Wait for navigation and return new URL.
 */
async function clickAndWaitForNav(page, selector) {
	await Promise.all([
		page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => { }),
		page.locator(selector).first().click(),
	]);
	return page.url();
}

/**
 * Get text content of first matching element.
 */
async function getText(page, selector) {
	try {
		return await page.locator(selector).first().innerText();
	} catch {
		return '';
	}
}

/**
 * Check URL changed away from original.
 */
async function urlChanged(page, originalUrl, timeout = 8000) {
	try {
		await page.waitForFunction(
			(orig) => window.location.href !== orig,
			originalUrl,
			{ timeout }
		);
		return true;
	} catch {
		return false;
	}
}

// New Helper functions

// textExists() helper
async function textExists(page, texts) {
	const list = Array.isArray(texts) ? texts : [texts];

	for (const text of list) {
		try {
			const exact = await page
				.getByText(text, { exact: true })
				.first()
				.isVisible();

			if (exact) return true;
		} catch { }

		try {
			const partial = await page
				.getByText(text, { exact: false })
				.first()
				.isVisible();

			if (partial) return true;
		} catch { }
	}

	try {
		const body = await page.locator('body').innerText();

		return list.some(text =>
			body.toLowerCase().includes(text.toLowerCase())
		);
	} catch {
		return false;
	}
}

// validateTextWithFallback()
async function validateTextWithFallback(
	page,
	texts,
	timeout = 3000
) {
	return await textExists(page, texts);
}

// findValidationError()
async function findValidationError(
	page,
	selectors,
	timeout = 3000
) {
	for (const sel of selectors) {
		try {
			const visible = await isVisible(
				page,
				sel,
				timeout
			);

			if (visible) {
				return {
					found: true,
					selector: sel,
					text: await getText(page, sel)
				};
			}
		} catch { }
	}

	return {
		found: false,
		selector: null,
		text: ''
	};
}

// verifyNumericOnlyField()
async function verifyNumericOnlyField(
	locator,
	invalidValue
) {
	await locator.fill(invalidValue);

	const value = await locator.inputValue();

	return value === '' || value !== invalidValue;
}

// validateVisualPanel()
async function validateVisualPanel(
	page,
	selectors
) {
	const list = Array.isArray(selectors) ? selectors : [selectors];

	for (const sel of list) {
		if (await isVisible(page, sel)) {
			return true;
		}
	}

	return false;
}

async function handleCookieBanner(page) {
	try {
		const banner = page.locator('#onetrust-banner-sdk');

		// Wait up to ~5s for delayed banner rendering
		for (let attempt = 0; attempt < 10; attempt++) {
			const bannerVisible = await banner
				.isVisible()
				.catch(() => false);

			// Banner not present yet
			if (!bannerVisible) {
				await page.waitForTimeout(500);
				continue;
			}
			console.log('🍪 Cookie banner detected');
			const acceptButton = page.locator(
				'#onetrust-accept-btn-handler'
			);

			const buttonVisible = await acceptButton
				.isVisible()
				.catch(() => false);

			// Banner exists but no dismiss button
			if (!buttonVisible) {
				console.log(
					'⚠️ Cookie banner visible but no dismiss button found'
				);

				// Smart wait for auto-dismiss
				for (let autoAttempt = 0; autoAttempt < 6; autoAttempt++) {
					await page.waitForTimeout(500);
					const stillVisible = await banner
						.isVisible()
						.catch(() => false);

					// Banner auto-dismissed
					if (!stillVisible) {
						console.log(
							'✓ Cookie banner auto-dismissed'
						);
						return true;
					}
				}

				console.log(
					'⚠️ Cookie banner remained visible without dismiss button'
				);
				return false;
			}

			// Click dismiss button
			const clicked = await acceptButton
				.click({
					force: true,
					timeout: 5000
				})
				.then(() => true)
				.catch((err) => {

					console.log(
						`⚠️ Cookie accept click failed: ${err.message}`
					);
					return false;

				});
			if (!clicked) {
				return false;
			}

			console.log('✓ Cookie banner handled');
			return true;

		}
		console.log('ℹ️ No cookie banner detected');
		return false;

	} catch (err) {
		console.log(`⚠️ Cookie handling failed: ${err.message}`);
		return false;
	}
}

async function stabilizePage(page) {
	try {
		console.log('🔄 Stabilizing page for lazy-loaded content');

		await page.waitForLoadState('domcontentloaded');

		await page.waitForFunction(
			() => document.readyState === 'complete',
			{},
			{ timeout: 10000 }
		);

		await page.mouse.wheel(0, 1200);
		await page.waitForTimeout(800);

		await page.mouse.wheel(0, 1200);
		await page.waitForTimeout(800);

		await page.mouse.wheel(0, -2400);
		await page.waitForTimeout(500);

		await page.waitForLoadState('networkidle').catch(() => {});

		console.log('✓ Page stabilized');

		return true;

	} catch (err) {
		console.log(`⚠️ Page stabilization failed: ${err.message}`);

		return false;
	}
}

/**
 * Navigate to an article page and dismiss login popup if present.
 */
async function gotoArticle(page, url) {
	await page.goto(url, {
		waitUntil: 'load'
	});

	await page.waitForLoadState('networkidle');

	await dismissLoginPopup(page);
}

/**
 * Dismiss article login popup if present.
 */
async function dismissLoginPopup(page) {
	try {
		const popup = page.locator('.modalPoplogin');

		if (await popup.isVisible({ timeout: 2000 })) {
			await page
				.locator('.modalPoplogin .closeIcon')
				.click({ force: true });

			await page.waitForTimeout(1000);
		}
	} catch {
		// popup not present
	}
}

/**
 * Generic scroll helper for article sections.
 */
async function scrollToElement(page, selector) {
	try {
		await page.evaluate((sel) => {
			const el = document.querySelector(sel);

			if (el) {
				el.scrollIntoView({
					behavior: 'instant',
					block: 'center'
				});

				window.scrollBy(0, -100);
			}
		}, selector);

		await page.waitForTimeout(500);
	} catch {
		// ignore
	}
}

/**
 * Extract slug from URL or href.
 */
function slug(urlOrHref) {
	return decodeURIComponent(
		urlOrHref
			.replace(/\/$/, '')
			.split('/')
			.pop()
	)
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-+|-+$/g, '');
}

module.exports = {
	isVisible,
	getCount,
	findFirst,
	scrollTo,
	safeClick,
	clickAndWaitForNav,
	getText,
	urlChanged,
	textExists,
	validateTextWithFallback,
	findValidationError,
	verifyNumericOnlyField,
	validateVisualPanel,
	handleCookieBanner,
	stabilizePage,
	gotoArticle,
	dismissLoginPopup,
	scrollToElement,
	slug
};

/**
 * config/reportMappings.js
 *
 * PRODUCTION IMPLEMENTATION
 * Based on the validated temp/reportMappings.js schema.
 *
 * Purpose:
 * Provide a stable production mapping of expected results to execution logs
 * for future verifyResults.js implementation.
 *
 * Architecture:
 * - version
 * - globalRules
 * - testCases
 * - reportingMode
 * - expectedGroups
 * - logKey
 * - outputMode
 * - outputHints
 * - unmappedLogs
 */

module.exports = {
	version: '1.0',

	/**
	 * Global formatting rules for all test cases
	 * Reserved for future generic text transformations
	 */
	globalRules: {
		// Reserved for patterns applicable across multiple TCs
		// Examples for future use:
		// - generic URL normalization
		// - common redundant phrase removal
		// - universal validation text standardization
	},

	/**
	 * Test case specific mappings
	 * All 24 P0 test cases pre-registered
	 */
	testCases: {
		// ─── Homepage Tests ──────────────────────────────────────────────────────
		TC002: {
			reportingMode: 'detailed',
			scenario: 'Verify banner video section',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Banner videos are displayed and auto-change successfully.',
					executionLogs: [
						{ logKey: 'banner-section', step: 'Banner Section' },
						{ logKey: 'banner-videos-auto-change', step: 'Banner Videos Auto Change' },
					],
					notes:
						'Core display and autoplay functionality. Banner Section validates presence, Banner Videos Auto Change validates autoplay behavior.',
				},
				{
					id: 2,
					outputMode: 'detailed',
					requirement:
						'Each banner video displays article title, author name, video content, and Dive In button.',
					executionLogs: [{ logKey: 'banner-video-attributes', step: 'Banner Video Attributes' }],
					notes: 'Single comprehensive validation for all video element attributes.',
				},
				{
					id: 3,
					outputMode: 'detailed',
					requirement:
						'Dive In button redirects users to the respective article detail page.',
					executionLogs: [{ logKey: 'dive-in-redirect', step: 'Dive In Redirect' }],
					notes: 'Navigation validation. Verifies redirect functionality.',
				},
				{
					id: 4,
					outputMode: 'detailed',
					requirement: 'Navigation section is displayed below the banner videos.',
					executionLogs: [{ logKey: 'navigation-section', step: 'Navigation Section' }],
					notes: 'Display validation for navigation controls.',
				},
				{
					id: 5,
					outputMode: 'detailed',
					requirement:
						'Navigation options update the banner video correctly.',
					executionLogs: [{ logKey: 'navigation-section', step: 'Navigation Section' }],
					notes:
						'Functional validation of navigation controls. Navigation Section log validates both display and interaction.',
				},
			],
			unmappedLogs: [
				{
					logKey: 'autoplay-stays-stopped',
					step: 'Autoplay Stays Stopped',
					details: 'Autoplay stopped successfully',
					category: 'implementation-detail',
					notes:
						'Validates a side effect (autoplay persistence) not explicitly in requirements. Future verifyResults.js must decide: include in report or suppress?',
				},
			],
		},

		TC003: {
			reportingMode: 'detailed',
			scenario: 'Verification of all links present in menu section',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Menu links navigate successfully to their respective pages.',
					executionLogs: [
						{ logKey: 'header-visible', step: 'Header visible' },
						{ logKey: 'logo-navigates-homepage', step: 'Logo navigates to homepage' },
						{ logKey: 'menu-bar-links-present', step: 'Menu bar links present' },
						{ logKey: 'skin-menu-links', step: 'Skin menu links' },
						{ logKey: 'hair-menu-links', step: 'Hair menu links' },
						{ logKey: 'makeup-menu-links', step: 'Makeup menu links' },
						{ logKey: 'wellbeing-menu-links', step: 'Wellbeing menu links' },
						{ logKey: 'lifestyle-menu-links', step: 'Lifestyle menu links' },
						{ logKey: 'men-menu-links', step: 'Men menu links' },
						{ logKey: 'bepicks-menu-links', step: 'BePicks menu links' },
						{ logKey: 'astrology-menu-links', step: 'Astrology menu links' },
						{ logKey: 'about-us-link', step: 'About Us link' },
						{ logKey: 'header-icons-visible', step: 'Header icons visible' },
					],
					notes:
						'Individual menu navigation validation. Each submenu is tested separately, providing useful QA evidence of navigation coverage.',
				},
			],
			unmappedLogs: [],
		},

		TC005: {
			reportingMode: 'detailed',
			scenario: 'Verification of search bar with valid keyword',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Relevant products and articles are displayed successfully.',
					executionLogs: [
						{ logKey: 'search-bar-opens', step: 'Search bar opens on click' },
						{ logKey: 'search-default-state', step: 'Default state: Recent Searches and Latest Reads visible' },
						{ logKey: 'search-suggestions', step: 'Relevant search suggestions/results displayed' },
						{ logKey: 'search-product-cards', step: 'Product cards displayed with mandatory details' },
						{ logKey: 'search-result-count', step: 'Result count displayed for searched products' },
						{ logKey: 'search-shop-now-pdp', step: '"Shop Now" navigates to Product Detail Page (PDP)' },
						{ logKey: 'search-articles-section', step: '"Articles" section displayed alongside Products with mandatory attributes' },
						{ logKey: 'search-recent-keyword', step: 'Recent Searches: cleared keyword appears, section visible below input' },
					],
					notes: 'Search flow and combined articles/products evidence.',
				},
			],
			unmappedLogs: [],
		},

		TC016: {
			reportingMode: 'detailed',
			scenario: 'Verify article section on homepage',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement:
						'Article category options, layout, article attributes, navigation, and Dive In functionality operate correctly.',
					executionLogs: [
						{ logKey: 'article-categories', step: 'Category options (All, Skin, Makeup, Hair, Lifestyle)' },
						{ logKey: 'article-layout', step: 'Article layout (large article left, small articles right)' },
						{ logKey: 'small-article-attributes', step: 'Small article attributes (image, wishlist, share, title, read time, date, author)' },
						{ logKey: 'large-article-attributes', step: 'Large article attributes (image, wishlist, share, title, author, date)' },
						{ logKey: 'article-navigation', step: 'Clicking any article navigates to respective article detail page' },
						{ logKey: 'dive-in-button', step: '"Dive In" button visible and redirects to respective category page' },
					],
					notes: 'Covers article listing layout and navigation evidence.',
				},
			],
			unmappedLogs: [],
		},

		// ─── Blog/Article Tests ──────────────────────────────────────────────────
		TC047: {
			reportingMode: 'mixed',
			scenario: 'Verify Article Page Header and Basic Details',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement:
						'Article page displays all mandatory header and author details successfully.',
					executionLogs: [
						{
							logKey: 'breadcrumb-visible-and-clickable',
							step: 'Breadcrumb section visible and clickable',
						},
						{ logKey: 'article-title-visible', step: 'Article title visible' },
						{ logKey: 'article-subheading-visible', step: 'Article subheading visible' },
						{ logKey: 'article-image-visible', step: 'Article image visible' },
						{ logKey: 'sticky-icon-bar-visible', step: 'Sticky icon bar visible' },
						{ logKey: 'author-section-visible', step: 'Author section visible' },
					],
					notes:
						'Core article page header elements. Includes breadcrumb, title, subheading, image, sticky icons, and author info.',
					outputHints: {
						suppressUrls: true,
						shortenTitles: true,
					},
				},
			],
			unmappedLogs: [],
		},

		TC048: {},

		TC049: {
			reportingMode: 'detailed',
			scenario: 'Verify Share Functionality',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Share popup is displayed successfully on the article page.',
					executionLogs: [
						{ logKey: 'share-popup-opened', step: 'Share popup opened successfully' },
					],
					notes: 'Validates share popup display as the first visible outcome of the feature.',
				},
				{
					id: 2,
					outputMode: 'detailed',
					requirement: 'All supported sharing options are available and function correctly.',
					executionLogs: [
						{ logKey: 'share-options-visible', step: 'All share options visible' },
						{ logKey: 'instagram-share-working', step: 'Instagram share working' },
						{ logKey: 'whatsapp-share-working', step: 'WhatsApp share working' },
						{ logKey: 'mail-share-working', step: 'Mail share working' },
						{ logKey: 'twitter-share-working', step: 'Twitter share working' },
						{ logKey: 'copy-link-functionality-working', step: 'Copy Link functionality working' },
					],
					notes: 'Aggregates all share channel validations under one functional requirement.',
				},
				{
					id: 3,
					outputMode: 'detailed',
					requirement: 'Share popup closes successfully after use.',
					executionLogs: [
						{ logKey: 'share-popup-closed', step: 'Share popup closed successfully' },
					],
					notes: 'Validates clean dismissal of the share popup.',
				},
			],
			unmappedLogs: [],
		},

		TC050: {
			reportingMode: 'detailed',
			scenario: 'Verify download and listen now options',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Download icon and Listen Now functionality are displayed and function correctly.',
					executionLogs: [
						{ logKey: 'download-icon-visible', step: 'Download icon visible' },
						{ logKey: 'listen-now-option-visible', step: 'Listen Now option visible' },
						{ logKey: 'listen-progress-bar-opened', step: 'Listen progress bar opened' },
					],
					notes: 'Validates download access and audio playback controls without exposing implementation details.',
				},
			],
			unmappedLogs: [],
		},

		TC051: {
			reportingMode: 'detailed',
			scenario: 'Verify "Keep reading to know" option',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: '"Keep Reading to Know" section displays the list and allows same-page navigation.',
					executionLogs: [
						{ logKey: 'keep-reading-heading-visible', step: 'Keep Reading to Know heading is displayed' },
						{ logKey: 'list-container-pointer-links-present', step: 'List container with pointer items and clickable links are present' },
						{ logKey: 'clickable-links-scroll-within-article', step: 'Clickable links scroll within the same article page' },
					],
					notes: 'Summarizes section visibility and intra-page navigation behavior.',
				},
			],
			unmappedLogs: [],
		},

		TC052: {
			reportingMode: 'detailed',
			scenario: 'Verify FAQ section',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement:
						'FAQ section heading is displayed successfully on the article page.',
					executionLogs: [
						{
							logKey: 'faq-heading-visible',
							step: 'FAQ section heading should be present on the article page.'
						}
					],
					notes:
						'Current execution output only validates FAQ heading presence on the article page.'
				}
			],
			unmappedLogs: [],
		},

		TC053: {
			reportingMode: 'summary',
			scenario: 'Verify BE Picks section on right',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'summary',
					requirement:
						'Be Picks section is displayed on the right with product cards showing the required attributes.',
					executionLogs: [
						{
							logKey: 'bepicks-section-visible',
							step: '1. Be Picks section should be displayed on right side of article page.',
						},
						{
							logKey: 'bepicks-product-attributes-overall',
							step: '2. Products with required attributes displayed under Be Picks.',
						},
						// per-card logs removed: current implementation reports aggregated summaries
					],
					notes:
						'Multiple repetitive product card validations (3 cards × 5 attributes each). Candidate for summarization in future reports.',
				},
				{
					id: 2,
					outputMode: 'detailed',
					requirement: 'Be Picks section expands and collapses correctly.',
					executionLogs: [
						{
							logKey: 'bepicks-expanded-state-default',
							step: '8a. By default, Be Picks section should be in expanded state.',
						},
						{
							logKey: 'bepicks-toggle-collapse',
							step: '8b. Clicking the toggle should collapse the Be Picks section.',
						},
						{
							logKey: 'bepicks-toggle-expand',
							step: '8c. Clicking the toggle again should re-expand the Be Picks section.',
						},
					],
					notes: 'Expand/collapse behavior validation.',
				},
				{
					id: 3,
					outputMode: 'detailed',
					requirement: 'Products navigate successfully to their respective Product Detail Pages.',
					executionLogs: [
						// navigation checks are aggregated in current TC output
						{
							logKey: 'bepicks-product-navigation-pdp',
							step: '9. Product navigation to PDP.',
						},
					],
					notes:
						'Navigation validation with slug comparison. Repetitive 3 cards × 3 navigation paths. Includes URLs and slug matching as evidence.',
				},
			],
			unmappedLogs: [
				{
					logKey: 'wishlist-option-behavior',
					step: '10. Wishlist option behavior.',
					details:
						'Wishlist requires authentication — login modal triggered. Re-run with a logged-in session.',
					category: 'incomplete-validation',
					notes:
						'Authentication-dependent test. Not a failure but indicates test dependency.',
				},
			],
		},

		TC054: {
			reportingMode: 'mixed',
			scenario: "Verify 'Going Viral' section",
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Going Viral section is displayed below Be Picks and remains collapsed by default.',
					executionLogs: [
						{
							logKey: 'going-viral-section-visible-below-bepicks',
							step: 'Going Viral section should be displayed below Be Picks section.',
						},
						{
							logKey: 'going-viral-default-collapsed',
							step: 'By default, Going Viral section should be in collapsed state.',
						},
					],
					notes: 'Validates section placement and initial collapsed state.',
				},
				{
					id: 2,
					outputMode: 'detailed',
					requirement: 'Going Viral section expands and collapses correctly when interacted with.',
					executionLogs: [
						{
							logKey: 'going-viral-collapsed-initially',
							step: 'Going Viral is collapsed initially.',
						},
						{
							logKey: 'going-viral-expand',
							step: 'Clicking on Going Viral should expand the section.',
						},
						{
							logKey: 'going-viral-collapse',
							step: 'Clicking again should collapse the section.',
						},
					],
					notes: 'Validates expand/collapse toggle behavior.',
				},
				{
					id: 3,
					outputMode: 'summary',
					requirement: 'Going Viral article cards display the required image, title, author name, category, and engagement options.',
					executionLogs: [
						{ logKey: 'article-1-image-visible', step: '4a. [Article 1] Article image is displayed.' },
						{ logKey: 'article-2-title-visible', step: '4b. [Article 1] Article title is displayed.' },
						{ logKey: 'article-3-like-share-visible', step: '4e. [Article 1] Like and Share icons are displayed.' },
						{ logKey: 'going-viral-article-author-visible', step: '4c. [Article 1] Author name is displayed.' },
						{ logKey: 'going-viral-article-category-visible', step: '4d. [Article 1] Article category matches href path.' },
					],
					notes: 'Excel requires image, title, author, category, and engagement options on each article card. Author and category were missing from the previous mapping. going-viral-article-author-visible and going-viral-article-category-visible may not yet be emitted — their absence surfaces a coverage gap. Existing article-N-prefixed log keys are retained as they are the only current evidence for image and title coverage.',
				},
				{
					id: 4,
					outputMode: 'detailed',
					requirement: 'Like functionality operates correctly within the Going Viral section.',
					executionLogs: [
						{
							logKey: 'going-viral-like-functionality',
							step: 'Clicking Like icon should add article to liked articles or prompt login.',
						},
					],
					notes: 'Validates like button behavior.',
				},
				{
					id: 5,
					outputMode: 'detailed',
					requirement: 'Share functionality displays the share popup with sharing options and allows the popup to be closed.',
					executionLogs: [
						{
							logKey: 'going-viral-share-open',
							step: '6a. Clicking Share icon should open share popup.',
						},
						{
							logKey: 'going-viral-share-options',
							step: '6b. Share popup should display social sharing options.',
						},
						{
							logKey: 'going-viral-share-close',
							step: '6c. Share popup should close on clicking close button.',
						},
					],
					notes: 'Validates share popup open, content, and close behavior.',
				},
			],
			unmappedLogs: [],
		},

		TC055: {
			reportingMode: 'detailed',
			scenario: "Verify product in 'Catalog' section",
			expectedGroups: [
				{
					id: 1,
					outputMode: 'summary',
					requirement:
						'Catalog section displays products in a carousel with the required product attributes.',
					executionLogs: [
						{
							logKey: 'catalog-products-displayed',
							step: '1. Products should be displayed in carousel/catalog section.',
						},
						{
							logKey: 'catalog-product-1-image',
							step: '4a. [Product 1] Product image is displayed.',
						},
						{
							logKey: 'catalog-product-2-name',
							step: '4b. [Product 1] Product name is displayed.',
						},
						{
							logKey: 'catalog-product-3-shop-now',
							step: '4d. [Product 1] Shop Now button is displayed.',
						},
					],
				},
				{
					id: 2,
					outputMode: 'detailed',
					requirement:
						'Carousel navigation controls are displayed and update the product listing when used.',
					executionLogs: [
						{
							logKey: 'catalog-carousel-controls-visible',
							step: '2. Left and right navigation controls should be displayed for carousel.',
						},
						{
							logKey: 'catalog-carousel-next',
							step: '3a. Clicking right (next) navigation should move carousel forward.',
						},
						{
							logKey: 'catalog-carousel-prev',
							step: '3b. Clicking left (prev) navigation should move carousel backward.',
						},
					],
				},
				{
					id: 3,
					outputMode: 'detailed',
					requirement:
						'Clicking a product image, product name, or product tile navigates to the respective Product Detail Page.',
					executionLogs: [
						{
							logKey: 'catalog-product-1-image-pdp',
							step: '5a. [Product 1] Clicking "product image" for "Natural Argan Oil & Lavender Sulfate Free Anti-Frizz Shampoo - 400ml" navigates to PDP.',
						},
						{
							logKey: 'catalog-product-2-name-pdp',
							step: '5b. [Product 1] Clicking "product name" for "Natural Argan Oil & Lavender Sulfate Free Anti-Frizz Shampoo - 400ml" navigates to PDP.',
						},
						{
							logKey: 'catalog-product-3-tile-pdp',
							step: '5c. [Product 1] Clicking "product tile" for "Natural Argan Oil & Lavender Sulfate Free Anti-Frizz Shampoo - 400ml" navigates to PDP.',
						},
					],
				},
			],
			unmappedLogs: [],
		},

		TC056: {
			reportingMode: 'detailed',
			scenario: 'Verify Also Your Vibe section',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement:
						'Section displays related articles and clicking an article opens the corresponding detail page.',
					executionLogs: [
						{
							logKey: 'also-your-vibe-section-visible',
							step: '1. Also Your Vibe section should be displayed.',
						},
						{
							logKey: 'also-your-vibe-multiple-articles',
							step: '2. Multiple articles should be displayed.',
						},
						{
							logKey: 'also-your-vibe-card-attributes',
							step: '3. Article card should display all required attributes.',
						},
						{
							logKey: 'also-your-vibe-click-article-navigate',
							step: '4. Clicking article should navigate to article detail page.',
						},
					],
					notes:
						'Straightforward section validation without repetitive elements. Each log is concise and useful.',
				},
			],
			unmappedLogs: [],
		},

		TC057: {
			reportingMode: 'detailed',
			scenario: 'Verify Dive In CTA Navigation',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Dive In CTA is displayed below the article and positioned correctly in the content flow.',
					executionLogs: [
						{ logKey: 'dive-in-button-visible', step: '"Dive In" button should be displayed below the article.' },
						{ logKey: 'dive-in-button-placement', step: '"Dive In" button is placed inside the vibe section below article content.' },
					],
					notes: 'Validates CTA display and placement without surfacing slug details.',
				},
				{
					id: 2,
					outputMode: 'detailed',
					requirement: 'Dive In CTA navigates successfully to the corresponding category page.',
					executionLogs: [
						{ logKey: 'dive-in-button-navigation', step: 'Clicking "Dive In" should navigate one level up to respective sub-category page.' },
						{ logKey: 'dive-in-category-match', step: 'Navigated category page should match the category of the article.' },
					],
					notes: 'Validates category navigation while keeping URL and slug evidence suppressed.',
					outputHints: {
						suppressUrls: true,
					},
				},
			],
			unmappedLogs: [],
		},

		TC058: {
			reportingMode: 'detailed',
			scenario: 'Verify article footer section',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Author section displays profile information successfully.',
					executionLogs: [
						{ logKey: 'author-section-visible', step: 'Author section should be visible and positioned below FAQ section.' },
						{ logKey: 'author-image-visible', step: 'Author image should be displayed.' },
						{ logKey: 'author-name-visible', step: 'Author name should be displayed.' },
						{ logKey: 'about-author-content-visible', step: 'About Author content should be displayed.' },
					],
					notes: 'Validates author profile presentation without exposing author-specific content details.',
				},
				{
					id: 2,
					outputMode: 'detailed',
					requirement: 'Footer engagement options are displayed correctly and behave consistently.',
					executionLogs: [
						{ logKey: 'download-option-visible', step: 'Download option should be displayed below author section.' },
						{ logKey: 'share-option-visible', step: 'Share option should be displayed below author section.' },
						{ logKey: 'share-popup-behavior-consistent', step: 'Share popup should open and behave consistently.' },
					],
					notes: 'Validates footer engagement controls without sharing internal implementation details.',
				},
				{
					id: 3,
					outputMode: 'detailed',
					requirement: 'Next Hot Take section displays metadata and navigates correctly.',
					executionLogs: [
						{ logKey: 'next-hot-take-visible', step: '"Next Hot Take" section should be visible below author section.' },
						{ logKey: 'next-hot-take-metadata-visible', step: 'Next Hot Take section should display article metadata.' },
						{ logKey: 'next-hot-take-navigation', step: 'Clicking on article in "Next Hot Take" section should navigate to respective article detail page.' },
					],
					notes: 'Validates hot take section visibility, metadata presence, and navigation behavior.',
				},
			],
			unmappedLogs: [],
		},

		TC059: {
			reportingMode: 'detailed',
			scenario: 'Verify Article listing Page Header and Basic Details',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Breadcrumb and page header elements are visible on the article listing page.',
					executionLogs: [
						{ logKey: 'breadcrumb-section-visible', step: 'Breadcrumb section is displayed on article listing page' },
						{ logKey: 'hero-article-title-visible', step: 'Hero article title is displayed on listing page' },
					],
					notes: 'Validates top-level page header and breadcrumb visibility.',
				},
				{
					id: 2,
					outputMode: 'detailed',
					requirement: 'Hero article displays the required metadata and navigates correctly.',
					executionLogs: [
						{ logKey: 'hero-author-name-visible', step: 'Author name is displayed in hero article section' },
						{ logKey: 'hero-like-option-visible', step: 'Like option is displayed on hero article' },
						{ logKey: 'hero-share-option-visible', step: 'Share option is displayed on hero article' },
						{ logKey: 'dive-in-button-visible', step: '"Dive In" button is displayed in hero article section' },
						{ logKey: 'hero-navigation-working', step: 'Hero article navigated to article page' },
					],
					notes: 'Validates hero article metadata and navigation while suppressing raw URL values.',
					outputHints: {
						suppressUrls: true,
					},
				},
				{
					id: 3,
					outputMode: 'detailed',
					requirement: 'Marquee section is displayed and functions correctly below the hero section.',
					executionLogs: [
						{ logKey: 'marquee-visible', step: 'Moving marquee section is displayed below hero section' },
						{ logKey: 'marquee-content-functional', step: 'Marquee section contains text content and is functional' },
					],
					notes: 'Validates the marquee section display and behavior.',
				},
			],
			unmappedLogs: [],
		},

		TC060: {
			reportingMode: 'detailed',
			scenario: 'Verify article listing section below marquee',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement:
						'Article listing section is visible below the marquee section.',
					executionLogs: [
						{
							logKey: 'listing-section-visible',
							step: 'Article listing section is visible below marquee',
						},
					],
					notes:
						'Current execution evidence confirms section visibility. Excel layout requirements are not currently represented by emitted execution logs.',
				},
				{
					id: 2,
					outputMode: 'summary',
					requirement:
						'Article cards display author information and engagement options.',
					executionLogs: [
						{
							logKey: 'share-visible-on-cards',
							step: 'Share option is displayed on article cards',
						},
						{
							logKey: 'wishlist-visible-on-cards',
							step: 'Wishlist option is displayed on article cards',
						},
						{
							logKey: 'author-name-visible-on-cards',
							step: 'Author names are displayed on article cards',
						},
					],
					notes:
						'Current execution evidence validates author visibility and engagement options.',
				},
				{
					id: 3,
					outputMode: 'detailed',
					requirement:
						'Clicking an article navigates to the respective article detail page.',
					executionLogs: [
						{
							logKey: 'listing-navigation-working',
							step: 'Article click navigated to article detail page: https://www.bebeautiful.in/all-things-skin/everyday/face-pack-for-dry-skin',
						},
					],
					notes: 'Validates article navigation.',
					outputHints: {
						suppressUrls: true,
					},
				},
			],
			unmappedLogs: [],
		},

		TC061: {
			reportingMode: 'detailed',
			scenario: "Verify 'People are looking for' section",
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement:
						"'People Are Looking For' section is displayed on the article listing page.",
					executionLogs: [
						{
							logKey: 'people-looking-for-visible',
							step: '"People are looking for" section is displayed on article listing page',
						},
					],
					notes: 'Validates section visibility.',
				},
				{
					id: 2,
					outputMode: 'summary',
					requirement:
						'Article cards display engagement options.',
					executionLogs: [
						{
							logKey: 'people-looking-for-like-visible',
							step: 'Like option is displayed in "People are looking for" section',
						},
						{
							logKey: 'people-looking-for-share-visible',
							step: 'Share option is displayed in "People are looking for" section',
						},
					],
					notes:
						'Current execution evidence confirms visibility of engagement options. Additional article metadata coverage is not currently represented by verified execution logs.',
				},
				{
					id: 3,
					outputMode: 'detailed',
					requirement:
						'Carousel navigation controls and indicator dots are displayed and function correctly.',
					executionLogs: [
						{
							logKey: 'people-looking-for-carousel-controls',
							step: 'Left/right navigation controls found for "People are looking for" section',
						},
						{
							logKey: 'people-looking-for-carousel-next',
							step: 'Right navigation arrow is clickable and carousel interaction executed',
						},
						{
							logKey: 'people-looking-for-carousel-dot',
							step: 'Navigation dot is clickable and carousel interaction executed',
						},
					],
					notes:
						'Validates carousel controls and indicator navigation.',
				},
			],
			unmappedLogs: [],
		},

		TC062: {
			reportingMode: 'detailed',
			scenario: 'Verify "All articles" section',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'All Articles section is visible on the page.',
					executionLogs: [
						{ logKey: 'all-articles-section-visible', step: '"All Articles" section container is visible on page' },
					],
					notes: 'Validates section visibility as the top-level requirement.',
				},
				{
					id: 2,
					outputMode: 'detailed',
					requirement: 'Articles in the section display category, author, and engagement options correctly.',
					executionLogs: [
						{ logKey: 'all-articles-category-labels', step: 'Category labels are displayed above article titles in "All Articles" section' },
						{ logKey: 'all-articles-like-visible', step: 'Like option is displayed on article images in "All Articles" section' },
						{ logKey: 'all-articles-share-visible', step: 'Share option is displayed on article images in "All Articles" section' },
						{ logKey: 'all-articles-author-names-visible', step: 'Author names are displayed below article titles in "All Articles" section' },
					],
					notes: 'Validates article metadata and engagement display without exposing raw count metrics.',
				},
				{
					id: 3,
					outputMode: 'detailed',
					requirement: 'Load More functionality works and loads additional articles.',
					executionLogs: [
						{ logKey: 'all-articles-load-more-visible', step: '"Load More" button is displayed below article listing' },
						{ logKey: 'all-articles-load-more-works', step: '"Load More" loaded additional articles successfully' },
					],
					notes: 'Validates the incremental load experience.',
				},
				{
					id: 4,
					outputMode: 'detailed',
					requirement: 'Sort functionality is visible and operates correctly.',
					executionLogs: [
						{ logKey: 'all-articles-sort-visible', step: 'Sort option (dropdown) is displayed in "All Articles" section' },
						{ logKey: 'all-articles-sort-interaction', step: 'Sort option interaction executed successfully' },
					],
					notes: 'Validates sorting controls and interaction.',
				},
			],
			unmappedLogs: [],
		},

		// ─── Authentication Tests ────────────────────────────────────────────────
		TC070: {
			reportingMode: 'detailed',
			scenario: 'Verify UI of login page',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement:
						'Login page UI displays all mandatory elements successfully.',
					executionLogs: [
						{
							logKey: 'login-screen-displayed',
							step:
								'Login screen is displayed (identified by: input[type="tel"], input[placeholder*="Mobile"], input[placeholder*="mobile"], input[name="mobile"])',
						},
						{
							logKey: 'login-banner-displayed',
							step: 'Banner is displayed on left side of Login screen',
						},
						{
							logKey: 'feels-good-text-visible',
							step: '"Feels good to see you again" text is displayed on login screen',
						},
						{
							logKey: 'lets-dive-in-text-visible',
							step: '"Let\'s dive in" text is displayed on login screen',
						},
						{
							logKey: 'mobile-number-input-visible',
							step: 'Mobile Number input field is displayed on login screen',
						},
						{
							logKey: 'login-button-visible',
							step: 'Login button is displayed below Mobile Number field',
						},
						{
							logKey: 'google-login-visible',
							step: 'Google social login option is displayed below login section',
						},
						{
							logKey: 'facebook-login-visible',
							step: 'Facebook social login option is displayed below login section',
						},
						{
							logKey: 'create-account-link-visible',
							step: '"Create a new account" link is displayed below social login options',
						},
					],
					notes:
						'Individual UI element validation. Each element is important evidence of page composition.',
				},
			],
			unmappedLogs: [],
		},

		TC071: {
			reportingMode: 'detailed',
			scenario: 'Verify mobile number field validation',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Mobile number validation functions correctly on the Login page.',
					executionLogs: [
						{ logKey: 'mobile-reject-alphabets', step: 'Alphabets are rejected — Mobile Number field accepts only numeric values' },
						{ logKey: 'mobile-reject-special-chars', step: 'Special characters are rejected in Mobile Number field' },
						{ logKey: 'mobile-incomplete-validation', step: 'Validation error shown for incomplete mobile number: "Looks like that number\'s off, try again"' },
						{ logKey: 'mobile-blank-validation', step: 'Mandatory field error shown for blank mobile: "Please enter the registered mobile number to login"' },
						{ logKey: 'mobile-valid-number-accepted', step: 'Valid 10-digit mobile number accepted — user can proceed in login flow' },
					],
					notes: 'Client-side mobile number validation checks for login flow.',
				},
			],
			unmappedLogs: [],
		},

		// ─── Sign-up Tests ──────────────────────────────────────────────────────
		TC074: {
			reportingMode: 'detailed',
			scenario: 'Verify signup page UI',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Signup page UI displays all mandatory elements successfully.',
					executionLogs: [
						{ logKey: 'signup-banner-visible', step: 'Signup image/banner is displayed on left side' },
						{ logKey: 'signup-heading', step: '\"Let\'s get started\" heading is displayed on Signup page' },
						{ logKey: 'signup-welcome-text', step: 'Welcome text is displayed on Signup page' },
						{ logKey: 'signup-subtext', step: '\"Let\'s make this official\" text is displayed on Signup page' },
						{ logKey: 'signup-mobile-field', step: 'Mobile Number input field is displayed on Signup page' },
						{ logKey: 'signup-button', step: 'Signup button is displayed below Mobile Number field' },
						{ logKey: 'signup-google', step: 'Google social login option is displayed on Signup page' },
						{ logKey: 'signup-facebook', step: 'Facebook social login option is displayed on Signup page' },
						{ logKey: 'signup-login-link', step: 'Login link is displayed on Signup page' },
					],
					notes: 'Signup UI element verification.',
				},
			],
			unmappedLogs: [],
		},
		TC075: {
			reportingMode: 'detailed',
			scenario: 'Verify Signup Mobile Number Field Validation',
			expectedGroups: [
				{
					id: 1,
					outputMode: 'detailed',
					requirement: 'Mobile number validation functions correctly on the Signup page.',
					executionLogs: [
						{ logKey: 'signup-reject-alphabets', step: 'Alphabets are rejected — Mobile Number field accepts only numeric values' },
						{ logKey: 'signup-reject-special-chars', step: 'Special characters are rejected in Signup Mobile Number field' },
						{ logKey: 'signup-incomplete-validation', step: 'Validation error shown for incomplete mobile number: "Looks like that number\'s off, try again"' },
						{ logKey: 'signup-blank-field-behavior', step: 'No blank-field validation message implemented — Signup flow does not proceed with empty Mobile Number' },
						{ logKey: 'signup-valid-unregistered-accepted', step: 'Valid 10-digit unregistered mobile number accepted in Signup field' },
						{ logKey: 'signup-registered-number-skipped', step: 'Registered number validation skipped — requires pre-configured registered mobile. Expected: "account already exists" message prevents signup.' },
						{ logKey: 'signup-blocked-registered-skip', step: 'Blocked-registered-number flow skipped — depends on Step 6 live data. Expected: Signup blocked or redirected to Login.' },
					],
					notes: 'Signup mobile validation behavior and limitations.',
				},
			],
			unmappedLogs: [],
		},
	},
};

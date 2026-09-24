// pages/HomePage.js
// Page Object Model for the BeBeautiful Homepage.
// Covers: Hero Banner, Header, Search modal, Article Section, Cart, As Seen On Gram, Join the Club.

const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ── BANNER SECTION ────────────────────────────────────────
    this.banner = {
      section: page.locator('.home-baner-container'),
      swiper: page.locator('.homebannerSwiper'),
      slides: page.locator('.homebannerSwiper .swiper-slide:not(.swiper-slide-duplicate)'),
      activeSlide: page.locator('.homebannerSwiper .swiper-slide-active:not(.swiper-slide-duplicate)'),
      video: page.locator('video.VideoBanner__video'),
      articleTitle: page.locator('.BreakoutCard-Content-Transition h1, .BreakoutCard-Content-Transition h2'),
      authorName: page.locator('p.author-name'),
      diveInButton: page.locator('a.buttonWithBorder.secondaryButton'),
      paginationBullets: page.locator('.home-baner-container .swiper-pagination-bullet'),
      activeBullet: page.locator('.home-baner-container .swiper-pagination-bullet-active'),
      nextArrow: page.locator('.custom-navigation button[aria-label="Next Slide"]'),
      previousArrow: page.locator('.custom-navigation button[aria-label="Previous Slide"]'),
    };

    // ── HEADER SECTION ────────────────────────────────────────
    this.header = {
      container: page.locator('.header-container'),
      content: page.locator('.header-content'),
      logo: page.locator('.logo-container'),
      desktopNav: page.locator('.desktop-nav'),
      navItems: page.locator('li.nav-item'),
      navButtons: page.locator('button.nav-link'),
      aboutUs: page.locator('a.nav-link-item'),
      submenu: page.locator('.submenu-container'),
      submenuItems: page.locator('.submenu-item'),
      closeSubmenu: page.locator('.close-submenu'),
      searchIcon: page.locator('.search-btn'),
      cartIcon: page.locator('.cart-btn'),
    };

    // ── SEARCH SECTION ────────────────────────────────────────
    this.search = {
      searchBtn: page.locator('.search-btn'),
      modalOverlay: page.locator('.modalOverlaySearchPhase'),
      modalContent: page.locator('.modalContentRequest.deleteModalSearchPhase'),
      closeIconDesktop: page.locator('.modalOverlaySearchPhase .closeIcon'),
      closeIconMobile: page.locator('.modalOverlaySearchPhase .closeIconMobile'),
      inputWrapper: page.locator('.searchInputWrapper'),
      inputField: page.locator('input#search.searchInputField'),
      clearIcon: page.locator('.searchClearIcon'),
      recentSearchSection: page.locator('.recentSearchSection'),
      recentSearchTitle: page.locator('.recentSearchTitle'),
      recentSearchItems: page.locator('.recentSearchItem'),
      recentSearchTexts: page.locator('.recentSearchText'),
      recentSearchCloseIcons: page.locator('.recentSearchCloseIcon'),
      latestReadsBox: page.locator('.bottomFixedBox'),
      latestReadsHeading: page.locator('.latestReadsHeading'),
      articleCards: page.locator('.searchPhaseSwiper .card-container'),
      articleTitles: page.locator('.searchPhaseSwiper .swiper-slide-active .vibeHeading'),
      articleImages: page.locator('.searchPhaseSwiper .swiper-slide-active .vibeImage img[src*="cloudinary"], .searchPhaseSwiper .swiper-slide-active .vibeImage img[src*="http"]'),
      articleMetas: page.locator('.searchPhaseSwiper .swiper-slide-active .vibeMeta'),
      articleAuthorNames: page.locator('.searchPhaseSwiper .swiper-slide-active .authorName'),
      articleLinks: page.locator('.searchPhaseSwiper .swiper-slide-active .scrollContainer a[href]'),

      resultsTabs: page.locator('.tabItem'),
      productsTab: page.locator('.tabItem').filter({ hasText: /Products/i }),
      articlesTab: page.locator('.tabItem').filter({ hasText: /Articles/i }),

      resultCount: page.locator('.resultsCount'),

      productCards: page.locator('.search-product-card'),
      productNames: page.locator('.search-product-card .productTitle h4'),
      productImages: page.locator('.search-product-card img.hotspotImg'),
      productPrices: page.locator('.search-product-card .discountPrice'),
      productDiscounts: page.locator('.search-product-card .discountPricePercentage'),
      shopNowLinks: page.locator('.search-product-card .shopNowButton'),

      searchResultArticleCards: page.locator('.modalOverlaySearchPhase .vibeCard'),

      suggestionsWrapper: page.locator(
        [
          '.searchSuggestionsWrapper',
          '.autoSuggestWrapper',
          '.searchResultsDropdown',
          '.searchSuggestions',
          '.search-product-card',
          '.recentSearchItem'
        ].join(', ')
      ),

      suggestionItems: page.locator(
        [
          '.suggestionItem',
          '.autoSuggestItem',
          '.searchResultsDropdown .resultItem',
          '.searchSuggestions .suggestionText',
          '.search-product-card',
          '.recentSearchItem'
        ].join(', ')
      ),

    };

    // ── ARTICLE SECTION ───────────────────────────────────────
    this.articleSection = {
      section: page.locator('.topArticleCategory'),
      categoryButtons: page.locator('.categories .categoryButton'),
      activeCategory: page.locator('.categories .categoryButton.active'),
      leftPanel: page.locator('.categoryContentCardLeftPanel'),
      rightPanel: page.locator('.categoryContentCardRightPanel'),
      largeArticle: page.locator('.categoryContentCardLeftPanel .linking_card_container'),
      largeArticleImage: page.locator('.categoryContentCardLeftPanel .article-image'),
      largeArticleTitle: page.locator('.categoryContentCardLeftPanel h2'),
      largeArticleAuthor: page.locator('.categoryContentCardLeftPanel .card-author-text p'),
      largeArticleDate: page.locator('.categoryContentCardLeftPanel .card-date'),
      largeArticleLike: page.locator('.categoryContentCardLeftPanel .like'),
      largeArticleShare: page.locator('.categoryContentCardLeftPanel .share'),
      largeArticleLink: page.locator('.categoryContentCardLeftPanel a[href]'),
      smallArticles: page.locator('.categoryContentCardRightPanel .vibeCard'),
      smallArticleImages: page.locator('.vibeImage img'),
      smallArticleTitles: page.locator('.vibeHeading'),
      smallArticleAuthors: page.locator('.authorName'),
      smallArticleMeta: page.locator('.vibeMeta'),
      smallArticleReadTime: page.locator('.vibeMeta span:first-child'),
      smallArticleDate: page.locator('.vibeMeta span:last-child'),
      smallArticleLike: page.locator('.iconHeart'),
      smallArticleShare: page.locator('.iconShare'),
      smallArticleLinks: page.locator('.vibeContent a[href], .vibeImage a[href]'),
      diveInButton: page
        .locator('.topArticleCategory .categoryContentCardNavigationButton a[href]')
        .filter({ hasText: /Dive In/i })
        .first(),

      allSections: page.locator('.topArticleCategory'),
      lowerSection: page.locator('.topArticleCategory').nth(1),
      lowerCategoryButtons: page.locator('.topArticleCategory').nth(1).locator('.categories .categoryButton'),
      lowerLeftPanel: page.locator('.topArticleCategory').nth(1).locator('.categoryContentCardLeftPanel'),
      lowerRightPanel: page.locator('.topArticleCategory').nth(1).locator('.categoryContentCardRightPanel'),
      lowerSmallArticles: page.locator('.topArticleCategory').nth(1).locator('.categoryContentCardRightPanel .vibeCard'),
      lowerDiveInButton: page
        .locator('.topArticleCategory')
        .nth(1)
        .locator('.categoryContentCardNavigationButton a[href]')
        .filter({ hasText: /Dive In/i })
        .first(),
    };

    // ── BEAUTY LINGO SECTION ──────────────────────────────────
    this.beautyLingo = {
      section: page.locator('div.HomeBeautyLingo'),
    };

    // ── MARQUEE ───────────────────────────────────────────────
    this.marquee = page.locator('.marqueeContainer');

    // ── HomePage ───────────────────────────────────────────────
    this.logo = page.locator("img[alt='bebe logo']");
    this.searchIcon = page.locator("img[alt='search icon']");
    this.profileIcon = page.locator("img[alt='profile icon']");
    this.cartIcon = page.locator("img[alt='cart icon']");
    this.bannerVideo = page.locator('video');

    // Cookie Banner
    this.cookieBanner = page.locator('#onetrust-banner-sdk, .cookie-banner, .cookie-notice');
    this.cookieOkButton = page.locator('#onetrust-accept-btn-handler')
      .or(page.getByRole('button', { name: 'Accept', exact: true }))
      .first();
    this.cookiePolicyLink = page.locator('#onetrust-policy-link, a[href*="unilever"], a[href*="privacy"]');


    // ── CART SECTION ─────────────────────────────────────

    this.cart = {

      icon: page.locator('.cart-btn'),

      modal: page.locator('.cart-scrollable-content'),
      modalOpen: page.locator('.cart-scrollable-content'),

      title: page.locator('.cart-title'),
      closeButton: page.locator('.cart-close'),

      emptyWrapper: page.locator('.empty-cart-wrapper'),
      emptyTitle: page.locator('.empty-cart-title'),
      emptySubtitle: page.locator('.empty-cart-subtitle'),
      continueShoppingButton: page.locator('.continue-shopping-btn button'),

      badge: page.locator('.cart-count, .cart-badge, .cart-quantity'),

      itemCards: page.locator('.cart-items .card-product-card'),

      productName: page.locator('.cart-items .card-product-card .productDetail > h2.icon'),

      productImage: page.locator('.cart-items .card-product-card .productImageWrapper img'),

      productPrice: page.locator('.cart-items .card-product-card .productPrice .discountPrice'),

      productDiscount: page.locator('.cart-items .card-product-card .productPrice .originalPrice, .cart-items .card-product-card .productPrice .strike, .cart-items .card-product-card .productPrice del'),

      quantitySelector: page.locator('.cart-items .card-product-card .productQuantity .quantity p'),

      removeIcon: page.locator('.cart-items .card-product-card .productHeader .remove'),
    };

    // Product Search Results
    this.products = {

      resultCards: page.locator(
        '.articleProductSearch'
      ),

      productLinks: page.locator(
        '.articleProductSearch > a.card'
      ),

      productTitles: page.locator(
        '.articleProductSearch .productTitle h4'
      ),

      productImages: page.locator(
        '.articleProductSearch .product-image img'
      ),

      addToCartButton: page.locator(
        '.product-add-view-desktop button.buttonWithBorder.primaryButton'
      )
    };

    this.productPage = {

      quantitySection: page.locator('.update-quantity'),

      quantityValue: page.locator('.update-quantity .quantity'),

      increaseQuantity: page.locator('.increase-quantity'),

      decreaseQuantity: page.locator('.decrease-quantity')
    };

    // ── AS SEEN ON GRAM SECTION ────────────────────────────────────
    this.asSeenOnGram = {

      section: page.locator('.liveai'),
      heading: page.locator('.liveai .homeliveAi'),
      widgetContainer: page.locator('.liveai .live2-container'),
      socialBrickWrapper: page.locator('.live2ai-socialbrick-wrapper'),
      reelCards: page.locator('.live2ai_social-brick-item'),
      reelThumbnails: page.locator('.live2ai_social-brick-item .live2ai_brick_layout_img'),
      reelAuthorOnCard: page.locator('.live2ai_social-brick-item .live2ai_gallery_item_title'),
      viewMoreButton: page.locator('.live2ai_load_more_btn_wrapper'),

      expandedModal: page.locator('.carousel__container'),

      closeIcon: page.locator("img[alt='Close']"),

      currentCarouselItem: page.locator('.live2ai_carousel__item[data-current="true"]'),

      leftArrow: page.locator(
        'button[aria-label="previous-post"]'
      ),
      rightArrow: page.locator('.live2ai_carousel__button.live2ai_carousel__button--next'),

      muteButton: page.locator(
        "svg[width='24'][height='24'][viewBox='0 0 24 24']"
      ).first(),

      videoElement: page.locator('.live2ai_video_wrapper video, .live2ai_custom-video-wrapper video'),

      authorDetails: page.locator('.live2ai_user'),

      authorName: page.locator('.live2ai_user p, .live2ai_user span, .live2ai_user h3'),
    };

    // ── JOIN THE CLUB / NEWSLETTER SUBSCRIPTION SECTION ───────────
    this.joinTheClub = {

      footerContainer: page.locator('.footerContainer#footer'),

      section: page.locator('.content-footer#newsletter'),
      subSection: page.locator('.content-sub-footer'),

      headingWrapper: page.locator('.footer-heading'),
      heading: page.locator('.footer-heading h2'),
      subTitle: page.locator('.footer-subTitle'),

      inputContainer: page.locator('.inputContainer'),
      emailInput: page.locator('.inputContainer input[type="email"]'),
      signUpButton: page.locator('.inputContainer button.sign-up-link'),

      checkboxContainer: page.locator('.checkboxContainer'),
      leftCheckbox: page.locator('.checkboxContainer .leftcheckbox'),
      rightCheckbox: page.locator('.checkboxContainer .rightCheckbox'),
      consentCheckbox: page.locator('#marketingConsent'),
      consentTextBlock: page.locator('#marketingConsentText'),
      consentLinks: page.locator('#marketingConsentText a[href]'),
    };

    // ── CAUTION NOTICE SECTION (FOOTER) ───────────────────────────
    this.cautionNotice = {

      section: page.locator('.caution-notice'),

      title: page.locator('.caution-notice p.bold').first(),

      paragraphs: page.locator('.caution-notice p'),

      chakshuPortalLink: page.locator('.caution-notice a[href*="sancharsaathi.gov.in"]'),
    };

    // ── BE PICKS SECTION ──────────────────────────────────────
    this.bePicks = {

      section: page.locator('.bebe-swiper-container'),

      productCards: page.locator('.editor-product-card'),

      productImages: page.locator('.editor-product-card img'),

      productTitles: page.locator('.editor-product-card .productDetail h2.icon'),

      productPrices: page.locator('.editor-product-card .discountPrice'),

      taxText: page.locator('.editor-product-card .taxText'),

      wishlistIcons: page.locator('.bebe-swiper-container .swiper-slide-active .wishlistIcon, .bebe-swiper-container .swiper-slide-visible .wishlistIcon').first(),

      viewButtons: page.locator('.editor-product-card a.buttonWithBorder.primaryButton'),

      leftArrow: page.locator('.bebe-swiper-container .swiper-button-prev'),

      rightArrow: page.locator('.bebe-swiper-container .swiper-button-next'),

      letsDiveInButton: page.locator('a.buttonWithBorder.secondaryButton:has-text("Dive In")')
    };

    // ── BEAUTYPEDIA / BEAUTY LINGO SECTION ───────────────────────────

    this.beautyLingo = {

      section: page.locator('div.HomeBeautyLingo'),

      textContainer: page.locator('div.HomeBeautyLingo .banner-text'),

      heading: page.locator(
        'div.HomeBeautyLingo .banner-text h2'
      ),

      video: page.locator(
        'div.HomeBeautyLingo video.banner-video'
      ),

      openBeautypediaButton: page.locator(
        'div.HomeBeautyLingo .button-container a[href="/beautypedia"]'
      ).first(),

      buttonText: page.locator(
        'div.HomeBeautyLingo .button-container a[href="/beautypedia"]'
      ).first()
    };

    // ============================================================
    // Hero Carousel
    // ============================================================

    this.beautyEditSection =
      page.locator('.homeBeautyEditContent .carousel-container[aria-label="Article Carousel"]');

    this.heroCarousel =
      this.beautyEditSection;

    this.heroImage =
      this.beautyEditSection.locator('.swiper-slide-active .image-swiper-container img').first();

    this.articleTitle =
      this.beautyEditSection.locator('.swiper-slide-active h2.slide-title');

    this.articleDescription =
      this.beautyEditSection.locator('.swiper-slide-active .slide-desc p');

    this.readTime =
      this.beautyEditSection.locator('.swiper-slide-active .article-readtime');

    this.publishDate =
      this.beautyEditSection.locator('.swiper-slide-active .article-date');

    this.authorName =
      this.beautyEditSection.locator('.swiper-slide-active .author-details p');

    this.likeButton =
      this.beautyEditSection.locator('.swiper-slide-active button.like');

    this.shareButton =
      this.beautyEditSection.locator('.swiper-slide-active button.share');

    this.diveInButton =
      this.beautyEditSection.locator('.swiper-slide-active .button-container a');

    this.rightArrow =
      this.beautyEditSection.locator('.swiper-button-next');

    this.leftArrow =
      this.beautyEditSection.locator('.swiper-button-prev');

    this.loginPopup =
      page.locator('.login-popup, .loginModal, [class*="login"][class*="modal"], [class*="login"][class*="popup"]');

    this.sharePopup =
      page.locator('.popup-content h3.share-title');

    this.loginPopup = page.locator('.modalPoplogin');

    this.loginCloseButton = page.locator(
      '.modalPoplogin button.close, .modalPoplogin .closeIcon'
    );

    this.loginCancelButton = page.locator(
      '.modalPoplogin button.greyButton'
    );

    this.cookieBannerAccept = page.locator('#onetrust-accept-btn-handler');

    this.shareTitle =
      page.locator('h3.share-title');

    this.instagramShare =
      page.locator('button.instagram-icon');

    this.whatsappShare =
      page.locator('button.whatsapp-icon');

    this.mailShare =
      page.locator('button.mail-icon');

    this.twitterShare =
      page.locator('button.twitter-icon');

    this.copyLinkButton =
      page.locator('button.copy-link-btn');

    this.closeSharePopup =
      page.locator('button.close-btn[aria-label="Close share popup"]');

  }

  // ── BANNER HELPERS ────────────────────────────────────────────

  async navigateToHome() {
    await this.goto('/');
  }

  async stopAutoplay() {
    await this.page.evaluate(() => {
      const swiper = document.querySelector('.homebannerSwiper')?.swiper;
      if (swiper?.autoplay) swiper.autoplay.stop();
    });
  }

  async isAutoplayRunning() {
    return this.page.evaluate(() => {
      const swiper = document.querySelector('.homebannerSwiper')?.swiper;
      return swiper?.autoplay?.running ?? false;
    });
  }

  async getActiveSlideIndex() {
    return this.page.evaluate(() => {
      const swiper = document.querySelector('.homebannerSwiper')?.swiper;
      return swiper?.realIndex ?? -1;
    });
  }

  async clickBullet(index) {
    await this.page.evaluate((idx) => {
      const swiper = document.querySelector('.homebannerSwiper')?.swiper;
      if (swiper) swiper.slideTo(idx);
    }, index);

    await this.page.waitForTimeout(1500);
    await this.page.waitForFunction(
      (expectedIndex) => {
        const swiper = document.querySelector('.homebannerSwiper')?.swiper;
        return swiper?.realIndex === expectedIndex;
      },
      index,
      { timeout: 5000 },
    ).catch(() => { });
  }

  async getTotalSlides() {
    return this.banner.slides.count();
  }

  // ── SEARCH HELPERS ────────────────────────────────────────────

  async openSearch() {
    await this.search.searchBtn.click();
    await this.search.modalOverlay.waitFor({ state: 'visible', timeout: 10000 });
    await this.search.inputField.waitFor({ state: 'visible', timeout: 10000 });
  }

  async typeSearchKeyword(keyword) {
    await this.search.inputField.click();
    await this.search.inputField.fill(keyword);
    await this.page.waitForTimeout(2000);
  }

  async clearSearchInput() {
    const visible = await this.search.clearIcon.isVisible().catch(() => false);
    if (visible) {
      await this.search.clearIcon.click();
      await this.page.waitForTimeout(1500);
    } else {
      await this.search.inputField.fill('');
    }
  }

  async closeSearch() {
    await this.search.closeIconDesktop.click();
    await this.search.modalOverlay.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async getFirstRecentSearchText() {
    const count = await this.search.recentSearchItems.count();
    if (count === 0) return null;
    return (await this.search.recentSearchTexts.first().textContent()).trim();
  }

  // ── ARTICLE SECTION HELPERS ───────────────────────────────────

  async scrollToArticleSection() {
    await this.articleSection.section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
  }

  async selectArticleCategory(categoryName) {
    const category = this.articleSection.categoryButtons.filter({ hasText: categoryName });
    await category.first().click({ force: true });

    await expect
      .poll(async () => (await this.getActiveCategoryText())?.trim(), { timeout: 8000 })
      .toContain(categoryName);

    await this.page.waitForTimeout(1000);
  }

  async getActiveCategoryText() {
    return (await this.articleSection.activeCategory.textContent())?.trim();
  }

  async bebeNavigateToHome() {
    await this.goto('/');
    await this.page.waitForTimeout(2000);

    await expect(this.logo).toBeVisible({ timeout: 10000 });
    await this.profileIcon.click();
    await this.logo.click();
  }

  async viewIcons() {
    await expect(this.searchIcon).toBeVisible({ timeout: 10000 });
    await expect(this.profileIcon).toBeVisible({ timeout: 10000 });
    await expect(this.cartIcon).toBeVisible({ timeout: 10000 });
  }

  async verifyBannerSection() {
    await expect(this.banner.section).toBeVisible({ timeout: 15000 });
  }

  async cookieAction() {
    await expect(this.cookieBanner).toBeVisible({ timeout: 10000 });
    await expect(this.cookieLink).toBeVisible({ timeout: 10000 });
    await this.cookieLink.click();
    await expect(this.cookieBannerAcceptBtn).toBeVisible({ timeout: 10000 });
    await this.cookieBannerAcceptBtn.click();
  }


  // ============================================================
  // SEARCH ACTIONS
  // ============================================================

  async searchKeyword(keyword) {
    await this.search.inputField.fill('');
    await this.search.inputField.fill(keyword);
    await this.search.inputField.press('Enter');
  }

  // ============================================================
  // SEARCH VALIDATIONS
  // ============================================================

  async verifySearchModalOpened() {
    await expect(this.search.modalOverlay).toBeVisible();
    await expect(this.search.inputField).toBeVisible();
  }

  async verifySearchModalClosed() {
    await expect(this.search.modalOverlay).toBeHidden();
  }

  async getSearchInputValue() {
    return await this.search.inputField.inputValue();
  }

  async verifyNoResultUI() {
    await this.page.waitForTimeout(2000);

    const noResultMsg = this.page.locator(
      `text=/No (search )?result(s)? for/i,
       [class*="noResult"],
       [class*="no-result"],
       [class*="emptyResult"],
       [class*="empty-result"]`
    );

    const zeroResultText = this.page.locator(
      `text=/0 result/i`
    );

    const noResultVisible =
      await noResultMsg.first().isVisible().catch(() => false);

    const zeroResultVisible =
      await zeroResultText.first().isVisible().catch(() => false);

    return {
      noResultVisible,
      zeroResultVisible
    };
  }

  async verifyInvalidKeyword(keyword) {
    await this.searchKeyword(keyword);

    const {
      noResultVisible,
      zeroResultVisible
    } = await this.verifyNoResultUI();

    return noResultVisible || zeroResultVisible;
  }

  async verifyBlankSearchBehaviour() {

    await this.search.inputField.fill('');
    await this.search.inputField.press('Enter');

    await this.page.waitForTimeout(2000);

    const modalStillOpen =
      await this.search.modalOverlay.isVisible().catch(() => false);

    const inputStillVisible =
      await this.search.inputField.isVisible().catch(() => false);

    const noResultLocator = this.page.locator(
      `text=/No (search )?result(s)? for/i,
       [class*="noResult"],
       [class*="no-result"]`
    );

    const noResultVisible =
      await noResultLocator.first().isVisible().catch(() => false);

    return (
      modalStillOpen ||
      inputStillVisible ||
      noResultVisible
    );
  }

  async isCartSliderOpened() {

    return await this.cart.modalOpen
      .isVisible()
      .catch(() => false);
  }

  async addLakmeProductsToCart(count = 3, quantities = null) {

    const SEARCH_KEYWORD = 'Lakme';

    const expectedQuantities =
      Array.isArray(quantities) && quantities.length === count
        ? quantities
        : new Array(count).fill(1);

    const safeWaitForLoad = async (page, state, timeout) => {
      await page.waitForLoadState(state, { timeout }).catch(() => { });
    };

    await this.openSearch();
    await this.page.waitForTimeout(500);

    await this.search.inputField.fill(SEARCH_KEYWORD);
    await this.search.inputField.press('Enter');
    await safeWaitForLoad(this.page, 'domcontentloaded', 15000);
    await this.page.waitForTimeout(2000);

    await expect(
      this.products.resultCards.first()
    ).toBeVisible({ timeout: 20000 });

    const productsCount = await this.products.productLinks.count();
    console.log(`   Found ${productsCount} ${SEARCH_KEYWORD} products`);

    if (productsCount < count) {
      throw new Error(`Only ${productsCount} products found for ${SEARCH_KEYWORD}, need ${count}`);
    }

    const productHrefs = [];
    const productNamesFromSearch = [];
    let idx = 0;

    while (productHrefs.length < count && idx < productsCount) {
      const href = await this.products.productLinks.nth(idx).getAttribute('href').catch(() => null);
      if (href && !productHrefs.includes(href)) {
        const nameAtIdx = (
          await this.products.productTitles.nth(idx).textContent().catch(() => '')
        ).trim();
        productHrefs.push(href);
        productNamesFromSearch.push(nameAtIdx);
        console.log(`   Collected unique href ${productHrefs.length}: ${href} (${nameAtIdx})`);
      }
      idx++;
    }

    if (productHrefs.length < count) {
      throw new Error(`Could only collect ${productHrefs.length} unique product hrefs, need ${count}`);
    }

    const modalOpen = await this.search.modalOverlay.isVisible().catch(() => false);
    if (modalOpen) {
      await this.closeSearch().catch(() => { });
    }

    const addedProducts = [];

    for (let i = 0; i < count; i++) {

      console.log(`   🔸 Adding product ${i + 1} of ${count} to cart`);

      const href = productHrefs[i];
      const expectedName = productNamesFromSearch[i];
      const expectedQty = expectedQuantities[i];

      const productUrl = href.startsWith('http')
        ? href
        : `${new URL(this.page.url()).origin}${href}`;

      console.log(`   Navigating to: ${productUrl}`);

      await this.page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await safeWaitForLoad(this.page, 'domcontentloaded', 15000);
      await this.page.waitForTimeout(1500);
      await this.closeLoginPopupIfPresent().catch(() => { });
      await this.acceptCookiesIfPresent().catch(() => { });

      const addToCartBtn = this.page.locator(
        '.product-add-view-desktop button.buttonWithBorder.primaryButton'
      ).first();

      await addToCartBtn.waitFor({ state: 'visible', timeout: 20000 });

      if (expectedQty > 1) {

        const increaseBtnVisible =
          await this.productPage.increaseQuantity.first().isVisible().catch(() => false);

        if (increaseBtnVisible) {
          for (let q = 1; q < expectedQty; q++) {
            await this.productPage.increaseQuantity.first().click().catch(() => { });
            await this.page.waitForTimeout(500);
          }
        } else {
          console.log('   ⚠️ Quantity increase control not visible on PDP, defaulting quantity to 1');
        }
      }

      const countBefore = await this.getCartBadgeCount().catch(() => 0);
      const expectedBadgeAfter = countBefore + expectedQty;

      let added = false;

      for (let attempt = 1; attempt <= 3 && !added; attempt++) {

        await addToCartBtn.click();

        try {
          await this.page.waitForFunction(
            (expected) => {
              const el = document.querySelector('.cart-count, .cart-badge, .cart-quantity');
              if (!el) return false;
              const val = parseInt((el.textContent || '').trim(), 10) || 0;
              return val >= expected;
            },
            expectedBadgeAfter,
            { timeout: 8000 }
          );
          added = true;
        } catch (e) {
          console.log(`   ⚠️ Attempt ${attempt}: cart badge did not reach ${expectedBadgeAfter}, retrying...`);
          await this.page.waitForTimeout(1500);
        }
      }

      if (!added) {
        const finalCount = await this.getCartBadgeCount().catch(() => countBefore);
        console.log(`   ⚠️ Product ${i + 1} may not have been added. Badge count: ${finalCount}`);
      }

      addedProducts.push({
        name: expectedName,
        href,
        quantity: expectedQty
      });

      console.log(`   ✅ Product ${i + 1} added to cart (qty: ${expectedQty})`);
    }

    await this.navigateToHome();
    await safeWaitForLoad(this.page, 'domcontentloaded', 15000);
    await this.page.waitForTimeout(1000);
    await this.closeLoginPopupIfPresent().catch(() => { });

    const totalExpectedCount = addedProducts.reduce((sum, p) => sum + p.quantity, 0);

    const finalBadgeCount = await this.getCartBadgeCount().catch(() => 0);
    console.log(`   Final cart badge count after adding all products: ${finalBadgeCount}`);

    if (finalBadgeCount < totalExpectedCount) {
      throw new Error(`Only ${finalBadgeCount} of ${totalExpectedCount} expected SKU quantity confirmed in cart after all add attempts`);
    }

    this.lastAddedProducts = addedProducts;
    this.lastAddedTotalCount = totalExpectedCount;

    return addedProducts;
  }

  async debugCartDOM() {
    const html = await this.cart.modalOpen.innerHTML().catch(async () => {
      return await this.page.locator('[class*="cart"]').first().innerHTML().catch(() => 'NOT FOUND');
    });
    console.log('=== CART DOM DEBUG ===');
    console.log(html.substring(0, 3000));
    console.log('=== END CART DOM ===');
  }

  async getCartBadgeCount() {

    const visible =
      await this.cart.badge
        .isVisible()
        .catch(() => false);

    if (!visible) return 0;

    const text =
      await this.cart.badge.textContent();

    return Number(text.trim());
  }

  async getCartItemCount() {

    return await this.cart.itemCards.count();
  }

  async getProductName() {

    return await this.cart.productName
      .first()
      .textContent();
  }

  async getProductPrice() {

    return await this.cart.productPrice
      .first()
      .textContent();
  }

  async getCartItemsDetails() {

    const count = await this.cart.itemCards.count();
    const items = [];

    for (let i = 0; i < count; i++) {

      const card = this.cart.itemCards.nth(i);

      const name = (
        await card.locator('.productDetail > h2.icon').textContent().catch(() => '')
      ).trim();

      const qtyText = (
        await card.locator('.productQuantity .quantity p').textContent().catch(() => '0')
      ).trim();

      const quantity = parseInt(qtyText, 10) || 0;

      const price = (
        await card.locator('.productPrice .discountPrice').textContent().catch(() => '')
      ).trim();

      items.push({ name, quantity, price });
    }

    return items;
  }

  normalizeProductName(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  async verifyCartMatchesAddedProducts(expectedProducts) {

    const cartItems = await this.getCartItemsDetails();

    const results = expectedProducts.map((expected) => {

      const expectedNorm = this.normalizeProductName(expected.name);

      const match = cartItems.find((item) => {
        const actualNorm = this.normalizeProductName(item.name);
        return actualNorm.includes(expectedNorm) || expectedNorm.includes(actualNorm);
      });

      return {
        expectedName: expected.name,
        expectedQty: expected.quantity,
        matched: !!match,
        actualName: match ? match.name : null,
        actualQty: match ? match.quantity : null
      };
    });

    const allMatched = results.every((r) => r.matched && r.actualQty === r.expectedQty);

    return { cartItems, results, allMatched };
  }

  // ── AS SEEN ON GRAM HELPERS ────────────────────────────────────

  async debugAsSeenOnGramDOM() {

    console.log('=== AS SEEN ON GRAM DEBUG ===');

    const shadowContent = await this.page.evaluate(() => {
      const hostEl = document.querySelector('#live2ai-embed-gom1lk0lm4, [id^="live2ai-embed-"]');
      if (!hostEl) return 'HOST ELEMENT NOT FOUND';

      const shadowRoot = hostEl.shadowRoot;
      if (!shadowRoot) return 'NO SHADOW ROOT (closed or not attached)';

      const wrapper = shadowRoot.querySelector('.live2ai-socialbrick-wrapper');
      return wrapper ? wrapper.outerHTML.substring(0, 4000) : 'WRAPPER NOT FOUND IN SHADOW DOM';
    }).catch((err) => `ERROR: ${err.message}`);

    console.log(shadowContent);
    console.log('=== END AS SEEN ON GRAM DEBUG ===');
  }

  async debugReelModalDOM() {

    console.log('=== REEL MODAL DEBUG ===');

    const modalContent = await this.page.evaluate(() => {
      const hostEl = document.querySelector('#live2ai-embed-gom1lk0lm4, [id^="live2ai-embed-"]');
      if (!hostEl) return 'HOST ELEMENT NOT FOUND';

      const shadowRoot = hostEl.shadowRoot;
      if (!shadowRoot) return 'NO SHADOW ROOT';

      const candidates = shadowRoot.querySelectorAll(
        '[class*="lightbox"], [class*="modal"], [class*="overlay"], [class*="popup"], [class*="player"]'
      );

      if (candidates.length === 0) return 'NO MODAL/LIGHTBOX ELEMENT FOUND IN SHADOW DOM';

      return Array.from(candidates)
        .map((el, i) => `--- Candidate ${i + 1}: class="${el.className}" ---\n${el.outerHTML.substring(0, 2000)}`)
        .join('\n\n');
    }).catch((err) => `ERROR: ${err.message}`);

    console.log(modalContent);
    console.log('=== END REEL MODAL DEBUG ===');
  }

  async debugReelControlsDOM() {
    console.log('=== REEL CONTROLS DEBUG ===');

    const result = await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      if (!shadowRoot) return 'NO SHADOW ROOT';

      const container = shadowRoot.querySelector('.carousel__container');
      if (!container) return 'CAROUSEL CONTAINER NOT FOUND IN SHADOW ROOT';

      const svgs = container.querySelectorAll('svg');
      let output = `Found ${svgs.length} SVG elements in carousel:\n\n`;

      svgs.forEach((svg, i) => {
        const rect = svg.getBoundingClientRect();
        const shape = svg.querySelector('polygon, path');
        const sig = shape?.getAttribute('points') || shape?.getAttribute('d') || '';
        output += `SVG ${i}: sig="${sig}", pos=(${Math.round(rect.x)},${Math.round(rect.y)}), size=${Math.round(rect.width)}x${Math.round(rect.height)}\n`;
      });

      return output;
    }).catch((err) => `ERROR: ${err.message}`);

    console.log(result);
    console.log('=== END REEL CONTROLS DEBUG ===');
  }

  async isLeftButtonDisabled() {
    return await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      if (!shadowRoot) return null;

      const btn = shadowRoot.querySelector('.live2ai_carousel__button--previous');
      return btn ? btn.disabled : null;
    }).catch(() => null);
  }

  async getLiveAIShadowRoot() {
    return await this.page.evaluateHandle(() => {
      const host =
        document.querySelector('[id^="live2ai-embed-"]');

      return host?.shadowRoot || null;
    });
  }

  async scrollToAsSeenOnGramSection() {
    await this.asSeenOnGram.section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
  }

  async getReelCount() {
    return await this.asSeenOnGram.reelCards.count();
  }

  async clickViewMore() {
    await this.asSeenOnGram.viewMoreButton.scrollIntoViewIfNeeded();
    await this.asSeenOnGram.viewMoreButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickFirstReel() {
    const firstReel = this.asSeenOnGram.reelCards.first();
    await firstReel.scrollIntoViewIfNeeded();
    await firstReel.waitFor({ state: 'visible', timeout: 10000 });
    await firstReel.click();

    await this.page.waitForTimeout(3000);

    for (let i = 0; i < 16; i++) {
      const hasContent = await this.page.evaluate(() => {
        const hostEl = document.querySelector('[id^="live2ai-embed-"]');
        const shadowRoot = hostEl?.shadowRoot;
        const overlay = shadowRoot?.querySelector('.carousel__overlay');
        return overlay ? overlay.innerHTML.trim().length > 0 : false;
      }).catch(() => false);

      if (hasContent) break;
      await this.page.waitForTimeout(500);
    }
  }


  async isReelModalOpened() {
    return await this.page.evaluate(() => {
      const host =
        document.querySelector('[id^="live2ai-embed-"]');

      if (!host?.shadowRoot) return false;

      const cards = host.shadowRoot.querySelector('.carousel__cards');
      return !!cards && cards.children.length > 0;
    });
  }

  async closeReelModal() {
    await this.asSeenOnGram.closeIcon.click();
    await this.page.waitForTimeout(1000);
  }

  async isVideoMuted() {
    return await this.asSeenOnGram.videoElement.first().evaluate(
      (video) => video.muted
    ).catch(() => null);
  }

  async navigateReelRight() {

    const coords = await this.page.evaluate(() => {

      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      if (!shadowRoot) return null;

      const isRightArrowShape = (svg) => {
        const shape = svg.querySelector('polygon, path');
        const sig = shape?.getAttribute('points') || shape?.getAttribute('d') || '';
        return sig.includes('m9 18 6-6-6-6') || sig.includes('M9 18L15 12L9 6');
      };

      for (const svg of shadowRoot.querySelectorAll('svg')) {
        if (!isRightArrowShape(svg)) continue;
        const clickTarget = svg.closest('button, [role="button"], [style*="cursor: pointer"], [style*="cursor:pointer"]') || svg;
        const rect = clickTarget.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        }
      }
      return null;
    });

    if (!coords) {
      console.log('   ⚠️ navigateReelRight: right arrow SVG not found');
      return false;
    }

    await this.page.mouse.click(coords.x, coords.y);
    await this.page.waitForTimeout(1500);

    return true;
  }

  async navigateReelLeft() {

    const leftBtn = this.page.getByRole(
      'button',
      { name: 'previous-post' }
    );

    await leftBtn.waitFor({
      state: 'visible',
      timeout: 10000
    });

    await leftBtn.click();

    await this.page.waitForTimeout(2500);

    return true;
  }

  async isVideoVisible() {

    return await this.page.evaluate(() => {

      const host =
        document.querySelector('[id^="live2ai-embed-"]');

      const shadowRoot = host?.shadowRoot;

      const video =
        shadowRoot?.querySelector('video');

      return !!video;

    });
  }

  async isCloseIconVisible() {
    return await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      if (!shadowRoot) return false;

      const isCloseShape = (svg) => {
        const shape = svg.querySelector('polygon, path');
        const sig = shape?.getAttribute('points') || shape?.getAttribute('d') || '';
        return sig.includes('M11 5L6 9H2V15H6L11 19V5');
      };

      for (const svg of shadowRoot.querySelectorAll('svg')) {
        if (!isCloseShape(svg)) continue;
        const rect = svg.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) return true;
      }
      return false;
    }).catch(() => false);
  }

  async clickCloseIcon() {
    await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      if (!shadowRoot) return;

      const isCloseShape = (svg) => {
        const shape = svg.querySelector('polygon, path');
        const sig = shape?.getAttribute('points') || shape?.getAttribute('d') || '';
        return sig.includes('M11 5L6 9H2V15H6L11 19V5');
      };

      for (const svg of shadowRoot.querySelectorAll('svg')) {
        if (!isCloseShape(svg)) continue;
        const rect = svg.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const clickTarget = svg.closest('[style*="cursor: pointer"], [style*="cursor:pointer"]') || svg;
          clickTarget.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          return;
        }
      }
    });
  }

  async isRightArrowVisible() {

    return await this.page.evaluate(() => {

      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      if (!shadowRoot) return false;

      const isRightArrowShape = (svg) => {
        const shape = svg.querySelector('polygon, path');
        const sig = shape?.getAttribute('points') || shape?.getAttribute('d') || '';
        return sig.includes('m9 18 6-6-6-6') || sig.includes('M9 18L15 12L9 6');
      };

      for (const svg of shadowRoot.querySelectorAll('svg')) {
        if (!isRightArrowShape(svg)) continue;
        const rect = svg.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) return true;
      }
      return false;

    });

  }

  async isLeftArrowVisible() {

    return await this.page.evaluate(() => {

      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      if (!shadowRoot) return false;

      const isLeftArrowShape = (svg) => {
        const shape = svg.querySelector('polygon, path');
        const sig = shape?.getAttribute('points') || shape?.getAttribute('d') || '';
        return sig.includes('m15 18-6-6 6-6') || sig.includes('M15 18L9 12L15 6');
      };

      for (const svg of shadowRoot.querySelectorAll('svg')) {
        if (!isLeftArrowShape(svg)) continue;
        const rect = svg.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) return true;
      }
      return false;

    });

  }

  async isMuteButtonVisible() {

    return await this.page.evaluate(() => {

      const host =
        document.querySelector('[id^="live2ai-embed-"]');

      const shadowRoot = host?.shadowRoot;

      if (!shadowRoot) return false;

      const video = shadowRoot.querySelector('video');
      if (!video) return false;

      const rect = video.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;

    });

  }

  async toggleMute() {
    await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      if (!shadowRoot) return;

      const video = shadowRoot.querySelector('video');
      if (video) {
        video.muted = !video.muted;
        return;
      }
    });
  }

  async getCurrentCarouselIndex() {

    return await this.page.evaluate(() => {

      const host =
        document.querySelector('[id^="live2ai-embed-"]');

      const shadowRoot =
        host?.shadowRoot;

      if (!shadowRoot) {
        return -1;
      }

      const items =
        Array.from(
          shadowRoot.querySelectorAll(
            '.live2ai_carousel__item'
          )
        );

      return items.findIndex(
        item =>
          item.getAttribute('data-current') === 'true'
      );

    });

  }

  async getVideoSrc() {
    return await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      const video = shadowRoot?.querySelector('video');
      return video?.currentSrc || video?.src || null;
    }).catch(() => null);
  }

  async getVideoMutedState() {
    return await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      const video = shadowRoot?.querySelector('video');
      return video ? video.muted : null;
    }).catch(() => null);
  }

  async getVideoBoundingBox() {
    return await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      const videoWrapper = shadowRoot?.querySelector(
        '.live2ai_video_wrapper, .live2ai_custom-video-wrapper'
      );
      if (!videoWrapper) return null;

      const video = videoWrapper.querySelector('video') || videoWrapper;
      const rect = video.getBoundingClientRect();

      console.log(`DEBUG videoBox: x=${rect.x}, y=${rect.y}, w=${rect.width}, h=${rect.height}`);

      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }).catch(() => null);
  }

  async getAuthorBoundingBox() {
    return await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      const author = shadowRoot?.querySelector('.live2ai_user');
      if (!author) return null;

      const rect = author.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return null;

      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }).catch(() => null);
  }

  async getAuthorNameText() {
    return await this.page.evaluate(() => {
      const host = document.querySelector('[id^="live2ai-embed-"]');
      const shadowRoot = host?.shadowRoot;
      const author = shadowRoot?.querySelector('.live2ai_user');
      return author?.textContent?.trim() || '';
    }).catch(() => '');
  }

  async debugLayoutBoxes() {

    const result = await this.page.evaluate(() => {

      const host =
        document.querySelector('[id^="live2ai-embed-"]');

      const shadowRoot =
        host?.shadowRoot;

      if (!shadowRoot) {
        return 'NO SHADOW ROOT';
      }

      const video =
        shadowRoot.querySelector('video');

      const author =
        shadowRoot.querySelector('.live2ai_user');

      const videoRect =
        video?.getBoundingClientRect();

      const authorRect =
        author?.getBoundingClientRect();

      return {
        video: videoRect
          ? {
            x: videoRect.x,
            y: videoRect.y,
            width: videoRect.width,
            height: videoRect.height
          }
          : null,

        author: authorRect
          ? {
            x: authorRect.x,
            y: authorRect.y,
            width: authorRect.width,
            height: authorRect.height
          }
          : null
      };
    });

    console.log('=== LAYOUT DEBUG ===');
    console.log(JSON.stringify(result, null, 2));
    console.log('====================');
  }

  async isCloseButtonVisible() {
    return await this.page.evaluate(() => {

      const host =
        document.querySelector('[id^="live2ai-embed-"]');

      const shadowRoot = host?.shadowRoot;

      if (!shadowRoot) return false;

      const svgs = shadowRoot.querySelectorAll('svg');

      return svgs.length >= 1;

    });
  }

  // ── JOIN THE CLUB / NEWSLETTER SUBSCRIPTION HELPERS ───────────

  async scrollToJoinTheClubSection() {
    await this.joinTheClub.section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
  }

  async isJoinTheClubSectionVisible() {
    return await this.joinTheClub.section.isVisible().catch(() => false);
  }

  async isEmailInputVisible() {
    return await this.joinTheClub.emailInput.isVisible().catch(() => false);
  }

  async isSignUpButtonVisible() {
    return await this.joinTheClub.signUpButton.isVisible().catch(() => false);
  }

  async isConsentCheckboxChecked() {
    return await this.joinTheClub.consentCheckbox.isChecked().catch(() => null);
  }

  async getConsentStatementText() {
    const rawText = await this.joinTheClub.consentTextBlock.textContent().catch(() => '');
    return (rawText || '').replace(/\s+/g, ' ').trim();
  }

  async getConsentLinkHrefs() {
    const count = await this.joinTheClub.consentLinks.count();
    const links = [];

    for (let i = 0; i < count; i++) {
      const link = this.joinTheClub.consentLinks.nth(i);
      const text = (await link.textContent().catch(() => '') || '').trim();
      const href = await link.getAttribute('href').catch(() => null);
      links.push({ text, href });
    }

    return links;
  }

  async verifyConsentLinkRedirect(index) {
    const link = this.joinTheClub.consentLinks.nth(index);
    const href = await link.getAttribute('href').catch(() => null);
    const target = await link.getAttribute('target').catch(() => null);

    await link.scrollIntoViewIfNeeded().catch(() => { });

    if (target === '_blank') {

      try {

        const [newPage] = await Promise.all([
          this.page.context().waitForEvent('page', { timeout: 10000 }),
          link.click({ timeout: 10000 }),
        ]);

        await newPage.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });
        const newUrl = newPage.url();
        await newPage.close().catch(() => { });

        return { href, newUrl, method: 'click-popup' };

      } catch (error) {

        console.log(`   ⚠️ Click did not open a new tab within timeout for link index ${index} (${error.message}). Falling back to direct navigation on the href.`);
      }

      if (!href) {
        return { href, newUrl: '', method: 'direct-navigation' };
      }

      const fallbackPage = await this.page.context().newPage();

      try {
        await fallbackPage.goto(href, { waitUntil: 'domcontentloaded', timeout: 20000 });
      } catch (error) {
        console.log(`   ⚠️ Direct navigation to href also failed: ${error.message}`);
      }

      const newUrl = fallbackPage.url();
      await fallbackPage.close().catch(() => { });

      return { href, newUrl, method: 'direct-navigation' };
    }

    await link.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
    const newUrl = this.page.url();

    await this.navigateToHome();
    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
    await this.scrollToJoinTheClubSection();

    return { href, newUrl, method: 'same-tab' };
  }

  // ── JOIN THE CLUB — SUBSCRIPTION FORM (VALID/INVALID EMAIL) HELPERS ──

  async enterEmail(email) {
    await this.joinTheClub.emailInput.click();
    await this.joinTheClub.emailInput.fill(email);
    await this.page.waitForTimeout(800);
  }

  async clearEmailInput() {
    await this.joinTheClub.emailInput.fill('');
    await this.page.waitForTimeout(500);
  }

  async getEmailInputValue() {
    return await this.joinTheClub.emailInput.inputValue().catch(() => '');
  }

  async setConsentCheckbox(shouldBeChecked) {
    const isChecked = await this.joinTheClub.consentCheckbox.isChecked().catch(() => false);
    if (isChecked !== shouldBeChecked) {
      await this.joinTheClub.consentCheckbox.click({ force: true });
      await this.page.waitForTimeout(500);
    }
  }

  async isSignUpButtonDisabled() {
    const disabledAttr =
      await this.joinTheClub.signUpButton.getAttribute('disabled').catch(() => null);

    const classAttr =
      (await this.joinTheClub.signUpButton.getAttribute('class').catch(() => '')) || '';

    return disabledAttr !== null || classAttr.includes('sign-up-invalid');
  }

  async clickSignUp() {
    await this.joinTheClub.signUpButton
      .click({ force: true, timeout: 5000 })
      .catch(() => { });
    await this.page.waitForTimeout(1500);
  }

  async getEmailValidityState() {
    return await this.joinTheClub.emailInput.evaluate((el) => ({
      valid: typeof el.checkValidity === 'function' ? el.checkValidity() : null,
      validationMessage: el.validationMessage || '',
      value: el.value
    })).catch(() => null);
  }

  async getVisibleEmailValidationMessage() {
    const emailContainer = this.joinTheClub.inputContainer;

    const candidates = emailContainer.locator(
      [
        '[class*="error"]',
        '[class*="Error"]',
        '[class*="validation"]',
        '[class*="Validation"]',
        '[class*="message"]',
        '[class*="Message"]',
        '[class*="invalid"]',
        '[class*="Invalid"]',
        '[role="alert"]',
        'p',
        'span',
        'div'
      ].join(', ')
    );

    const count = await candidates.count().catch(() => 0);

    for (let i = 0; i < count; i++) {
      const element = candidates.nth(i);

      if (!(await element.isVisible().catch(() => false))) {
        continue;
      }

      const text = (
        (await element.textContent().catch(() => '')) || ''
      ).trim();

      if (!text) {
        continue;
      }

      const isEmailValidationMessage =
        /invalid.*email/i.test(text) ||
        /enter.*valid.*email/i.test(text) ||
        /valid.*email.*address/i.test(text) ||
        /email.*address.*valid/i.test(text) ||
        /please.*enter.*email/i.test(text) ||
        /email.*required/i.test(text) ||
        /email.*cannot.*be.*blank/i.test(text);

      if (isEmailValidationMessage) {
        return text;
      }
    }

    return '';
  }

  async getConsentCheckboxValidityState() {
    return await this.joinTheClub.consentCheckbox.evaluate((el) => ({
      valid: typeof el.checkValidity === 'function' ? el.checkValidity() : null,
      validationMessage: el.validationMessage || '',
      checked: el.checked
    })).catch(() => null);
  }

  async getVisibleSignUpFeedbackMessage() {
    const locator = this.page.locator(
      [
        'text=/please\\s*accept|consent\\s*is\\s*required|agree.*continue|accept.*terms|check.*box.*continue/i',
        'text=/enter.*valid.*email|invalid.*email|valid email address/i',
        'text=/email.*is\\s*required|please.*enter.*email|email.*cannot.*be.*blank/i',
        'text=/thank you|subscribed|successfully|you.*re in|welcome to the club/i',
        '[class*="error"]',
        '[class*="Error"]',
        '[class*="success"]',
        '[class*="Success"]',
        '[class*="toast"]',
        '[class*="Toast"]',
        '[class*="snackbar"]',
        '[class*="validation"]',
        '[class*="message"]'
      ].join(', ')
    );

    const count = await locator.count().catch(() => 0);

    for (let i = 0; i < count; i++) {
      const el = locator.nth(i);
      const visible = await el.isVisible().catch(() => false);
      if (!visible) continue;

      const text = ((await el.textContent().catch(() => '')) || '').trim();
      if (text) return text;
    }

    return null;
  }

  // ── CAUTION NOTICE (FOOTER) HELPERS ───────────────────────────

  async scrollToCautionNoticeSection() {
    await this.cautionNotice.section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
  }

  async isCautionNoticeVisible() {
    return await this.cautionNotice.section.isVisible().catch(() => false);
  }

  async getCautionNoticeTitleText() {
    return ((await this.cautionNotice.title.textContent().catch(() => '')) || '').trim();
  }

  async getChakshuPortalLinkHref() {
    return await this.cautionNotice.chakshuPortalLink.getAttribute('href').catch(() => null);
  }

  async verifyChakshuPortalRedirect() {
    const link = this.cautionNotice.chakshuPortalLink;
    const href = await link.getAttribute('href').catch(() => null);
    const target = await link.getAttribute('target').catch(() => null);

    await link.scrollIntoViewIfNeeded().catch(() => { });

    if (target === '_blank') {

      try {

        const [newPage] = await Promise.all([
          this.page.context().waitForEvent('page', { timeout: 10000 }),
          link.click({ timeout: 10000 }),
        ]);

        await newPage.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });
        const newUrl = newPage.url();
        await newPage.close().catch(() => { });

        return { href, newUrl, method: 'click-popup' };

      } catch (error) {

        console.log(`   ⚠️ Click did not open a new tab within timeout (${error.message}). Falling back to direct navigation on the href.`);
      }

      if (!href) {
        return { href, newUrl: '', method: 'direct-navigation' };
      }

      const fallbackPage = await this.page.context().newPage();

      try {
        await fallbackPage.goto(href, { waitUntil: 'domcontentloaded', timeout: 20000 });
      } catch (error) {
        console.log(`   ⚠️ Direct navigation to href also failed: ${error.message}`);
      }

      const newUrl = fallbackPage.url();
      await fallbackPage.close().catch(() => { });

      return { href, newUrl, method: 'direct-navigation' };
    }

    await link.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
    const newUrl = this.page.url();

    await this.navigateToHome();
    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
    await this.scrollToCautionNoticeSection();

    return { href, newUrl, method: 'same-tab' };
  }

  async scrollToBePicksSection() {

    await this.bePicks.section.scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(2000);
  }

  async getBePicksProductCount() {

    return await this.bePicks.productCards.count();
  }

  async clickFirstViewButton() {

    await this.bePicks.viewButtons
      .first()
      .click();
  }

  async clickFirstWishlist() {

    await this.bePicks.wishlistIcons
      .first()
      .click();
  }

  async clickRightScroller() {
    await this.bePicks.rightArrow.click({ force: true });
    await this.page.waitForTimeout(1500);
  }

  async clickLeftScroller() {
    await this.bePicks.leftArrow.click({ force: true });
    await this.page.waitForTimeout(1500);
  }

  // =======================================================
  // BEAUTYPEDIA SECTION
  // =======================================================

  async scrollToBeautypediaSection() {

    await this.beautyLingo.section.scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(2000);
  }

  async isBeautypediaVisible() {

    return await this.beautyLingo.section
      .isVisible()
      .catch(() => false);
  }

  async getBeautypediaHeading() {

    const text = await this.beautyLingo.heading
      .textContent();

    return text.replace(/\s+/g, ' ').trim();
  }

  async clickOpenBeautypedia() {

    await this.beautyLingo.openBeautypediaButton.click();

    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
  }

  async clickRightArrow() {

    await this.rightArrow.click();

  }

  async clickLeftArrow() {

    await this.leftArrow.click();

  }

  async getCurrentSlideTitle() {

    return (
      await this.articleTitle
        .textContent()
    ).trim();

  }

  async isCarouselVisible() {

    return await this.heroCarousel
      .isVisible();

  }

  async isHeroImageVisible() {

    return await this.heroImage
      .isVisible();

  }

  async isLikeButtonVisible() {

    return await this.likeButton
      .isVisible();

  }

  async isShareButtonVisible() {

    return await this.shareButton
      .isVisible();

  }

  async isDiveInButtonVisible() {

    return await this.diveInButton
      .isVisible();

  }

  async closeLoginPopupIfPresent() {

    if (await this.loginPopup.isVisible().catch(() => false)) {

      if (await this.loginCloseButton.isVisible().catch(() => false)) {

        await this.loginCloseButton.click();

      }
      else if (await this.loginCancelButton.isVisible().catch(() => false)) {

        await this.loginCancelButton.click();

      }

      await this.page.waitForTimeout(1000);
    }

  }

  async acceptCookiesIfPresent() {

    if (
      await this.cookieBannerAccept
        .isVisible()
        .catch(() => false)
    ) {

      await this.cookieBannerAccept.click();

      await this.page.waitForTimeout(1000);

    }

  }

  /**
   * ✅ FIXED: this site's trackers stall the "networkidle" lifecycle event
   * indefinitely (per known BeBeautiful debugging pattern), which was
   * hanging here until the full test timeout. Only wait for
   * "domcontentloaded" (bounded, non-throwing), then rely on the
   * expect(page).toHaveURL(...) poll below — which has its own timeout —
   * to confirm the redirect actually completed.
   */
  async verifyDiveInNavigation(expectedPath) {
    await this.articleSection.diveInButton.scrollIntoViewIfNeeded();

    await expect(this.articleSection.diveInButton).toBeVisible({
      timeout: 10000,
    });

    await expect
      .poll(
        async () => await this.articleSection.diveInButton.getAttribute("href"),
        { timeout: 10000 }
      )
      .toContain(expectedPath);

    await this.closeLoginPopupIfPresent().catch(() => { });

    await this.articleSection.diveInButton.click({
      timeout: 10000,
      force: true,
    });

    await this.page.waitForLoadState("domcontentloaded", { timeout: 15000 }).catch(() => { });

    await expect(this.page).toHaveURL(
      new RegExp(expectedPath.replace("/", "\\/")),
      { timeout: 15000 }
    );
  }

  async getReelModalBoundingBox() {
    return await this.asSeenOnGram.expandedModal
      .first()
      .boundingBox()
      .catch(() => null);
  }

  async getCloseIconBoundingBox() {
    return await this.asSeenOnGram.closeIcon
      .first()
      .boundingBox()
      .catch(() => null);
  }

  async verifyCloseIconTopRightPosition() {
    const modalBox = await this.getReelModalBoundingBox();
    const closeBox = await this.getCloseIconBoundingBox();

    if (!modalBox || !closeBox) {
      return { modalBox, closeBox, isTopRight: false };
    }

    const closeCenterX = closeBox.x + closeBox.width / 2;
    const closeCenterY = closeBox.y + closeBox.height / 2;

    const isRight = closeCenterX >= modalBox.x + modalBox.width * 0.7;
    const isTop = closeCenterY <= modalBox.y + modalBox.height * 0.3;

    return { modalBox, closeBox, isTopRight: isRight && isTop };
  }

  async verifyVideoLeftAuthorRightLayout() {
    const modalBox = await this.getReelModalBoundingBox();
    const videoBox = await this.getVideoBoundingBox();
    const authorBox = await this.getAuthorBoundingBox();

    if (!modalBox || !videoBox || !authorBox) {
      return {
        modalBox,
        videoBox,
        authorBox,
        isVideoOnLeft: false,
        isAuthorOnRight: false,
      };
    }

    const modalMidX = modalBox.x + modalBox.width / 2;

    const videoCenterX = videoBox.x + videoBox.width / 2;
    const authorCenterX = authorBox.x + authorBox.width / 2;

    const isVideoOnLeft = videoCenterX <= modalMidX && videoCenterX < authorCenterX;
    const isAuthorOnRight = authorCenterX >= modalMidX && authorCenterX > videoCenterX;

    return { modalBox, videoBox, authorBox, isVideoOnLeft, isAuthorOnRight };
  }

  // ── SEARCH RESULT HELPERS ───────────────────────────────────────

  async verifyDefaultSearchState() {

    await expect(this.search.recentSearchSection).toBeVisible({ timeout: 10000 });
    await expect(this.search.latestReadsHeading).toBeVisible({ timeout: 10000 });

    const articleCards = this.search.articleCards;

    await expect(articleCards.first()).toBeVisible({ timeout: 15000 });

    const articleCount = await articleCards.count();

    if (articleCount === 0) {
      throw new Error('No latest read article cards found in default search state.');
    }

    const firstCard = articleCards.first();

    await expect(firstCard.locator('.vibeHeading')).toBeVisible();
    await expect(firstCard.locator('.vibeMeta')).toBeVisible();
    await expect(firstCard.locator('.authorName')).toBeVisible();

    const imageSrc = await firstCard.locator('picture img').first().getAttribute('src');

    if (!imageSrc) {
      throw new Error('Article image src missing in default search state.');
    }

    return articleCount;
  }

  async submitSearchAndWaitForResults(keyword) {

    await this.search.inputField.click({ force: true });

    await this.page.waitForTimeout(1000);

    await this.search.inputField.clear();

    await this.search.inputField.pressSequentially(keyword, { delay: 200 });

    await expect(this.search.inputField).toHaveValue(keyword, { timeout: 10000 });

    await this.search.inputField.press('Enter');

    await this.page.waitForLoadState('domcontentloaded').catch(() => { });

    await this.page.waitForFunction(() => {

      const products = document.querySelectorAll('.search-product-card').length;
      const tabs = document.querySelectorAll('.tabItem').length;
      const results = document.querySelectorAll('.resultsCount').length;

      return products > 0 || tabs > 0 || results > 0;

    }, { timeout: 30000 });

    await this.page.waitForTimeout(5000);
  }

  async verifyProductResultDetails() {

    const productCards = this.search.productCards;

    await expect(productCards.first()).toBeVisible({ timeout: 30000 });

    const productCount = await productCards.count();

    if (productCount === 0) {
      throw new Error('No product cards displayed in search results.');
    }

    const firstCard = productCards.first();

    const title = firstCard.locator('.productTitle h4');
    await expect(title).toBeVisible();
    const titleText = (await title.textContent())?.trim();

    if (!titleText) {
      throw new Error('Product title text is empty.');
    }

    const image = firstCard.locator('img.hotspotImg');
    await expect(image).toBeVisible();
    const imageSrc = await image.getAttribute('src');

    if (!imageSrc) {
      throw new Error('Product image src missing.');
    }

    const price = firstCard.locator('.discountPrice');
    await expect(price).toBeVisible();
    const priceText = (await price.textContent())?.trim();

    if (!priceText) {
      throw new Error('Product price text is empty.');
    }

    let discountText = 'N/A';

    const discount = firstCard.locator('.discountPricePercentage');

    if (await discount.count() > 0) {
      discountText = (await discount.first().textContent())?.trim();
    }

    const shopNow = firstCard.locator('.shopNowButton');
    await expect(shopNow).toBeVisible();

    const pdpHref =
      (await firstCard.getAttribute('href')) ||
      (await firstCard.locator('a').first().getAttribute('href'));

    if (!pdpHref) {
      throw new Error('Product PDP href not found.');
    }

    return { productCount, titleText, priceText, discountText, pdpHref };
  }

  async getSearchResultCount() {

    const resultCount = this.search.resultCount;

    await expect(resultCount).toBeVisible({ timeout: 20000 });

    const resultText = (await resultCount.textContent())?.trim();

    if (!resultText) {
      throw new Error('Result count text is empty.');
    }

    return resultText;
  }

  async verifyPdpNavigationFromHref(pdpHref, context) {

    if (!pdpHref) {
      throw new Error('No PDP href found to navigate.');
    }

    const fullUrl = new URL(pdpHref, this.page.url()).toString();

    const pdpPage = await context.newPage();

    await pdpPage.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await pdpPage.waitForLoadState('domcontentloaded').catch(() => { });

    const landedOnPdp = pdpPage.url().includes(pdpHref.replace(/^\//, ''));

    await pdpPage.close();

    if (!landedOnPdp) {
      throw new Error('PDP navigation did not land on the expected product page.');
    }

    return fullUrl;
  }

  async openArticlesTabInSearch() {

    const articlesTab = this.search.articlesTab;

    await expect(articlesTab).toBeVisible({ timeout: 15000 });

    await articlesTab.click({ force: true });

    await this.page.waitForTimeout(3000);
  }

  async verifyArticlesTabResults() {

    const articleCards = this.search.searchResultArticleCards;

    await expect(articleCards.first()).toBeVisible({ timeout: 15000 });

    const articleCount = await articleCards.count();

    if (articleCount === 0) {
      throw new Error('No article cards displayed under Articles tab.');
    }

    const firstArticle = articleCards.first();

    await expect(firstArticle.locator('.vibeHeading')).toBeVisible();
    await expect(firstArticle.locator('.vibeMeta')).toBeVisible();
    await expect(firstArticle.locator('.authorName')).toBeVisible();

    const articleImage = await firstArticle.locator('picture img').first().getAttribute('src');

    if (!articleImage) {
      throw new Error('Article image src missing under Articles tab.');
    }

    return articleCount;
  }

  async verifyRecentSearchAfterClear() {

    await this.clearSearchInput();

    await this.page.waitForTimeout(3000);

    const inputValue = await this.search.inputField.inputValue();

    if (inputValue !== '') {
      throw new Error('Search input was not cleared.');
    }

    await expect(this.search.recentSearchSection).toBeVisible({ timeout: 15000 });

    const recentCountAfter = await this.search.recentSearchItems.count();

    return recentCountAfter;
  }

  async verifySearchSuggestionsWhileTyping(keyword) {
    const input = this.search.inputField;

    await expect(input).toBeVisible({ timeout: 10000 });

    await input.click();
    await input.fill('');

    await input.fill(keyword);

    await expect(input).toHaveValue(keyword, { timeout: 10000 });

    await expect(this.search.modalOverlay).toBeVisible({ timeout: 10000 });

    return 0;
  }

  // ── SEARCH RESULT RELEVANCE HELPERS ────────────────────────────────

  async verifyProductResultsRelevance(keyword) {

    const count = await this.search.productNames.count();

    if (count === 0) {
      throw new Error('No product names found to verify relevance.');
    }

    const lowerKeyword = keyword.toLowerCase();
    const sampleSize = Math.min(count, 5);
    let matchCount = 0;

    for (let i = 0; i < sampleSize; i++) {

      const text = (
        await this.search.productNames.nth(i).textContent()
      )?.trim().toLowerCase() || '';

      if (text.includes(lowerKeyword)) {
        matchCount++;
      }
    }

    if (matchCount === 0) {
      throw new Error(`None of the sampled product results matched keyword "${keyword}".`);
    }

    return matchCount;
  }

  async verifyArticleResultsRelevance(keyword) {

    const titleLocator = this.search.searchResultArticleCards.locator('.vibeHeading');

    const count = await titleLocator.count();

    if (count === 0) {
      throw new Error('No article titles found to verify relevance.');
    }

    const lowerKeyword = keyword.toLowerCase();
    const sampleSize = Math.min(count, 5);
    let matchCount = 0;

    for (let i = 0; i < sampleSize; i++) {

      const text = (
        await titleLocator.nth(i).textContent()
      )?.trim().toLowerCase() || '';

      if (text.includes(lowerKeyword)) {
        matchCount++;
      }
    }

    if (matchCount === 0) {
      throw new Error(`None of the sampled article results matched keyword "${keyword}".`);
    }

    return matchCount;
  }

  async findLowerArticleSectionHandle() {
    const timeout = 20000;
    const startTime = Date.now();

    const emptyResult = () => ({
      handle: null,
      gramBox: null,
      matchedCardCount: 0
    });

    try {
      if (this.page.isClosed()) {
        return emptyResult();
      }

      await this.asSeenOnGram.section
        .waitFor({ state: 'attached', timeout: 10000 })
        .catch(() => { });

      await this.asSeenOnGram.section
        .scrollIntoViewIfNeeded()
        .catch(() => { });

      await this.page.waitForTimeout(1500);

      while (Date.now() - startTime < timeout) {
        if (this.page.isClosed()) {
          return emptyResult();
        }

        const result = await this.page.evaluate(() => {
          const gram = document.querySelector('.liveai');
          if (!gram) return { found: false, gramTop: null, sectionTop: null, count: 0 };

          const gramRect = gram.getBoundingClientRect();
          const gramBottom = gramRect.bottom + window.scrollY;

          const sections = Array.from(
            document.querySelectorAll('.topArticleCategory, .botArticleCategory')
          );

          const candidates = sections
            .map(section => {
              const rect = section.getBoundingClientRect();
              const absoluteTop = rect.top + window.scrollY;

              const cards = section.querySelectorAll(
                '.vibeCard, .nav_card_container, .link-card-content-container'
              );

              return { section, absoluteTop, cardCount: cards.length };
            })
            .filter(item => item.absoluteTop >= gramBottom - 50 && item.cardCount > 0)
            .sort((a, b) => a.absoluteTop - b.absoluteTop);

          if (candidates.length > 0) {
            const candidate = candidates[0];
            return {
              found: true,
              gramTop: gramRect.top + window.scrollY,
              sectionTop: candidate.absoluteTop,
              count: candidate.cardCount
            };
          }

          return { found: false, gramTop: gramRect.top + window.scrollY, sectionTop: null, count: 0 };
        }).catch(() => ({ found: false, gramTop: null, sectionTop: null, count: 0 }));

        if (result.found) {
          const handle = await this.page
            .locator('.topArticleCategory, .botArticleCategory')
            .filter({
              has: this.page.locator('.vibeCard, .nav_card_container, .link-card-content-container')
            })
            .evaluateAll((sections, data) => {
              const matching = sections.find(section => {
                const rect = section.getBoundingClientRect();
                const absoluteTop = rect.top + window.scrollY;
                const cards = section.querySelectorAll(
                  '.vibeCard, .nav_card_container, .link-card-content-container'
                ).length;
                return cards === data.count && Math.abs(absoluteTop - data.sectionTop) < 10;
              });

              if (!matching) {
                return null;
              }

              const tag =
                `tc016b-lower-${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2)}`;

              matching.setAttribute(
                'data-tc016b-lower-section',
                tag
              );

              return tag;
            }, result)
            .catch(() => null);

          if (handle) {
            const sectionLocator = this.page.locator(
              `[data-tc016b-lower-section="${handle}"]`
            );

            const elementHandle =
              await sectionLocator.elementHandle().catch(() => null);

            if (elementHandle) {
              return {
                handle: elementHandle,
                gramBox: null,
                matchedCardCount: result.count
              };
            }
          }
        }

        await this.page.evaluate(() => {
          window.scrollBy({
            top: 700,
            left: 0,
            behavior: 'instant'
          });
        }).catch(() => { });

        await this.page.waitForTimeout(500);
      }

      return emptyResult();

    } catch (error) {
      console.log(
        `⚠️ findLowerArticleSectionHandle failed: ${error.message}`
      );

      return emptyResult();
    }
  }

  async scrollToLowerArticleSection() {
    if (this.page.isClosed()) return;
    const result = await this.findLowerArticleSectionHandle();
    if (result?.handle) {
      await result.handle.scrollIntoViewIfNeeded().catch(() => { });
    }
    await this.safeWait(2000);
  }

  async verifySecondArticleSectionBelowGram() {

    const totalTopArticleCategoryNodes = await this.articleSection.allSections.count();

    await expect(this.asSeenOnGram.section).toBeVisible({ timeout: 15000 });

    const { handle, gramBox, matchedCardCount } = await this.findLowerArticleSectionHandle();

    if (!handle || matchedCardCount === 0) {
      throw new Error(
        `No article card(s) found below "As Seen on Gram" in the DOM (found ${totalTopArticleCategoryNodes} .topArticleCategory node(s) total, 0 distinct .vibeCard element(s) positioned below the Gram section after bounded page render).`
      );
    }

    if (this.page.isClosed()) {
      throw new Error('Page was closed before the lower article section could be fully verified (test timeout guard tripped).');
    }

    await handle.scrollIntoViewIfNeeded().catch(() => { });
    await this.safeWait(1000);

    const lowerBox = await handle.boundingBox().catch(() => null);

    let isBelowGram = false;

    if (gramBox && lowerBox) {
      isBelowGram = lowerBox.y >= gramBox.y - 10;
    } else {
      isBelowGram = true;
    }

    if (!isBelowGram) {
      await handle.dispose().catch(() => { });
      throw new Error('Located article cards below "As Seen on Gram" did not confirm as positioned below it on re-check.');
    }

    this._lowerArticleSectionHandle = handle;
    this._lowerArticleSectionCardCount = matchedCardCount;

    return { totalTopArticleCategoryNodes, lowerSectionFound: true, isBelowGram, matchedCardCount };
  }


  async verifyLowerArticleSectionContent() {

    const handle = this._lowerArticleSectionHandle;

    if (!handle) {
      throw new Error('Lower article section handle not found — call verifySecondArticleSectionBelowGram() first.');
    }

    const vibeCardCount = await handle.evaluate(
      (el) => el.querySelectorAll('.vibeCard').length
    ).catch(() => this._lowerArticleSectionCardCount || 0);

    const finalCardCount = vibeCardCount || this._lowerArticleSectionCardCount || 0;

    if (finalCardCount === 0) {
      await handle.dispose().catch(() => { });
      throw new Error('No article cards (.vibeCard) confirmed inside the second article section.');
    }

    const categoryCount = await handle.evaluate(
      (el) => el.querySelectorAll('.categoryButton').length
    ).catch(() => 0);

    const diveInVisible = await handle.evaluate(
      (el) => /dive in/i.test(el.textContent || '')
    ).catch(() => false);

    await handle.dispose().catch(() => { });
    this._lowerArticleSectionHandle = null;

    return { smallArticleCount: finalCardCount, categoryCount, diveInVisible };
  }

  async forceRenderBelowGramContent() {

    const scrollTask = this.page.evaluate(async () => {

      const distance = 600;
      const delay = 150;
      const maxDurationMs = 6000;
      const maxIterations = 40;

      const startTime = Date.now();
      let iterations = 0;

      while (
        iterations < maxIterations &&
        (Date.now() - startTime) < maxDurationMs
      ) {
        window.scrollBy(0, distance);
        iterations++;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

    }).catch(() => { });

    await Promise.race([
      scrollTask,
      new Promise((resolve) => setTimeout(resolve, 10000)),
    ]).catch(() => { });

    await this.page
      .waitForLoadState('domcontentloaded', { timeout: 8000 })
      .catch(() => { });

    await this.safeWait(1500);

    await this.asSeenOnGram.section.scrollIntoViewIfNeeded().catch(() => { });

    await this.safeWait(1000);
  }

  async safeWait(ms) {
    if (this.page.isClosed()) return;
    await this.page.waitForTimeout(ms).catch(() => { });
  }

  // ── SEARCH LAYOUT VERIFICATION HELPER (REUSABLE ACROSS HOMEPAGE / PDP / ARTICLE PAGES) ──

  async verifySearchLayoutOnCurrentPage() {

    const searchBtnVisible =
      await this.search.searchBtn.isVisible().catch(() => false);

    const profileIconVisible =
      await this.profileIcon.isVisible().catch(() => false);

    await this.openSearch();

    const inputFieldVisible =
      await this.search.inputField.isVisible().catch(() => false);

    const recentSearchVisible =
      await this.search.recentSearchSection.isVisible().catch(() => false);

    const latestReadsVisible =
      await this.search.latestReadsBox.isVisible().catch(() => false);

    return {
      searchBtnVisible,
      profileIconVisible,
      inputFieldVisible,
      recentSearchVisible,
      latestReadsVisible
    };
  }

}

module.exports = HomePage;
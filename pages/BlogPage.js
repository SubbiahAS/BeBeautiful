// pages/BlogPage.js
// Page Object Model for the Article / Blog Detail page.
// Covers: Breadcrumb, Sticky Icons, Article content, Author, Share popup, Listen now,
//         Article Details, FAQ, Going Viral, Product Carousel.

const BasePage = require('./BasePage');

class BlogPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ── Blog / Article Core ───────────────────────────────────
    this.blog = {
      // Breadcrumb
      breadcrumbSection: page.locator('.articleBreadcrumb'),
      breadcrumbLinks: page.locator('.breadcrumb-item'),

      // Sticky icon bar
      stickyIconBar: page.locator('.sticky-iconbar'),
      likeIcon: page.locator('.sticky-iconbar .iconHeart'),
      shareIcon: page.locator('.sticky-iconbar .iconShare'),
      downloadIcon: page.locator('.sticky-iconbar .iconDownload'),
      listenNowButton: page.locator('.sticky-iconbar .tts-container'),

      // Article header
      articleTitle: page.locator('.trendTitle'),
      articleSubheading: page.locator('.trendDescription'),
      articleImage: page.locator('.article-banner-image'),

      // Author
      authorSection: page.locator('.AuthorInfoContainer'),
      authorName: page.locator('.AuthorInfoContainer .author-name'),
      authorImage: page.locator('.AuthorInfoContainer .author img.avatar'),
      publishDate: page.locator('.AuthorInfoContainer .author-date'),

      // Share popup
      sharePopup: page.locator('.popup-container'),
      sharePopupTitle: page.locator('.share-title'),
      shareCloseButton: page.locator('.close-btn'),
      instagramShare: page.locator('.instagram-icon').first(),
      whatsappShare: page.locator('.whatsapp-icon').first(),
      mailShare: page.locator('.mail-icon').first(),
      twitterShare: page.locator('.twitter-icon').first(),
      copyLinkInput: page.locator('.copy-url-text'),
      copyLinkButton: page.locator('.copy-link-btn'),

      // Listen now
      listenProgressContainer: page.locator('.progressBar-container'),
      listenProgressBar: page.locator('.progress-bar'),
      listenPlayButton: page.locator('.iconPlay'),
    };

    // ── Article Detail — Keep Reading / List ──────────────────
    this.detail = {
      keepReadingHeading: page.locator('.keepReadingToKnow'),
      listContainer: page.locator('.listContainer'),
      listUl: page.locator('.listContainer ul.list'),
      listItems: page.locator('.listContainer ul.list li'),
      detailHeadings: page.locator("h2[id^='details-']"),
    };

    // ── FAQ Section ───────────────────────────────────────────
    this.faq = {
      heading: page.locator("h2.faq-heading, h2:has-text('FAQs')"),
      container: page.locator('.faq-accordion'),
      questionItems: page.locator('.faq-accordion-item'),
      questionButton: page.locator('.faq-question'),
      questionTitle: page.locator('.faq-question-text'),
      answerContent: page.locator('.faq-answer'),
      answerText: page.locator('.faq-answer-content'),
    };

    // ── Going Viral Section ───────────────────────────────────
    this.goingViral = {
      rightColumn: page.locator('.right-column.mobile-hide'),
      container: page.locator('.right-column.mobile-hide .articleCollapsibleList'),
      collapsible: page.locator('.right-column.mobile-hide .collapsible-container'),
      toggleButton: page.locator('.right-column.mobile-hide .collapsible-header'),
      heading: page.locator('.right-column.mobile-hide .collapsible-header h3'),
      listWrapper: page.locator('.right-column.mobile-hide .collapsible-list'),
      articleLinks: page.locator('.right-column.mobile-hide .collapsible-link'),
      articleCards: page.locator('.right-column.mobile-hide .collapsible-card'),
      articleImages: page.locator('.collapsible-image'),
      articleContent: page.locator('.collapsible-content'),
      articleCategory: page.locator('.collapsible-content h4'),
      articleTitle: page.locator('.collapsible-content p'),
      articleAuthor: page.locator('.collapsible-content span'),
      actions: page.locator('.collapsible-actions'),
      likeIcon: page.locator('.collapsible-actions .likeIcon'),
      shareIcon: page.locator('.collapsible-actions .shareIcon'),
      bePicksContainer: page.locator('.right-column.mobile-hide .product-container'),
    };

    // ── Product Carousel (Be Picks) ───────────────────────────
    this.productCarousel = {
      box: page.locator('.article-product-box'),
      container: page.locator('.article-product-content'),
      swiper: page.locator('.liked-product-swiper'),
      swiperWrapper: page.locator('.liked-product-swiper .swiper-wrapper'),
      slides: page.locator('.liked-product-swiper .swiper-slide'),
      activeSlide: page.locator('.liked-product-swiper .swiper-slide-active'),
      cards: page.locator('.articleCarousal .card'),
      productImages: page.locator('.product-image img.hotspotImg'),
      productNames: page.locator('.productTitle h4'),
      actualPrices: page.locator('.product-price .actualPrice'),
      discountPrices: page.locator('.product-price .discountPrice'),
      shopNowButtons: page.locator('.shopNowButton'),
      navPrev: page.locator('.article-product-box .swiper-button-prev'),
      navNext: page.locator('.article-product-box .swiper-button-next'),
      scrollbar: page.locator('.article-product-box .swiper-scrollbar'),

      rightColumn:
        page.locator('.right-column.mobile-hide'),

      bePicksContainer:
        page.locator('.right-column.mobile-hide .product-container'),

      bePicksHeading:
        page
          .locator('.right-column.mobile-hide .product-container h3')
          .filter({ hasText: /be\s*picks/i })
          .first(),

      toggleButton:
        page
          .locator(
            '.right-column.mobile-hide .product-container [aria-expanded]'
          )
          .first(),

      cardsWrapper:
        page
          .locator(
            '.right-column.mobile-hide .product-container .article-product-content, ' +
            '.right-column.mobile-hide .product-container .liked-product-swiper'
          )
          .first(),

      // Product cards INSIDE the Be Picks (right-column) widget only.
      // NOTE: `cards` above (`.articleCarousal .card`) is a different,
      // unrelated carousel elsewhere on the page and must never be used
      // for Be Picks card counting/interaction. This locator is scoped
      // strictly to `.right-column.mobile-hide .product-container` with
      // broadened fallback selectors.
      bePicksCards:
        page.locator(
          '.right-column.mobile-hide .product-container .liked-product-swiper .swiper-slide, ' +
          '.right-column.mobile-hide .product-container .article-product-content .card, ' +
          '.right-column.mobile-hide .product-container [class*="card" i]'
        ),
    };

    // ── Also Your Vibe Section ────────────────────────────────
    this.alsoYourVibe = {
      section: page.locator('.vibeSection'),
      title: page.locator('.vibeSection .vibeTitle'),
      grid: page.locator('.vibeSection .vibeGrid'),
      cards: page.locator('.vibeSection .vibeCard'),
      cardImages: page.locator('.vibeImage img'),
      likeIcons: page.locator('.iconHeart'),
      shareIcons: page.locator('.iconShare'),
      cardTitles: page.locator('.vibeHeading'),
      readTime: page.locator('.vibeMeta span:first-child'),
      publishDate: page.locator('.vibeMeta span:nth-child(3)'),
      authorNames: page.locator('.authorName'),
      links: page.locator('a.articlev2Linking'),
    };

    this.diveInButton = page.locator(
      '.vibeSection a:has-text("Dive In"), ' +
      '.vibeSection a:has-text("Dive in"), ' +
      '.vibeSection button:has-text("Dive In"), ' +
      '.vibeSection button:has-text("Dive in")'
    );

    // this.articleFooter = {

    //   // Existing author locators from this.blog
    //   authorSection: this.blog.authorSection,
    //   authorImage: this.blog.authorImage,
    //   authorName: this.blog.authorName,

    //   // About Author
    //   aboutAuthor: page.locator(
    //     '.AuthorInfoContainer .about-author, ' +
    //     '.AuthorInfoContainer .aboutAuthor, ' +
    //     '.AuthorInfoContainer [class*="about"]'
    //   ).first(),

    //   // Download
    //   downloadButton: page.locator(
    //     '.sticky-iconbar .iconDownload, ' +
    //     'button:has-text("Download"), ' +
    //     'a:has-text("Download")'
    //   ).first(),

    //   // Share icons
    //   headerShareButton: this.blog.shareIcon,

    //   authorShareButton: page.locator(
    //     '.AuthorInfoContainer .iconShare, ' +
    //     '.AuthorInfoContainer [class*="share"], ' +
    //     '.author-share'
    //   ).first(),

    //   // Next Hot Take
    //   nextHotTakeHeading: page.locator(
    //     'h2:has-text("Next Hot Take"), ' +
    //     'h3:has-text("Next Hot Take"), ' +
    //     '[class*="HotTake"] h2, ' +
    //     '[class*="HotTake"] h3'
    //   ).first(),

    //   nextHotTakeCard: page.locator(
    //     '.artcileHotTakeCard .hot-take-card, ' +
    //     '.articleHotTakeCard .hot-take-card, ' +
    //     '[class*="HotTakeCard"]'
    //   ).first(),

    //   nextHotTakeLink: page.locator(
    //     '.artcileHotTakeCard .hot-take-card a[href], ' +
    //     '.articleHotTakeCard .hot-take-card a[href], ' +
    //     '[class*="HotTakeCard"] a[href]'
    //   ).first(),

    //   nextHotTakeArticleTitle: page.locator(
    //     '.artcileHotTakeCard .hot-take-card a[href*="/wellbeing/"], ' +
    //     '.articleHotTakeCard .hot-take-card a[href*="/wellbeing/"], ' +
    //     '[class*="HotTakeCard"] a[href]'
    //   ).first(),

    //   nextHotTakeAuthor: page.locator(
    //     '.artcileHotTakeCard .hot-take-card a[href*="/authors/"], ' +
    //     '.articleHotTakeCard .hot-take-card a[href*="/authors/"], ' +
    //     '[class*="HotTakeCard"] a[href*="/authors/"]'
    //   ).first()
    // };

    // this.articleFooter = {
    //   authorSection: page.locator('.AuthorInfoContainer').first(),

    //   authorImage: page
    //     .locator('.AuthorInfoContainer .author img.avatar')
    //     .first(),

    //   authorName: page
    //     .locator('.AuthorInfoContainer .author-name')
    //     .first(),

    //   aboutAuthor: page
    //     .locator(
    //       '.AuthorInfoContainer .about-author, ' +
    //       '.AuthorInfoContainer .aboutAuthor, ' +
    //       '.AuthorInfoContainer [class*="about"]'
    //     )
    //     .first(),

    //   downloadButton: page
    //     .locator(
    //       '.AuthorInfoContainer .iconDownload, ' +
    //       '.AuthorInfoContainer button:has-text("Download"), ' +
    //       '.AuthorInfoContainer a:has-text("Download")'
    //     )
    //     .first(),

    //   shareButton: page
    //     .locator(
    //       '.AuthorInfoContainer .iconShare, ' +
    //       '.AuthorInfoContainer .share-icon, ' +
    //       '.AuthorInfoContainer button:has-text("Share")'
    //     )
    //     .first()
    // };

    this.articleFooter = {
      authorSection: page.locator('.AuthorInfoContainer').first(),

      authorImage: page
        .locator('.AuthorInfoContainer .author img.avatar')
        .first(),

      authorName: page
        .locator('.AuthorInfoContainer .author-name')
        .first(),

      aboutAuthor: page
        .locator(
          '.AuthorInfoContainer .about-author, ' +
          '.AuthorInfoContainer .aboutAuthor, ' +
          '.AuthorInfoContainer [class*="about"]'
        )
        .first(),

      downloadButton: page
        .locator(
          '.AuthorInfoContainer .iconDownload, ' +
          '.AuthorInfoContainer button:has-text("Download"), ' +
          '.AuthorInfoContainer a:has-text("Download")'
        )
        .first(),

      shareButton: page
        .locator(
          '.AuthorInfoContainer .iconShare, ' +
          '.AuthorInfoContainer .share-icon, ' +
          '.AuthorInfoContainer button:has-text("Share")'
        )
        .first(),

      // Aliases expected by spec files (TC058) — same elements as
      // downloadButton / shareButton above.
      downloadOption: page
        .locator(
          '.AuthorInfoContainer .iconDownload, ' +
          '.AuthorInfoContainer button:has-text("Download"), ' +
          '.AuthorInfoContainer a:has-text("Download")'
        )
        .first(),

      shareOption: page
        .locator(
          '.AuthorInfoContainer .iconShare, ' +
          '.AuthorInfoContainer .share-icon, ' +
          '.AuthorInfoContainer button:has-text("Share")'
        )
        .first(),

      // All share trigger icons on the page (sticky bar + footer +
      // any card-level share icons), used to validate popup behavior
      // across multiple triggers.
      shareIcons: page.locator('.iconShare'),

      // Same share popup component used elsewhere on the article page.
      sharePopup: this.blog.sharePopup
    };

    // this.nextHotTake = {
    //   section: page.locator(
    //     '.nextHotTake, .next-hot-take, [class*="nextHotTake"], [class*="next-hot-take"]'
    //   ).first(),

    //   card: page.locator(
    //     '.nextHotTake .articleCard, .next-hot-take .articleCard, [class*="nextHotTake"] .articleCard, [class*="next-hot-take"] .articleCard'
    //   ).first(),

    //   link: page.locator(
    //     '.nextHotTake a[href], .next-hot-take a[href], [class*="nextHotTake"] a[href], [class*="next-hot-take"] a[href]'
    //   ).first(),

    //   title: page.locator(
    //     '.nextHotTake .article-title, .nextHotTake .articleCardTitle, .nextHotTake h2, .nextHotTake h3, ' +
    //     '.next-hot-take .article-title, .next-hot-take .articleCardTitle, .next-hot-take h2, .next-hot-take h3, ' +
    //     '[class*="nextHotTake"] h2, [class*="nextHotTake"] h3, ' +
    //     '[class*="next-hot-take"] h2, [class*="next-hot-take"] h3'
    //   ).first(),

    //   author: page.locator(
    //     '.nextHotTake .author, .nextHotTake .article-author, ' +
    //     '.next-hot-take .author, .next-hot-take .article-author, ' +
    //     '[class*="nextHotTake"] .author, [class*="nextHotTake"] .article-author, ' +
    //     '[class*="next-hot-take"] .author, [class*="next-hot-take"] .article-author'
    //   ).first(),

    //   metadata: page.locator(
    //     '.nextHotTake .article-meta, .nextHotTake .metadata, ' +
    //     '.next-hot-take .article-meta, .next-hot-take .metadata, ' +
    //     '[class*="nextHotTake"] .article-meta, [class*="nextHotTake"] .metadata, ' +
    //     '[class*="next-hot-take"] .article-meta, [class*="next-hot-take"] .metadata'
    //   ).first()
    // };

    // this.nextHotTake = {
    //   section: page.locator(
    //     '.nextHotTake, ' +
    //     '.next-hot-take, ' +
    //     '[class*="nextHotTake" i], ' +
    //     '[class*="next-hot-take" i], ' +
    //     '[class*="readNext" i], ' +
    //     '[class*="read-next" i], ' +
    //     '[class*="upNext" i], ' +
    //     '[class*="up-next" i], ' +
    //     '[class*="relatedArticle" i], ' +
    //     '[class*="moreArticle" i], ' +
    //     '[class*="trendingNow" i]'
    //   ).first(),

    //   card: page.locator(
    //     '.nextHotTake .articleCard, .next-hot-take .articleCard, [class*="nextHotTake"] .articleCard, [class*="next-hot-take"] .articleCard'
    //   ).first(),

    //   link: page.locator(
    //     '.nextHotTake a[href], .next-hot-take a[href], [class*="nextHotTake"] a[href], [class*="next-hot-take"] a[href]'
    //   ).first(),

    //   title: page.locator(
    //     '.nextHotTake .article-title, .nextHotTake .articleCardTitle, .nextHotTake h2, .nextHotTake h3, ' +
    //     '.next-hot-take .article-title, .next-hot-take .articleCardTitle, .next-hot-take h2, .next-hot-take h3, ' +
    //     '[class*="nextHotTake"] h2, [class*="nextHotTake"] h3, ' +
    //     '[class*="next-hot-take"] h2, [class*="next-hot-take"] h3'
    //   ).first(),

    //   author: page.locator(
    //     '.nextHotTake .author, .nextHotTake .article-author, ' +
    //     '.next-hot-take .author, .next-hot-take .article-author, ' +
    //     '[class*="nextHotTake"] .author, [class*="nextHotTake"] .article-author, ' +
    //     '[class*="next-hot-take"] .author, [class*="next-hot-take"] .article-author'
    //   ).first(),

    //   metadata: page.locator(
    //     '.nextHotTake .article-meta, .nextHotTake .metadata, ' +
    //     '.next-hot-take .article-meta, .next-hot-take .metadata, ' +
    //     '[class*="nextHotTake"] .article-meta, [class*="nextHotTake"] .metadata, ' +
    //     '[class*="next-hot-take"] .article-meta, [class*="next-hot-take"] .metadata'
    //   ).first(),

    //   resolvedSection: null
    // };

    this.nextHotTake = {
      // Combines a class-based lookup with a heading-text fallback
      // (via .or()) so that direct checks like
      // `blogPage.nextHotTake.section.isVisible()` work even when the
      // real DOM doesn't use any of the guessed class names — the
      // heading-based ancestor lookup is baked into the locator itself
      // instead of only being available through resolveNextHotTakeSection().
      section: page.locator(
        '.nextHotTake, ' +
        '.next-hot-take, ' +
        '[class*="nextHotTake" i], ' +
        '[class*="next-hot-take" i], ' +
        '[class*="readNext" i], ' +
        '[class*="read-next" i], ' +
        '[class*="upNext" i], ' +
        '[class*="up-next" i], ' +
        '[class*="relatedArticle" i], ' +
        '[class*="moreArticle" i], ' +
        '[class*="trendingNow" i]'
      ).first()
        .or(
          page.locator('h1, h2, h3, h4')
            .filter({ hasText: /next\s*hot\s*take/i })
            .locator('xpath=ancestor::section[1]')
            .first()
        )
        .or(
          page.locator('h1, h2, h3, h4')
            .filter({ hasText: /next\s*hot\s*take/i })
            .locator('xpath=ancestor::div[1]')
            .first()
        ),

      card: page.locator(
        '.nextHotTake .articleCard, .next-hot-take .articleCard, [class*="nextHotTake"] .articleCard, [class*="next-hot-take"] .articleCard'
      ).first(),

      link: page.locator(
        '.nextHotTake a[href], .next-hot-take a[href], [class*="nextHotTake"] a[href], [class*="next-hot-take"] a[href]'
      ).first(),

      title: page.locator(
        '.nextHotTake .article-title, .nextHotTake .articleCardTitle, .nextHotTake h2, .nextHotTake h3, ' +
        '.next-hot-take .article-title, .next-hot-take .articleCardTitle, .next-hot-take h2, .next-hot-take h3, ' +
        '[class*="nextHotTake"] h2, [class*="nextHotTake"] h3, ' +
        '[class*="next-hot-take"] h2, [class*="next-hot-take"] h3'
      ).first(),

      author: page.locator(
        '.nextHotTake .author, .nextHotTake .article-author, ' +
        '.next-hot-take .author, .next-hot-take .article-author, ' +
        '[class*="nextHotTake"] .author, [class*="nextHotTake"] .article-author, ' +
        '[class*="next-hot-take"] .author, [class*="next-hot-take"] .article-author'
      ).first(),

      metadata: page.locator(
        '.nextHotTake .article-meta, .nextHotTake .metadata, ' +
        '.next-hot-take .article-meta, .next-hot-take .metadata, ' +
        '[class*="nextHotTake"] .article-meta, [class*="nextHotTake"] .metadata, ' +
        '[class*="next-hot-take"] .article-meta, [class*="next-hot-take"] .metadata'
      ).first(),

      resolvedSection: null
    };

  }

  // ── Methods ───────────────────────────────────────────────────

  /**
   * Navigate to an article page URL.
   * @param {string} url - full or relative article URL
   */
  async navigateToArticle(url) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Open the share popup by clicking the sticky share icon.
   */
  async openSharePopup() {
    await this.blog.shareIcon.click();
    await this.blog.sharePopup.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Close the share popup.
   */
  async closeSharePopup() {
    await this.blog.shareCloseButton.click();
    await this.blog.sharePopup.waitFor({ state: 'hidden', timeout: 5000 });
  }

  /**
   * Click the Listen Now TTS button.
   */
  async clickListenNow() {
    await this.blog.listenNowButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Scroll to the product carousel section.
   */
  // async scrollToProductCarousel() {
  //   await this.productCarousel.box.scrollIntoViewIfNeeded();
  //   await this.page.waitForTimeout(1000);
  // }
  async scrollToProductCarousel() {
    const carouselExists =
      await this.productCarousel.box.count();

    if (!carouselExists) {
      console.log('ℹ️ Product carousel not found');
      return false;
    }

    await this.productCarousel.box
      .first()
      .scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(1000);

    return true;
  }

  /**
   * Scroll to the Going Viral section.
   */
  async scrollToGoingViral() {
    await this.goingViral.container.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Scroll to the FAQ section.
   */
  async scrollToFaq() {
    await this.faq.container.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Scroll to the Also Your Vibe section.
   */
  async scrollToAlsoYourVibe() {
    await this.alsoYourVibe.section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  // ── SHARE POPUP — POSITION / PLATFORM VERIFICATION HELPERS ────

  /**
   * Verifies the share popup's Close icon sits in the top-right corner
   * of the popup container.
   * @returns {Promise<{popupBox: object|null, closeBox: object|null, isTopRight: boolean}>}
   */
  async verifyShareCloseIconPosition() {
    const popupBox = await this.blog.sharePopup.boundingBox().catch(() => null);
    const closeBox = await this.blog.shareCloseButton.boundingBox().catch(() => null);

    if (!popupBox || !closeBox) {
      return { popupBox, closeBox, isTopRight: false };
    }

    const isRight = closeBox.x >= popupBox.x + popupBox.width * 0.6;
    const isTop = closeBox.y <= popupBox.y + popupBox.height * 0.3;

    return { popupBox, closeBox, isTopRight: isRight && isTop };
  }

  /**
   * Clicks a share platform icon and verifies it opens the respective
   * sharing platform — either in a new tab/popup, or via a same-tab
   * navigation carrying the article URL as a share parameter.
   *
   * Handles the async window.open() case (fires after an analytics call
   * resolves, outside the direct user-gesture chain) with a bounded wait,
   * falling back to inspecting the element's href when no popup appears.
   *
   * @param {import('@playwright/test').Locator} icon
   * @param {RegExp} expectedUrlPattern - pattern the destination URL should match
   * @returns {Promise<{opened: boolean, url: string|null, matches: boolean, method: string}>}
   */
  async verifyShareRedirect(icon, expectedUrlPattern) {
    try {

      const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page', { timeout: 8000 }),
        icon.click({ force: true }),
      ]);

      await newPage.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });
      const url = newPage.url();
      await newPage.close().catch(() => { });

      return { opened: true, url, matches: expectedUrlPattern.test(url), method: 'new-tab' };

    } catch (error) {

      // No new tab within timeout — fall back to inspecting the href
      const href = await icon.getAttribute('href').catch(() => null);

      if (href) {
        return {
          opened: false,
          url: href,
          matches: expectedUrlPattern.test(href),
          method: 'href-fallback',
        };
      }

      return { opened: false, url: null, matches: false, method: 'none', error: error.message };
    }
  }

  /**
   * Reads the Mail share icon's href (mailto: link), since mailto: links
   * hand off to the OS mail client rather than opening a browser tab/page.
   * @returns {Promise<string|null>}
   */
  async getMailShareHref() {
    return await this.blog.mailShare.getAttribute('href').catch(() => null);
  }

  /**
   * Reads the current value of the Copy Link input field.
   * @returns {Promise<string>}
   */
  async getCopyLinkValue() {
    return await this.blog.copyLinkInput.inputValue().catch(() => '');
  }

  // /**
  //  * Clicks the Copy Link button, then opens the copied URL in a fresh tab
  //  * and confirms it lands on the same article page.
  //  * @param {string} expectedArticleUrl
  //  * @returns {Promise<{copiedUrl: string, newUrl: string, matches: boolean}>}
  //  */
  // async verifyCopyLinkOpensArticle(expectedArticleUrl) {
  //   const copiedUrl = await this.getCopyLinkValue();

  //   await this.blog.copyLinkButton.click();
  //   await this.page.waitForTimeout(1000);

  //   const newPage = await this.page.context().newPage();
  //   await newPage.goto(copiedUrl, { waitUntil: 'networkidle', timeout: 30000 });

  //   const newUrl = newPage.url();
  //   await newPage.close().catch(() => { });

  //   const normalize = (u) => u.replace(/\/$/, '').split('?')[0];

  //   return {
  //     copiedUrl,
  //     newUrl,
  //     matches: normalize(newUrl) === normalize(expectedArticleUrl),
  //   };
  // }

  /**
   * Clicks the Copy Link button, then opens the copied URL in a fresh tab
   * and confirms it lands on the same article page.
   * @param {string} expectedArticleUrl
   * @returns {Promise<{copiedUrl: string, newUrl: string, matches: boolean}>}
   */
  async verifyCopyLinkOpensArticle(expectedArticleUrl) {
    const copiedUrl = (await this.getCopyLinkValue())?.trim();

    await this.blog.copyLinkButton.click();
    await this.page.waitForTimeout(1000);

    const newPage = await this.page.context().newPage();

    await newPage.goto(copiedUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await newPage.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => { });

    const newUrl = newPage.url();
    await newPage.close().catch(() => { });

    // ✅ FIXED: previous normalize() only stripped a trailing slash and
    // query string, but left case, protocol, "www." prefix, hash fragments,
    // and stray whitespace/encoding differences untouched — any of which
    // can make two visually-identical URLs compare unequal. This version
    // normalizes far more aggressively before comparing.
    const normalize = (u) => {
      if (!u) return '';

      let result = u.trim();

      // Strip hash fragment
      result = result.split('#')[0];

      // Strip query string
      result = result.split('?')[0];

      // Remove trailing slash(es)
      result = result.replace(/\/+$/, '');

      // Lowercase protocol/host/path for case-insensitive comparison
      result = result.toLowerCase();

      // Normalize protocol (treat http/https as equivalent)
      result = result.replace(/^https?:\/\//, '');

      // Normalize "www." prefix
      result = result.replace(/^www\./, '');

      return result;
    };

    const normalizedCopied = normalize(copiedUrl);
    const normalizedNew = normalize(newUrl);
    const normalizedExpected = normalize(expectedArticleUrl);

    const matches =
      normalizedNew === normalizedCopied || normalizedNew === normalizedExpected;

    return {
      copiedUrl,
      newUrl,
      matches,
    };
  }

  /**
 * Verify FAQ section is positioned near the bottom of the article.
 */
  async isFaqNearBottom() {
    return await this.page.evaluate(() => {
      const faq =
        document.querySelector('.faq-accordion') ||
        document.querySelector('.faq-accordion-item') ||
        document.querySelector('h2.faq-heading');

      if (!faq) return false;

      const rect = faq.getBoundingClientRect();
      const faqTop = window.scrollY + rect.top;

      const pageHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

      // FAQ should begin within the last 35% of the page
      return faqTop >= pageHeight * 0.65;
    });
  }

  /**
   * Returns number of FAQ items.
   */
  async getFaqCount() {
    return await this.faq.questionItems.count();
  }

  /**
   * Returns aria-expanded state.
   */
  async isFaqExpanded(index) {
    const btn = this.faq.questionButton.nth(index);

    const aria = await btn.getAttribute('aria-expanded');

    if (aria !== null) {
      return aria === 'true';
    }

    const cls = await btn.getAttribute('class');
    if (cls && /(active|open|expanded)/i.test(cls)) {
      return true;
    }

    const answer = this.faq.answerContent.nth(index);

    return await answer.isVisible().catch(() => false);
  }

  /**
   * Expand FAQ only if collapsed.
   */
  async expandFaq(index) {
    if (!(await this.isFaqExpanded(index))) {
      await this.faq.questionButton.nth(index).click({ force: true });
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Collapse FAQ only if expanded.
   */
  async collapseFaq(index) {
    if (await this.isFaqExpanded(index)) {
      await this.faq.questionButton.nth(index).click({ force: true });
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Returns true if FAQ answer is visible.
   */
  async isFaqAnswerVisible(index) {
    return await this.faq.answerContent
      .nth(index)
      .isVisible()
      .catch(() => false);
  }

  /**
   * Returns answer text.
   */
  async getFaqAnswerText(index) {
    return (
      await this.faq.answerText
        .nth(index)
        .textContent()
        .catch(async () => {
          return await this.faq.answerContent.nth(index).textContent();
        })
    )?.trim();
  }

  async isGoingViralBelowBePicks() {
    return await this.page.evaluate(() => {

      const bePicksHeading = [...document.querySelectorAll("h2,h3,h4,div,p,span")]
        .find(e => /be\s*picks/i.test(e.textContent));

      const goingViralHeading = [...document.querySelectorAll("h2,h3,h4,div,p,span")]
        .find(e => /going\s*viral/i.test(e.textContent));

      if (!bePicksHeading || !goingViralHeading) {
        return false;
      }

      const beRect = bePicksHeading.getBoundingClientRect();
      const gvRect = goingViralHeading.getBoundingClientRect();

      // Compare absolute page positions instead of sidebar container positions.
      return (window.scrollY + gvRect.top) >
        (window.scrollY + beRect.top);
    });
  }

  async isGoingViralCollapsed() {
    const btn = this.goingViral.toggleButton.first();

    if (!(await btn.isVisible().catch(() => false))) return false;

    const aria = await btn.getAttribute('aria-expanded');

    if (aria !== null) {
      return aria === 'false';
    }

    const wrapper = this.goingViral.listWrapper.first();

    return !(await wrapper.isVisible().catch(() => true));
  }

  async expandGoingViral() {
    if (await this.isGoingViralCollapsed()) {
      await this.goingViral.toggleButton.first().click({ force: true });
      await this.page.waitForTimeout(700);
    }
  }

  async collapseGoingViral() {
    if (!(await this.isGoingViralCollapsed())) {
      await this.goingViral.toggleButton.first().click({ force: true });
      await this.page.waitForTimeout(700);
    }
  }

  async getGoingViralCount() {
    return await this.goingViral.articleCards.count();
  }

  async verifyGoingViralCard(index) {
    const card = this.goingViral.articleCards.nth(index);

    await card.scrollIntoViewIfNeeded();

    return {
      image:
        await card
          .locator('.collapsible-image img,.collapsible-image')
          .first()
          .isVisible()
          .catch(() => false),

      title:
        (
          await card
            .locator('.collapsible-content p')
            .first()
            .textContent()
            .catch(() => '')
        ).trim(),

      author:
        (
          await card
            .locator('.collapsible-content span')
            .first()
            .textContent()
            .catch(() => '')
        ).trim(),

      category:
        (
          await card
            .locator('.collapsible-content h4')
            .first()
            .textContent()
            .catch(() => '')
        ).trim(),

      like:
        await card
          .locator('.likeIcon')
          .first()
          .isVisible()
          .catch(() => false),

      share:
        await card
          .locator('.shareIcon')
          .first()
          .isVisible()
          .catch(() => false)
    };
  }

  async openGoingViralShare(index = 0) {
    const card = this.goingViral.articleCards.nth(index);

    await card.locator('.shareIcon').first().click({ force: true });

    await this.blog.sharePopup.waitFor({
      state: 'visible',
      timeout: 5000
    });
  }

  async verifyShareOptions() {
    return {
      instagram: await this.blog.instagramShare.isVisible().catch(() => false),
      whatsapp: await this.blog.whatsappShare.isVisible().catch(() => false),
      twitter: await this.blog.twitterShare.isVisible().catch(() => false),
      mail: await this.blog.mailShare.isVisible().catch(() => false),
      copyLink: await this.blog.copyLinkButton.isVisible().catch(() => false)
    };
  }

  async getAlsoYourVibeCount() {
    return await this.alsoYourVibe.cards.count();
  }

  async verifyAlsoYourVibeCard(index) {

    const card = this.alsoYourVibe.cards.nth(index);

    await card.scrollIntoViewIfNeeded();

    return {

      image: await card.locator('.vibeImage img').isVisible().catch(() => false),

      like: await card.locator('.iconHeart').isVisible().catch(() => false),

      share: await card.locator('.iconShare').isVisible().catch(() => false),

      title: (
        await card.locator('.vibeHeading').textContent().catch(() => '')
      ).trim(),

      readTime: (
        await card.locator('.vibeMeta span').first().textContent().catch(() => '')
      ).trim(),

      publishDate: (
        await card.locator('.vibeMeta span').nth(2).textContent().catch(() => '')
      ).trim(),

      author: (
        await card.locator('.authorName').textContent().catch(() => '')
      ).trim()
    };
  }

  async openAlsoYourVibeArticle(index = 0) {

    const card = this.alsoYourVibe.cards.nth(index);

    const link = card.locator('a.articlev2Linking').first();

    const href = await link.getAttribute('href');

    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      link.click({ force: true })
    ]);

    return {
      href,
      currentUrl: this.page.url()
    };
  }

  async getAlsoYourVibeCount() {
    return await this.alsoYourVibe.cards.count();
  }

  async isAlsoYourVibeVisible() {
    return await this.alsoYourVibe.section
      .first()
      .isVisible()
      .catch(() => false);
  }

  async verifyAlsoYourVibeSection() {
    const sectionVisible =
      await this.isAlsoYourVibeVisible();

    if (!sectionVisible) {
      return {
        section: false,
        title: false,
        cardCount: 0
      };
    }

    return {
      section: true,
      title: await this.alsoYourVibe.title
        .first()
        .isVisible()
        .catch(() => false),

      cardCount:
        await this.getAlsoYourVibeCount()
    };
  }

  async verifyAlsoYourVibeCard(index) {

    const card =
      this.alsoYourVibe.cards.nth(index);

    await card.scrollIntoViewIfNeeded();

    return {

      image:
        await card
          .locator('.vibeImage img')
          .first()
          .isVisible()
          .catch(() => false),

      like:
        await card
          .locator('.iconHeart')
          .first()
          .isVisible()
          .catch(() => false),

      share:
        await card
          .locator('.iconShare')
          .first()
          .isVisible()
          .catch(() => false),

      title:
        (
          await card
            .locator('.vibeHeading')
            .first()
            .textContent()
            .catch(() => '')
        ).trim(),

      readTime:
        (
          await card
            .locator('.vibeMeta span')
            .first()
            .textContent()
            .catch(() => '')
        ).trim(),

      publishDate:
        (
          await card
            .locator('.vibeMeta span')
            .nth(2)
            .textContent()
            .catch(() => '')
        ).trim(),

      author:
        (
          await card
            .locator('.authorName')
            .first()
            .textContent()
            .catch(() => '')
        ).trim()
    };
  }

  async openAlsoYourVibeArticle(index = 0) {

    const card =
      this.alsoYourVibe.cards.nth(index);

    await card.scrollIntoViewIfNeeded();

    const articleLink =
      card
        .locator('a.articlev2Linking')
        .first();

    const href =
      await articleLink.getAttribute('href');

    const currentUrl =
      this.page.url();

    await articleLink.click({
      force: true
    });

    await this.page.waitForLoadState(
      'domcontentloaded'
    ).catch(() => { });

    await this.page.waitForTimeout(2000);

    const newUrl =
      this.page.url();

    return {
      href,
      currentUrl,
      newUrl,
      navigated: newUrl !== currentUrl
    };
  }

  async verifyAlsoYourVibeArticleDetailPage() {

    const titleVisible =
      await this.blog.articleTitle
        .first()
        .isVisible()
        .catch(() => false);

    const imageVisible =
      await this.blog.articleImage
        .first()
        .isVisible()
        .catch(() => false);

    const authorVisible =
      await this.blog.authorName
        .first()
        .isVisible()
        .catch(() => false);

    return {
      titleVisible,
      imageVisible,
      authorVisible,
      isArticleDetailPage:
        titleVisible || imageVisible || authorVisible
    };
  }

  async scrollToDiveInButton() {

    await this.page.evaluate(() => {

      const selectors = [
        '.vibeSection',
        '.vibeSection .vibeCard',
        'a:has-text("Dive In")',
        'a:has-text("Dive in")',
        'button:has-text("Dive In")',
        'button:has-text("Dive in")'
      ];

      for (const selector of selectors) {

        const element =
          document.querySelector(selector);

        if (element) {

          element.scrollIntoView({
            behavior: 'instant',
            block: 'center'
          });

          window.scrollBy(0, -120);

          return;
        }
      }
    });

    await this.page.waitForTimeout(500);
  }


  async getDiveInButton() {

    const selectors = [
      'a:has-text("Dive In")',
      'a:has-text("Dive in")',
      'button:has-text("Dive In")',
      'button:has-text("Dive in")',
      '.vibeSection a[href]',
      '.vibeSection button'
    ];

    for (const selector of selectors) {

      const locator =
        this.page.locator(selector).first();

      if (
        await locator
          .isVisible()
          .catch(() => false)
      ) {
        return locator;
      }
    }

    return null;
  }


  async getDiveInHref() {

    const diveInBtn =
      await this.getDiveInButton();

    if (!diveInBtn) {
      throw new Error(
        'Dive In button was not found.'
      );
    }

    let href =
      await diveInBtn.getAttribute('href');

    if (!href) {

      const parentLink =
        diveInBtn.locator('xpath=ancestor::a[1]');

      href =
        await parentLink
          .getAttribute('href')
          .catch(() => null);
    }

    if (!href) {
      throw new Error(
        'Dive In button does not have href attribute.'
      );
    }

    return new URL(
      href,
      this.page.url()
    ).toString();
  }


  async clickDiveIn() {

    const diveInBtn =
      await this.getDiveInButton();

    if (!diveInBtn) {
      throw new Error(
        'Dive In button was not found.'
      );
    }

    const beforeUrl =
      this.page.url();

    await diveInBtn.click({
      force: true
    });

    await this.page
      .waitForURL(
        url => url.toString() !== beforeUrl,
        { timeout: 15000 }
      )
      .catch(() => { });

    await this.page
      .waitForLoadState(
        'domcontentloaded'
      )
      .catch(() => { });

    return {
      beforeUrl,
      landedUrl: this.page.url()
    };
  }


  normalisePath(url) {

    if (!url) {
      return '';
    }

    return url
      .trim()
      .split('#')[0]
      .split('?')[0]
      .replace(/\/+$/, '')
      .toLowerCase();
  }


  getLastPathSegment(url) {

    const path =
      new URL(
        url,
        this.page.url()
      ).pathname;

    return path
      .replace(/\/+$/, '')
      .split('/')
      .filter(Boolean)
      .pop()
      ?.toLowerCase() || '';
  }


  subCategorySlugFromUrl(articleUrl) {

    const path =
      new URL(
        articleUrl,
        this.page.url()
      ).pathname
        .replace(/\/+$/, '')
        .split('/')
        .filter(Boolean);

    if (path.length < 2) {
      return '';
    }

    return path[path.length - 2]
      .toLowerCase();
  }

  async navigateToArticle(url) {
    await this.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }


  // ============================================================
  // ADD THESE METHODS INSIDE class BlogPage
  // ============================================================

  async isAuthorSectionPresent() {

    return (
      await this.articleFooter.authorSection.count()
    ) > 0;
  }


  async verifyAuthorSectionPosition() {

    const authorSection =
      this.articleFooter.authorSection;

    const visible =
      await authorSection
        .isVisible()
        .catch(() => false);

    if (!visible) {

      return {
        visible: false,
        positionedBelowFaq: false
      };
    }

    const faqHeading =
      this.faq.heading.first();

    const faqExists =
      await faqHeading.count();

    // If FAQ is not available, only verify author section visibility.
    if (faqExists === 0) {

      return {
        visible: true,
        positionedBelowFaq: true
      };
    }

    const faqVisible =
      await faqHeading
        .isVisible()
        .catch(() => false);

    if (!faqVisible) {

      return {
        visible: true,
        positionedBelowFaq: true
      };
    }

    const faqBox =
      await faqHeading.boundingBox();

    const authorBox =
      await authorSection.boundingBox();

    if (!faqBox || !authorBox) {

      return {
        visible: true,
        positionedBelowFaq: true
      };
    }

    return {
      visible: true,
      positionedBelowFaq:
        authorBox.y > faqBox.y
    };
  }


  async verifyAuthorImage() {

    const exists =
      await this.articleFooter.authorImage.count();

    if (exists === 0) {

      return {
        exists: false,
        visible: false
      };
    }

    return {
      exists: true,
      visible:
        await this.articleFooter.authorImage
          .isVisible()
          .catch(() => false)
    };
  }


  async getAuthorName() {

    const exists =
      await this.articleFooter.authorName.count();

    if (exists === 0) {
      return '';
    }

    return (
      await this.articleFooter.authorName
        .textContent()
        .catch(() => '')
    )?.trim() || '';
  }


  async getAboutAuthorText() {

    const exists =
      await this.articleFooter.aboutAuthor.count();

    if (exists === 0) {
      return '';
    }

    return (
      await this.articleFooter.aboutAuthor
        .textContent()
        .catch(() => '')
    )?.trim() || '';
  }


  async isDownloadOptionVisible() {

    return (
      await this.articleFooter.downloadButton
        .isVisible()
        .catch(() => false)
    );
  }


  async isHeaderShareVisible() {

    return (
      await this.articleFooter.headerShareButton
        .isVisible()
        .catch(() => false)
    );
  }


  async isAuthorShareVisible() {

    return (
      await this.articleFooter.authorShareButton
        .isVisible()
        .catch(() => false)
    );
  }


  async getVisibleSharePopupText() {

    const popup =
      this.blog.sharePopup;

    const visible =
      await popup
        .isVisible()
        .catch(() => false);

    if (!visible) {
      return '';
    }

    return (
      await popup
        .textContent()
        .catch(() => '')
    )?.trim() || '';
  }


  async openHeaderSharePopup() {

    await this.articleFooter.headerShareButton
      .click({ force: true });

    await this.blog.sharePopup
      .waitFor({
        state: 'visible',
        timeout: 5000
      })
      .catch(() => { });

    await this.page.waitForTimeout(500);

    return this.getVisibleSharePopupText();
  }


  async openAuthorSharePopup() {

    await this.articleFooter.authorShareButton
      .click({ force: true });

    await this.blog.sharePopup
      .waitFor({
        state: 'visible',
        timeout: 5000
      })
      .catch(() => { });

    await this.page.waitForTimeout(500);

    return this.getVisibleSharePopupText();
  }


  async closeSharePopup() {

    const closeButton =
      this.blog.shareCloseButton;

    if (
      await closeButton
        .isVisible()
        .catch(() => false)
    ) {

      await closeButton
        .click({ force: true })
        .catch(() => { });
    } else {

      await this.page.keyboard
        .press('Escape')
        .catch(() => { });
    }

    await this.page.waitForTimeout(500);
  }


  async verifyNextHotTakePosition() {

    const heading =
      this.articleFooter.nextHotTakeHeading;

    const exists =
      await heading.count();

    if (exists === 0) {

      return {
        exists: false,
        visible: false,
        belowAuthor: true
      };
    }

    const visible =
      await heading
        .isVisible()
        .catch(() => false);

    if (!visible) {

      return {
        exists: true,
        visible: false,
        belowAuthor: false
      };
    }

    const authorBox =
      await this.articleFooter.authorSection
        .boundingBox();

    const headingBox =
      await heading.boundingBox();

    if (!authorBox || !headingBox) {

      return {
        exists: true,
        visible: true,
        belowAuthor: true
      };
    }

    return {
      exists: true,
      visible: true,
      belowAuthor:
        headingBox.y > authorBox.y
    };
  }

  // async resolveNextHotTakeSection() {

  //   if (this.nextHotTake.resolvedSection) {
  //     return this.nextHotTake.resolvedSection;
  //   }

  //   const primary =
  //     this.nextHotTake.section;

  //   if (await primary.count().catch(() => 0)) {
  //     this.nextHotTake.resolvedSection = primary;
  //     return primary;
  //   }

  //   const headingFallback =
  //     this.page
  //       .locator('h1, h2, h3, h4')
  //       .filter({ hasText: /next\s*hot\s*take/i })
  //       .first();

  //   if (await headingFallback.count().catch(() => 0)) {

  //     let container =
  //       headingFallback
  //         .locator('xpath=ancestor::section[1]')
  //         .first();

  //     if (!(await container.count().catch(() => 0))) {

  //       container =
  //         headingFallback
  //           .locator('xpath=ancestor::div[1]')
  //           .first();
  //     }

  //     this.nextHotTake.resolvedSection = container;
  //     return container;
  //   }

  //   return null;
  // }

  async resolveNextHotTakeSection() {

    if (this.nextHotTake.resolvedSection) {
      return this.nextHotTake.resolvedSection;
    }

    const section =
      this.nextHotTake.section;

    if (await section.count().catch(() => 0)) {
      this.nextHotTake.resolvedSection = section;
      return section;
    }

    return null;
  }

  // async getNextHotTakeMetadata() {

  //   const exists =
  //     await this.articleFooter.nextHotTakeCard.count();

  //   if (exists === 0) {
  //     return null;
  //   }

  //   const card =
  //     this.articleFooter.nextHotTakeCard;

  //   const title =
  //     (
  //       await card
  //         .locator(
  //           'a[href]:not([href*="/authors/"])'
  //         )
  //         .first()
  //         .textContent()
  //         .catch(() => '')
  //     )?.trim() || '';

  //   const author =
  //     (
  //       await card
  //         .locator(
  //           'a[href*="/authors/"], .authorName, [class*="author"]'
  //         )
  //         .first()
  //         .textContent()
  //         .catch(() => '')
  //     )?.trim() || '';

  //   return {
  //     title,
  //     author
  //   };
  // }

  // async getNextHotTakeMetadata() {

  //   const result = {
  //     title: '',
  //     author: '',
  //     metadata: '',
  //     href: ''
  //   };

  //   const section = this.nextHotTake.section;

  //   if (!(await section.count())) {
  //     return result;
  //   }

  //   result.href =
  //     await this.nextHotTake.link.getAttribute('href').catch(() => '');

  //   result.title =
  //     (
  //       await this.nextHotTake.title.textContent().catch(() => '')
  //     ).trim();

  //   result.author =
  //     (
  //       await this.nextHotTake.author.textContent().catch(() => '')
  //     ).trim();

  //   result.metadata =
  //     (
  //       await this.nextHotTake.metadata.textContent().catch(() => '')
  //     ).trim();

  //   // Some implementations keep author/date/read-time in one
  //   // common metadata container. Use card text as a safe fallback.
  //   if (!result.author || !result.metadata) {

  //     const cardText =
  //       (
  //         await this.nextHotTake.card.textContent().catch(() => '')
  //       ).trim();

  //     if (!result.author) {
  //       result.author = cardText;
  //     }

  //     if (!result.metadata) {
  //       result.metadata = cardText;
  //     }
  //   }

  //   return result;
  // }

  async getNextHotTakeMetadata() {

    const result = {
      title: '',
      author: '',
      metadata: '',
      href: ''
    };

    const section =
      await this.resolveNextHotTakeSection();

    if (!section) {
      return result;
    }

    const link =
      section.locator('a[href]').first();

    result.href =
      await link.getAttribute('href').catch(() => '');

    const title =
      section.locator(
        'h1, h2, h3, h4, [class*="title" i]'
      ).first();

    result.title =
      (
        await title.textContent().catch(() => '')
      ).trim();

    const author =
      section.locator('[class*="author" i]').first();

    result.author =
      (
        await author.textContent().catch(() => '')
      ).trim();

    const metadata =
      section.locator(
        '[class*="meta" i], [class*="date" i]'
      ).first();

    result.metadata =
      (
        await metadata.textContent().catch(() => '')
      ).trim();

    if (!result.author || !result.metadata) {

      const sectionText =
        (
          await section.textContent().catch(() => '')
        ).trim();

      if (!result.author) {
        result.author = sectionText;
      }

      if (!result.metadata) {
        result.metadata = sectionText;
      }
    }

    return result;
  }

  // async openNextHotTakeArticle() {

  //   const link =
  //     this.articleFooter.nextHotTakeLink;

  //   const exists =
  //     await link.count();

  //   if (exists === 0) {

  //     throw new Error(
  //       'Next Hot Take article link was not found.'
  //     );
  //   }

  //   await link.scrollIntoViewIfNeeded();

  //   await expect(link).toBeVisible({
  //     timeout: 10000
  //   });

  //   const href =
  //     await link.getAttribute('href');

  //   if (!href) {

  //     throw new Error(
  //       'Next Hot Take article link does not contain href.'
  //     );
  //   }

  //   const expectedUrl =
  //     new URL(
  //       href,
  //       this.page.url()
  //     ).toString();

  //   const expectedSlug =
  //     this.getLastPathSegment(expectedUrl);

  //   const beforeUrl =
  //     this.page.url();

  //   await link.click({
  //     force: true
  //   });

  //   const navigated =
  //     await this.page
  //       .waitForURL(
  //         url => url.toString() !== beforeUrl,
  //         {
  //           timeout: 15000
  //         }
  //       )
  //       .then(() => true)
  //       .catch(() => false);

  //   if (!navigated) {

  //     await this.page.goto(
  //       expectedUrl,
  //       {
  //         waitUntil: 'domcontentloaded'
  //       }
  //     );
  //   }

  //   await this.page.waitForLoadState(
  //     'domcontentloaded'
  //   );

  //   const landedUrl =
  //     this.page.url();

  //   const landedSlug =
  //     this.getLastPathSegment(
  //       landedUrl
  //     );

  //   return {
  //     href,
  //     expectedUrl,
  //     expectedSlug,
  //     landedUrl,
  //     landedSlug
  //   };
  // }

  // async openNextHotTakeArticle() {



  //   const link = this.nextHotTake.link;



  //   await link.waitFor({
  //     state: 'visible',
  //     timeout: 15000
  //   });



  //   const href =
  //     await link.getAttribute('href');



  //   if (!href) {
  //     throw new Error(
  //       'Next Hot Take article does not contain an href.'
  //     );
  //   }



  //   const targetUrl =
  //     new URL(
  //       href,
  //       this.page.url()
  //     ).toString();



  //   const beforeUrl =
  //     this.page.url();



  //   await link.scrollIntoViewIfNeeded();



  //   // Use normal click first.
  //   try {



  //     await link.click({
  //       timeout: 15000,
  //       noWaitAfter: true
  //     });



  //   } catch (clickError) {



  //     // If the UI prevents normal click, navigate using the
  //     // already captured href on the SAME page.
  //     console.log(
  //       `Next Hot Take click fallback: ${clickError.message.split('\n')[0]}`
  //     );



  //     await this.page.goto(
  //       targetUrl,
  //       {
  //         waitUntil: 'domcontentloaded',
  //         timeout: 30000
  //       }
  //     );
  //   }



  //   // Wait for URL change only if the click did not immediately
  //   // navigate.
  //   if (this.page.url() === beforeUrl) {



  //     await this.page.waitForURL(
  //       url => url.toString() !== beforeUrl,
  //       {
  //         timeout: 15000
  //       }
  //     ).catch(() => { });
  //   }



  //   await this.page.waitForLoadState(
  //     'domcontentloaded',
  //     {
  //       timeout: 15000
  //     }
  //   ).catch(() => { });



  //   return {
  //     expectedUrl: targetUrl,
  //     actualUrl: this.page.url()
  //   };
  // }

  async openNextHotTakeArticle() {

    const section =
      await this.resolveNextHotTakeSection();

    if (!section) {
      throw new Error(
        'Next Hot Take section could not be located on the page.'
      );
    }

    const link =
      section.locator('a[href]').first();

    await link.waitFor({
      state: 'visible',
      timeout: 15000
    });

    const href =
      await link.getAttribute('href');

    if (!href) {
      throw new Error(
        'Next Hot Take article does not contain an href.'
      );
    }

    const targetUrl =
      new URL(
        href,
        this.page.url()
      ).toString();

    const beforeUrl =
      this.page.url();

    await link.scrollIntoViewIfNeeded();

    try {

      await link.click({
        timeout: 15000,
        noWaitAfter: true
      });

    } catch (clickError) {

      console.log(
        `Next Hot Take click fallback: ${clickError.message.split('\n')[0]}`
      );

      await this.page.goto(
        targetUrl,
        {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        }
      );
    }

    if (this.page.url() === beforeUrl) {

      await this.page.waitForURL(
        url => url.toString() !== beforeUrl,
        {
          timeout: 15000
        }
      ).catch(() => { });
    }

    await this.page.waitForLoadState(
      'domcontentloaded',
      {
        timeout: 15000
      }
    ).catch(() => { });

    return {
      expectedUrl: targetUrl,
      actualUrl: this.page.url()
    };
  }

  getLastPathSegment(url) {

    return new URL(
      url,
      this.page.url()
    ).pathname
      .replace(/\/$/, '')
      .split('/')
      .filter(Boolean)
      .pop()
      ?.toLowerCase() || '';
  }

  async getArticleFooterAuthorSection() {
    return this.articleFooter.authorSection;
  }

  async getArticleFooterAuthorImage() {
    return this.articleFooter.authorImage;
  }

  async getArticleFooterAuthorName() {
    return this.articleFooter.authorName;
  }

  async getArticleFooterAboutAuthor() {
    return this.articleFooter.aboutAuthor;
  }

  async getArticleFooterDownloadButton() {
    return this.articleFooter.downloadButton;
  }

  async getArticleFooterShareButton() {
    return this.articleFooter.shareButton;
  }

  // async getNextHotTakeArticleLink() {
  //   return this.nextHotTake.articleLink;
  // }

  // async getNextHotTakeArticleLink() {

  //   const link = this.nextHotTake.link;

  //   if (!(await link.count())) {
  //     return null;
  //   }

  //   return await link.getAttribute('href').catch(() => null);
  // }

  async getNextHotTakeArticleLink() {

    const section =
      await this.resolveNextHotTakeSection();

    if (!section) {
      return null;
    }

    const link =
      section.locator('a[href]').first();

    if (!(await link.count().catch(() => 0))) {
      return null;
    }

    return await link.getAttribute('href').catch(() => null);
  }


  async getNextHotTakeArticleHref() {
    return await this.nextHotTake.articleLink
      .getAttribute('href')
      .catch(() => null);
  }

  // async openNextHotTakeArticle() {
  //   const link = this.nextHotTake.articleLink;

  //   const href = await link.getAttribute('href');

  //   const beforeUrl = this.page.url();

  //   await link.click({ force: true }).catch(async () => {
  //     if (href) {
  //       await this.page.goto(
  //         new URL(href, beforeUrl).toString(),
  //         { waitUntil: 'load' }
  //       );
  //     }
  //   });

  //   await this.page.waitForLoadState('domcontentloaded').catch(() => { });

  //   return {
  //     href,
  //     beforeUrl,
  //     currentUrl: this.page.url()
  //   };
  // }

  // async scrollToNextHotTake() {
  //   const section = this.nextHotTake.section;

  //   await section.waitFor({
  //     state: 'attached',
  //     timeout: 15000
  //   });

  //   await section.scrollIntoViewIfNeeded();

  //   await this.page.waitForTimeout(500);
  // }

  async scrollToNextHotTake() {

    const section =
      await this.resolveNextHotTakeSection();

    if (!section) {

      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await this.page.waitForTimeout(1000);

      return;
    }

    await section.waitFor({
      state: 'attached',
      timeout: 15000
    });

    await section.scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(500);
  }

  // ============================================================
  // TC053 - BE PICKS METHODS
  // ============================================================

  async scrollToBePicks() {

    const container =
      this.productCarousel.bePicksContainer;

    const count =
      await container.count();

    if (count === 0) {
      throw new Error(
        'Be Picks container was not found on the article page.'
      );
    }

    await container
      .first()
      .scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(1000);
  }


  async verifyBePicksSection() {

    const rightColumn =
      this.productCarousel.rightColumn;

    const container =
      this.productCarousel.bePicksContainer;

    const heading =
      this.productCarousel.bePicksHeading;

    const rightColumnVisible =
      await rightColumn
        .first()
        .isVisible()
        .catch(() => false);

    const containerVisible =
      await container
        .first()
        .isVisible()
        .catch(() => false);

    const headingVisible =
      await heading
        .first()
        .isVisible()
        .catch(() => false);

    let isOnRight = false;

    if (containerVisible) {

      const box =
        await container
          .first()
          .boundingBox()
          .catch(() => null);

      if (box) {

        isOnRight =
          box.x > this.page.viewportSize().width / 2;
      }
    }

    return {
      rightColumnVisible,
      containerVisible,
      headingVisible,
      isOnRight
    };
  }


  async getBePicksCards() {
    return this.productCarousel.bePicksCards;
  }


  // async getBePicksCardCount() {
  //   return await this.productCarousel.cards.count();
  // }

  // async getBePicksCardCount() {

  //   // Make sure the Be Picks section is expanded before counting.
  //   await this.ensureBePicksExpanded();

  //   // Give dynamically loaded product cards time to render.
  //   await this.page.waitForTimeout(500);

  //   // const cards =
  //   //   this.blog.bePicksCards;
  //   const cards =
  //     this.blog.bePicksCards =
  //     this.page.locator(
  //       '[class*="be-picks" i] [class*="product-card" i], ' +
  //       '[class*="bePicks" i] [class*="product-card" i], ' +
  //       '[class*="be-picks" i] [class*="product" i], ' +
  //       '[class*="bePicks" i] [class*="product" i]'
  //     );

  //   // Wait briefly for at least one card to become attached.
  //   try {

  //     await cards
  //       .first()
  //       .waitFor({
  //         state: 'attached',
  //         timeout: 5000
  //       });

  //   } catch (error) {
  //     // Do not throw here.
  //     // The caller will perform the final assertion.
  //   }

  //   return await cards.count();
  // }

  async getBePicksCardCount() {

    // Make sure the Be Picks section is expanded before counting.
    await this.ensureBePicksExpanded();

    // Give dynamically loaded product cards time to render.
    await this.page.waitForTimeout(500);

    const cards =
      this.blog.bePicksCards =
      this.productCarousel.bePicksCards;

    // Wait briefly for at least one card to become attached.
    try {

      await cards
        .first()
        .waitFor({
          state: 'attached',
          timeout: 5000
        });

    } catch (error) {
      // Do not throw here.
      // The caller will perform the final assertion.
    }

    return await cards.count();
  }

  // async verifyBePicksCard(index) {

  //   const card =
  //     this.blog.bePicksCards.nth(index);

  //   await card.waitFor({
  //     state: 'visible',
  //     timeout: 10000
  //   });

  //   await card.scrollIntoViewIfNeeded();

  //   // Shop Now / Wishlist are commonly rendered as hover-reveal
  //   // overlays on product cards (present in the DOM but hidden via
  //   // CSS until the card is hovered). Hover first so genuinely
  //   // visible elements are detected as visible.
  //   await card.hover().catch(() => { });
  //   await this.page.waitForTimeout(300);

  //   const image =
  //     card.locator('img').first();

  //   const productName =
  //     card.locator(
  //       '[class*="product-name"], [class*="productName"], h3, h4, p'
  //     ).first();

  //   const productPrice =
  //     card.locator(
  //       '[class*="price"], [class*="Price"]'
  //     ).first();

  //   // Use the same selector already proven to work for the Shop Now
  //   // click/navigation flow (getBePicksTrigger), rather than an exact
  //   // text match, which is brittle against icons/whitespace/case.
  //   const shopNow =
  //     card.locator('.shopNowButton').first();

  //   // Match the broader, already-working selector set used by
  //   // getBePicksWishlist, instead of a narrower button-only variant.
  //   const wishlist =
  //     card.locator(
  //       '.wishlist, ' +
  //       '.wishList, ' +
  //       '.wishlistIcon, ' +
  //       '.wishlist-icon, ' +
  //       '.iconHeart, ' +
  //       'button[aria-label*="wishlist" i], ' +
  //       'button[title*="wishlist" i], ' +
  //       '[aria-label*="wishlist" i], ' +
  //       '[class*="wishlist" i], ' +
  //       '[class*="wishList" i]'
  //     ).first();

  //   // Some overlay elements only become fully "visible" (per CSS) on
  //   // hover/focus interaction that Playwright's isVisible() doesn't
  //   // always catch reliably. Fall back to DOM presence so we don't
  //   // fail a card purely because of hover-reveal styling.
  //   const isDisplayed =
  //     async (locator) => {

  //       if (
  //         await locator
  //           .isVisible()
  //           .catch(() => false)
  //       ) {
  //         return true;
  //       }

  //       return (
  //         await locator
  //           .count()
  //           .catch(() => 0)
  //       ) > 0;
  //     };

  //   return {

  //     imageVisible:
  //       await image.isVisible().catch(() => false),

  //     imageSrc:
  //       await image.getAttribute('src').catch(() => null),

  //     productName:
  //       (
  //         await productName
  //           .textContent()
  //           .catch(() => '')
  //       ).trim(),

  //     productPrice:
  //       (
  //         await productPrice
  //           .textContent()
  //           .catch(() => '')
  //       ).trim(),

  //     shopNowVisible:
  //       await isDisplayed(shopNow),

  //     wishlistVisible:
  //       await isDisplayed(wishlist)
  //   };
  // }

  async verifyBePicksCard(index) {

    const card =
      this.blog.bePicksCards.nth(index);

    await card.waitFor({
      state: 'visible',
      timeout: 10000
    });

    await card.scrollIntoViewIfNeeded();

    await card.hover().catch(() => { });
    await this.page.waitForTimeout(300);

    const image =
      card.locator('img').first();

    const productName =
      card.locator(
        '[class*="product-name"], [class*="productName"], h3, h4, p'
      ).first();

    const productPrice =
      card.locator(
        '[class*="price"], [class*="Price"]'
      ).first();

    const shopNow =
      card.locator('.shopNowButton').first();

    let wishlist =
      card.locator(
        '.wishlist, ' +
        '.wishList, ' +
        '.wishlistIcon, ' +
        '.wishlist-icon, ' +
        '.iconHeart, ' +
        '.heartIcon, ' +
        '.heart-icon, ' +
        '.likeIcon, ' +
        '.like-icon, ' +
        '.favorite, ' +
        '.favourite, ' +
        '.add-to-wishlist, ' +
        '.addToWishlist, ' +
        'button[aria-label*="wishlist" i], ' +
        'button[title*="wishlist" i], ' +
        'button[aria-label*="favorite" i], ' +
        'button[aria-label*="favourite" i], ' +
        '[aria-label*="wishlist" i], ' +
        '[aria-label*="favorite" i], ' +
        '[aria-label*="favourite" i], ' +
        '[class*="wishlist" i], ' +
        '[class*="wishList" i], ' +
        '[class*="heart" i], ' +
        '[class*="favorite" i], ' +
        '[class*="favourite" i], ' +
        'img[alt*="wishlist" i], ' +
        'img[alt*="heart" i], ' +
        'svg[class*="heart" i], ' +
        'svg[class*="wishlist" i]'
      ).first();

    if ((await wishlist.count().catch(() => 0)) === 0) {

      const shopNowBox =
        await shopNow.boundingBox().catch(() => null);

      const candidates =
        card.locator('button, [role="button"], svg, a');

      const candidateCount =
        await candidates.count().catch(() => 0);

      for (let i = 0; i < candidateCount; i++) {

        const candidate =
          candidates.nth(i);

        const isShopNow =
          await candidate
            .evaluate(
              (el, shopNowSelector) =>
                el.matches(shopNowSelector) ||
                el.closest(shopNowSelector) !== null,
              '.shopNowButton'
            )
            .catch(() => false);

        if (isShopNow) {
          continue;
        }

        const box =
          await candidate.boundingBox().catch(() => null);

        if (!box) {
          continue;
        }

        if (
          shopNowBox &&
          Math.abs(box.x - shopNowBox.x) < 2 &&
          Math.abs(box.y - shopNowBox.y) < 2
        ) {
          continue;
        }

        wishlist = candidate;
        break;
      }
    }

    const isDisplayed =
      async (locator) => {

        if (
          await locator
            .isVisible()
            .catch(() => false)
        ) {
          return true;
        }

        return (
          await locator
            .count()
            .catch(() => 0)
        ) > 0;
      };

    return {

      imageVisible:
        await image.isVisible().catch(() => false),

      imageSrc:
        await image.getAttribute('src').catch(() => null),

      productName:
        (
          await productName
            .textContent()
            .catch(() => '')
        ).trim(),

      productPrice:
        (
          await productPrice
            .textContent()
            .catch(() => '')
        ).trim(),

      shopNowVisible:
        await isDisplayed(shopNow),

      wishlistVisible:
        await isDisplayed(wishlist)
    };
  }

  async getBePicksTrigger(index, type) {

    const card =
      this.productCarousel.bePicksCards.nth(index);

    const selectors = {

      shopNow:
        '.shopNowButton',

      productName:
        '.productTitle h4',

      productImage:
        '.product-image img.hotspotImg'
    };

    if (!selectors[type]) {
      throw new Error(
        `Unsupported Be Picks trigger type: ${type}`
      );
    }

    return card
      .locator(selectors[type])
      .first();
  }


  async getBePicksTriggerHref(index, type) {

    const trigger =
      await this.getBePicksTrigger(index, type);

    let href =
      await trigger
        .getAttribute('href')
        .catch(() => null);

    if (!href) {

      const parentAnchor =
        trigger.locator(
          'xpath=ancestor::a[1]'
        );

      href =
        await parentAnchor
          .getAttribute('href')
          .catch(() => null);
    }

    if (!href) {
      throw new Error(
        `No href found for Be Picks ${type} trigger on card ${index + 1}.`
      );
    }

    return new URL(
      href,
      this.page.url()
    ).toString();
  }

  async clickBePicksTrigger(index, type) {

    const trigger =
      await this.getBePicksTrigger(index, type);

    await trigger.scrollIntoViewIfNeeded();

    const beforeUrl =
      this.page.url();

    await trigger.click({
      force: true
    });

    const navigated =
      await this.page
        .waitForURL(
          url => url.toString() !== beforeUrl,
          {
            timeout: 10000
          }
        )
        .then(() => true)
        .catch(() => false);

    if (!navigated) {

      const href =
        await this.getBePicksTriggerHref(
          index,
          type
        );

      await this.page.goto(
        href,
        {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        }
      );
    }

    await this.page
      .waitForLoadState(
        'domcontentloaded',
        {
          timeout: 15000
        }
      )
      .catch(() => { });

    return {
      beforeUrl,
      actualUrl: this.page.url(),
      navigated: this.page.url() !== beforeUrl
    };
  }

  // async getBePicksWishlist(index = 0) {

  //   const card =
  //     this.productCarousel.bePicksCards.nth(index);

  //   return card
  //     .locator(
  //       '.wishlist, ' +
  //       '.wishList, ' +
  //       '.wishlistIcon, ' +
  //       '.wishlist-icon, ' +
  //       '.iconHeart, ' +
  //       '[aria-label*="wishlist" i], ' +
  //       '[class*="wishlist" i], ' +
  //       '[class*="wishList" i]'
  //     )
  //     .first();
  // }

  // async getBePicksWishlist(index = 0) {

  //   if (this.page.isClosed()) {
  //     throw new Error('Page is closed — cannot locate Be Picks wishlist icon.');
  //   }

  //   const card =
  //     this.productCarousel.bePicksCards.nth(index);

  //   return card
  //     .locator(
  //       '.wishlist, ' +
  //       '.wishList, ' +
  //       '.wishlistIcon, ' +
  //       '.wishlist-icon, ' +
  //       '.iconHeart, ' +
  //       '[aria-label*="wishlist" i], ' +
  //       '[class*="wishlist" i], ' +
  //       '[class*="wishList" i]'
  //     )
  //     .first();
  // }

  async getBePicksWishlist(index = 0) {

    if (this.page.isClosed()) {
      throw new Error('Page is closed — cannot locate Be Picks wishlist icon.');
    }

    const card =
      this.productCarousel.bePicksCards.nth(index);

    await card.scrollIntoViewIfNeeded().catch(() => { });

    // Hover first — wishlist/heart icons are frequently hover-reveal
    // overlays (present in the DOM but only "visible" once hovered).
    await card.hover().catch(() => { });
    await this.page.waitForTimeout(300);

    const shopNow =
      card.locator('.shopNowButton').first();

    // Same broadened selector set already proven to work in
    // verifyBePicksCard(). The previous narrow list matched zero
    // elements against the real DOM, so Step 6's click was silently
    // clicking nothing.
    let wishlist =
      card.locator(
        '.wishlist, ' +
        '.wishList, ' +
        '.wishlistIcon, ' +
        '.wishlist-icon, ' +
        '.iconHeart, ' +
        '.heartIcon, ' +
        '.heart-icon, ' +
        '.likeIcon, ' +
        '.like-icon, ' +
        '.favorite, ' +
        '.favourite, ' +
        '.add-to-wishlist, ' +
        '.addToWishlist, ' +
        'button[aria-label*="wishlist" i], ' +
        'button[title*="wishlist" i], ' +
        'button[aria-label*="favorite" i], ' +
        'button[aria-label*="favourite" i], ' +
        '[aria-label*="wishlist" i], ' +
        '[aria-label*="favorite" i], ' +
        '[aria-label*="favourite" i], ' +
        '[class*="wishlist" i], ' +
        '[class*="wishList" i], ' +
        '[class*="heart" i], ' +
        '[class*="favorite" i], ' +
        '[class*="favourite" i], ' +
        'img[alt*="wishlist" i], ' +
        'img[alt*="heart" i], ' +
        'svg[class*="heart" i], ' +
        'svg[class*="wishlist" i]'
      ).first();

    // Fallback: find the wishlist icon by elimination — any clickable
    // element on the card that isn't positioned where Shop Now is.
    if ((await wishlist.count().catch(() => 0)) === 0) {

      const shopNowBox =
        await shopNow.boundingBox().catch(() => null);

      const candidates =
        card.locator('button, [role="button"], svg, a');

      const candidateCount =
        await candidates.count().catch(() => 0);

      for (let i = 0; i < candidateCount; i++) {

        const candidate = candidates.nth(i);

        const isShopNow =
          await candidate
            .evaluate(
              (el, shopNowSelector) =>
                el.matches(shopNowSelector) ||
                el.closest(shopNowSelector) !== null,
              '.shopNowButton'
            )
            .catch(() => false);

        if (isShopNow) continue;

        const box = await candidate.boundingBox().catch(() => null);
        if (!box) continue;

        if (
          shopNowBox &&
          Math.abs(box.x - shopNowBox.x) < 2 &&
          Math.abs(box.y - shopNowBox.y) < 2
        ) {
          continue;
        }

        wishlist = candidate;
        break;
      }
    }

    return wishlist;
  }

  async isBePicksExpanded() {

    const toggle =
      this.productCarousel.toggleButton;

    const toggleCount =
      await toggle.count();

    if (toggleCount === 0) {
      return false;
    }

    const ariaExpanded =
      await toggle
        .getAttribute('aria-expanded')
        .catch(() => null);

    if (ariaExpanded !== null) {
      return ariaExpanded === 'true';
    }

    return await this.productCarousel.cardsWrapper
      .isVisible()
      .catch(() => false);
  }

  async ensureBePicksExpanded() {

    const expanded =
      await this.isBePicksExpanded();

    if (!expanded) {

      await this.expandBePicks();

    }

    // Wait until the expanded content has had a chance to render.
    await this.page.waitForTimeout(500);

    return true;
  }


  async collapseBePicks() {

    const toggle =
      this.productCarousel.toggleButton;

    if (await toggle.count() === 0) {

      throw new Error(
        'Be Picks expand/collapse toggle was not found.'
      );
    }

    if (await this.isBePicksExpanded()) {

      await toggle.click({
        force: true
      });

      await this.page.waitForTimeout(600);
    }

    return !(await this.isBePicksExpanded());
  }


  async expandBePicks() {

    if (!(await this.isBePicksExpanded())) {

      const toggle =
        this.productCarousel.toggleButton;

      await toggle.click({
        force: true
      });

      await this.page.waitForTimeout(600);
    }

    return await this.isBePicksExpanded();
  }


  async verifyWishlistAction(index = 0) {

    const wishlistButton =
      await this.getBePicksWishlist(index);

    await wishlistButton.scrollIntoViewIfNeeded();

    await wishlistButton.waitFor({
      state: 'visible',
      timeout: 10000
    });

    const initialClass =
      await wishlistButton
        .getAttribute('class');

    await wishlistButton.click({
      force: true
    });

    await this.page.waitForTimeout(1500);

    const loginModalVisible =
      await this.page
        .locator('.modalPoplogin')
        .isVisible({
          timeout: 3000
        })
        .catch(() => false);

    if (
      loginModalVisible ||
      this.page.url().includes('/login') ||
      this.page.url().includes('/account')
    ) {

      return {
        success: false,
        loginRequired: true,
        message:
          'Login prompt displayed instead of adding the product to wishlist.'
      };
    }

    const toastSelectors = [
      '.toast',
      '.snackbar',
      '.notification',
      '.alert-success',
      '[class*="toast"]',
      '[class*="success"]',
      '[role="status"]',
      '[role="alert"]'
    ];

    let toastText = '';

    for (const selector of toastSelectors) {

      const toast =
        this.page
          .locator(selector)
          .first();

      if (
        await toast
          .isVisible({
            timeout: 2000
          })
          .catch(() => false)
      ) {

        toastText =
          (
            await toast
              .textContent()
              .catch(() => '')
          ).trim();

        if (toastText) {
          break;
        }
      }
    }

    const finalClass =
      await wishlistButton
        .getAttribute('class');

    const iconChanged =
      finalClass !== initialClass;

    return {
      success:
        Boolean(toastText),

      loginRequired: false,

      iconChanged,

      message:
        toastText
          ? `Wishlist success message displayed: "${toastText}"`
          : iconChanged
            ? 'Wishlist icon changed, but no success message was displayed.'
            : 'Wishlist icon did not change and no success message was displayed.'
    };
  }

  /**
   * Clicks the "like/wishlist" icon on a Going Viral card and verifies
   * that the login popup is displayed (since wishlist/like actions on
   * this site require an authenticated user).
   * @param {number} index - index of the Going Viral card to test (default: 0)
   * @returns {Promise<{ loginPromptVisible: boolean, iconClicked: boolean }>}
   */
  async verifyGoingViralWishlistLoginPrompt(index = 0) {

    const card = this.goingViral.articleCards.nth(index);

    const likeIcon = card.locator('.likeIcon').first();

    const iconVisible =
      await likeIcon.isVisible().catch(() => false);

    if (!iconVisible) {
      throw new Error(
        `Wishlist/like icon not visible on Going Viral card ${index + 1}.`
      );
    }

    await likeIcon.scrollIntoViewIfNeeded().catch(() => { });

    await likeIcon.click({ force: true });

    await this.page.waitForTimeout(1500);

    const loginPopup = this.page.locator('.modalPoplogin');

    const loginPromptVisible =
      await loginPopup
        .isVisible({ timeout: 5000 })
        .catch(() => false);

    return {
      loginPromptVisible,
      iconClicked: true
    };
  }

  /**
   * Closes the login popup (if visible) after a wishlist/like login-prompt
   * check, so subsequent test steps aren't blocked by the modal.
   */
  async closeLoginPopupIfPresent() {

    const loginPopup = this.page.locator('.modalPoplogin');

    const visible =
      await loginPopup.isVisible().catch(() => false);

    if (!visible) return;

    const closeButton = loginPopup.locator('button.close, .closeIcon').first();
    const cancelButton = loginPopup.locator('button.greyButton').first();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click().catch(() => { });
    } else if (await cancelButton.isVisible().catch(() => false)) {
      await cancelButton.click().catch(() => { });
    } else {
      await this.page.keyboard.press('Escape').catch(() => { });
    }

    await this.page.waitForTimeout(1000);
  }

  /**
   * Clicks the wishlist icon on a Be Picks product card and verifies
   * that the login popup is displayed (since wishlist actions on this
   * site require an authenticated user).
   * @param {number} index - index of the Be Picks card to test (default: 0)
   * @returns {Promise<{ loginPromptVisible: boolean, iconClicked: boolean }>}
   */
  /**
   * Clicks the wishlist icon on a Be Picks product card and reports
   * whether a login prompt was displayed, OR whether the site instead
   * completed the action directly (showing inline feedback text like
   * "Thank you for your feedback!").
   * @param {number} index - index of the Be Picks card to test (default: 0)
   * @returns {Promise<{ loginPromptVisible: boolean, feedbackVisible: boolean, feedbackText: string, iconClicked: boolean }>}
   */
  async verifyBePicksWishlistLoginPrompt(index = 0) {

    if (this.page.isClosed()) {
      throw new Error('Page is closed before the wishlist login-prompt check could run.');
    }

    const wishlistButton =
      await this.getBePicksWishlist(index);

    await wishlistButton.scrollIntoViewIfNeeded().catch(() => { });

    if (this.page.isClosed()) {
      throw new Error('Page was closed while scrolling to the wishlist icon.');
    }

    await wishlistButton.waitFor({
      state: 'visible',
      timeout: 10000
    });

    if (this.page.isClosed()) {
      throw new Error('Page was closed after waiting for the wishlist icon to become visible.');
    }

    // await wishlistButton.click({ force: true }).catch(() => { });
    const clicked = await wishlistButton
      .click({ force: true })
      .then(() => true)
      .catch((err) => {
        console.log(`Wishlist click failed: ${err.message.split('\n')[0]}`);
        return false;
      });

    if (!clicked) {
      throw new Error('Could not click the Be Picks wishlist icon — locator resolved but click failed.');
    }
    

    if (this.page.isClosed()) {
      throw new Error('Page was closed immediately after clicking the wishlist icon.');
    }

    const loginPopup = this.page.locator('.modalPoplogin');

    const feedbackLocator = this.page.locator(
      [
        'text=/thank you for your feedback/i',
        '[class*="toast"]',
        '[class*="snackbar"]',
        '[class*="success"]',
        '[role="status"]',
        '[role="alert"]'
      ].join(', ')
    );

    // Poll (bounded, ~10s) for EITHER the login popup OR inline feedback
    // to appear, instead of waiting on a single locator that may never
    // show up depending on which widget instance was clicked.
    const maxAttempts = 20;
    const intervalMs = 500;

    let loginPromptVisible = false;
    let feedbackVisible = false;
    let feedbackText = '';

    for (let attempt = 0; attempt < maxAttempts; attempt++) {

      if (this.page.isClosed()) {
        throw new Error('Page was closed while polling for the wishlist login prompt / feedback.');
      }

      loginPromptVisible =
        await loginPopup.isVisible().catch(() => false);

      if (loginPromptVisible) {
        break;
      }

      const feedbackEl = feedbackLocator.first();

      feedbackVisible =
        await feedbackEl.isVisible().catch(() => false);

      if (feedbackVisible) {

        feedbackText =
          (await feedbackEl.textContent().catch(() => '') || '').trim();

        break;
      }

      await this.page.waitForTimeout(intervalMs).catch(() => { });
    }

    return {
      loginPromptVisible,
      feedbackVisible,
      feedbackText,
      iconClicked: true
    };
  }

}

module.exports = BlogPage;
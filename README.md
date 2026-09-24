# Playwright Local Setup & Execution Guide for BeBeautiful

## 1. Prerequisites

- Node.js (Latest LTS recommended – v20+)
- npm (included with Node.js)
- VS Code (Recommended)

### Verify installation

```bash
node -v
npm -v
```

---

## 2. Clone the Repository

```bash
git clone <repository-url>
cd BEBE-Sanity-Automation
```

> If you already have the project, navigate to its root directory.

---

## 3. Install Dependencies

```bash
npm install
npx playwright install
```

`npx playwright install` downloads the required browser binaries.

---

## 4. Configure Environment

Create a `.env` file in the project root if required.

Example:

```text
BASE_URL=https://www.bebeautiful.in
```

---

## 5. Running Tests

### Run a specific test

```bash
npx playwright test articlePage.spec.js
npx playwright test cartItems.spec.js
npx playwright test productDetail.spec.js
```

### Run all test cases:

``` bash
npx playwright test
```


---

## 6. Generate Reports

### HTML Report

```bash
npx playwright test --reporter=html
npx playwright show-report
```

### Monocart Report

```bash
npm install monocart-reporter
npx monocart show-report monocart-report/index.html
```

---

## 7. Debug Mode

```bash
npx playwright test --debug
```

---

## 8. Codegen (Recorder)

```bash
npx playwright codegen https://www.bebeautiful.in/
```

---

## 9. Best Practices

- Follow the Page Object Model (POM).
- Keep locators inside page classes.
- Keep business logic inside page classes.
- Keep test assertions and test flow inside spec files.
- Store environment-specific values in a `.env` file.
- Reuse fixtures and helper utilities where possible.
- Review HTML or Monocart reports after execution.

---


## 10. Optional (Recommended)

### Run all sa1nity tests

``` bash
npx playwright test
```

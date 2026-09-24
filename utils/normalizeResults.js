const fs = require('fs');
const path = require('path');

const rawFile = path.join(__dirname, '../reports/raw-results.json');
const verifiedFile = path.join(__dirname, '../reports/verified-results.json');
const normalizedFile = path.join(__dirname, '../reports/normalized-results.json');

const sourceFile = fs.existsSync(verifiedFile) ? verifiedFile : rawFile;

if (!fs.existsSync(sourceFile)) {
    console.log(`❌ ${sourceFile} not found`);
    process.exit(1);
}

// ─── TC Metadata ──────────────────────────────────────────────────────────────
// Provides module, scenario, step descriptions, and expected result per TC.
// Used to produce legacy-compatible records from modern-schema test output.

const TC_METADATA = {

    TC059: {
        module: 'Blogs',
        scenario: 'Verify Article listing Page Header and Basic Details',
        steps: [
            'Open article listing page',
            'Verify breadcrumb section',
            'Verify greeting text',
            'Verify hero article section',
            'Verify read time',
            'Verify hero article title',
            'Verify author name',
            'Verify Like and Share options',
            'Verify hero article navigation',
            'Verify marquee section',
        ],
        expected: 'Article listing page header and hero section details should display successfully.',
    },

    TC060: {
        module: 'Blogs',
        scenario: 'Verify article listing section below marquee',
        steps: [
            'Open article listing page',
            'Navigate below marquee section',
            'Verify article listing container',
            'Verify article cards',
            'Verify article images',
            'Verify wishlist and share options',
            'Verify author names',
            'Verify Load More functionality',
            'Verify Sort functionality',
        ],
        expected: 'Article listing section below marquee should display and navigate correctly.',
    },

    TC061: {
        module: 'Blogs',
        scenario: "Verify 'People are looking for' section",
        steps: [
            'Open article listing page',
            'Locate People are looking for section',
            'Verify article cards',
            'Verify article images',
            'Verify Like and Share functionality',
            'Verify navigation controls',
            'Verify navigation dots',
            'Verify carousel navigation',
        ],
        expected: 'People are looking for section should display and function correctly.',
    },

    TC062: {
        module: 'Blogs',
        scenario: "Verify 'All articles' section",
        steps: [
            'Open article listing page',
            'Locate All Articles section',
            'Verify article cards',
            'Verify article category labels',
            'Verify article images',
            'Verify Like and Share options',
            'Verify author names',
            'Verify Load More functionality',
            'Verify Sort functionality',
        ],
        expected: 'All Articles section should display and interact correctly.',
    },

    TC070: {
        module: 'Login',
        scenario: 'Verify UI of login page',
        steps: [
            'Navigate to Login page',
            'Verify login screen',
            'Verify login banner',
            "Verify Feels good to see you again text",
            "Verify Let's dive in text",
            'Verify mobile number field',
            'Verify Login button',
            'Verify Google login option',
            'Verify Facebook login option',
            'Verify Create account link',
        ],
        expected: 'Login page UI should display all mandatory elements successfully.',
    },

    TC071: {
        module: 'Login',
        scenario: 'Verify mobile number field validation',
        steps: [
            'Navigate to Login page',
            'Verify alphabet rejection',
            'Verify special character rejection',
            'Verify incomplete number validation',
            'Verify blank field validation',
            'Verify valid mobile number acceptance',
        ],
        expected: 'Mobile number validation should work correctly on Login page.',
    },

    TC074: {
        module: 'Signup',
        scenario: 'Verify signup page UI',
        steps: [
            'Navigate to Signup page',
            'Verify Signup banner',
            "Verify Let's get started heading",
            'Verify Welcome text',
            "Verify Let's make this official text",
            'Verify mobile number field',
            'Verify Signup button',
            'Verify Google login option',
            'Verify Facebook login option',
            'Verify Login link',
        ],
        expected: 'Signup page UI should display all mandatory elements successfully.',
    },

    TC075: {
        module: 'Signup',
        scenario: 'Verify Signup Mobile Number Field Validation',
        steps: [
            'Navigate to Signup page',
            'Verify alphabet rejection',
            'Verify special character rejection',
            'Verify incomplete number validation',
            'Verify blank field validation',
            'Verify valid mobile number acceptance',
            'Verify registered number handling',
            'Verify blocked signup flow',
        ],
        expected: 'Mobile number validation should work correctly on Signup page.',
    },
};

const migratedTests = Object.keys(TC_METADATA);

let results = [];

try {
    results = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
} catch (err) {
    console.log(`❌ Failed to parse ${sourceFile}: ${err.message}`);
    process.exit(1);
}

if (!Array.isArray(results)) {
    console.log(`❌ ${sourceFile} is not a valid array`);
    process.exit(1);
}

const normalizedResults = results.map((test) => {
    if (test.results) {
        return test;
    }

    const isModernSchema = (
        migratedTests.includes(test.testCaseId) &&
        Array.isArray(test.steps) &&
        !test.results
    );

    if (!isModernSchema) {
        console.log(`⚠️  Unknown schema skipped: ${test.testCaseId || 'UNKNOWN_TEST'}`);
        return test;
    }

    console.log(`🔄 Normalizing ${test.testCaseId}`);

    const meta = TC_METADATA[test.testCaseId] || {};
    const normalizedStepResults = (test.steps || []).map((s) => ({
        step: s.status || '',
        status: s.step || 'UNKNOWN',
        details: '',
    }));

    const stepLines = (
        meta.steps || normalizedStepResults.map((r) => r.step)
    ).map((label, i) => `${i + 1}. ${label}`).join('\n');

    return {
        testId: test.testCaseId || 'UNKNOWN_TEST',
        module: meta.module || 'Modern',
        scenario: meta.scenario || test.title || 'Untitled Scenario',
        steps: stepLines,
        expected: meta.expected || 'Validation should complete successfully.',
        priority: meta.priority || 'P0',
        results: normalizedStepResults,
        originalSteps: test.steps || [],
        normalizedAt: new Date().toISOString(),
    };
});

function getTcNumber(record) {
    const id = record.testId || record.testCaseId || '';
    const match = id.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : Infinity;
}

normalizedResults.sort((a, b) => getTcNumber(a) - getTcNumber(b));

try {
    fs.writeFileSync(normalizedFile, JSON.stringify(normalizedResults, null, 2), 'utf8');
    console.log(`✅ Results normalized successfully to ${normalizedFile}`);
} catch (err) {
    console.log(`❌ Failed to write normalized results: ${err.message}`);
    process.exit(1);
}

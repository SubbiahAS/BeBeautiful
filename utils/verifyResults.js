const fs = require('fs');
const path = require('path');

const mappings = require('../config/reportMappings');
const rawResultsPath = path.join(__dirname, '../reports/raw-results.json');
const verifiedResultsPath = path.join(__dirname, '../reports/verified-results.json');

const outputHintHandlers = {
  suppressUrls(text) {
    return String(text)
      .replace(/https?:\/\/\S+/gi, '[URL suppressed]')
      .replace(/www\.\S+/gi, '[URL suppressed]');
  },
  shortenTitles(text) {
    const value = String(text);
    return value.length > 140 ? `${value.slice(0, 137).trim()}...` : value;
  },
};

function normalizeStepText(step) {
  return String(step || '')
    .replace(/\[(Card|Article)\s*([0-9]+)\]/gi, (match, label, num) => `[${label} ${num}]`)
    .replace(/^\s*[0-9]+[a-z]?\.\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function applyGlobalRules(rawLogs) {
  if (!mappings.globalRules || Object.keys(mappings.globalRules).length === 0) {
    return rawLogs;
  }

  return rawLogs;
}

function applyOutputHintsToText(text, hints) {
  if (!text || !hints) {
    return text;
  }

  return Object.keys(hints).reduce((currentText, hintKey) => {
    const handler = outputHintHandlers[hintKey];
    if (!handler) {
      return currentText;
    }
    return handler(currentText, hints[hintKey]);
  }, String(text));
}

function applyOutputHintsToEntry(entry, hints) {
  if (!entry || !hints || Object.keys(hints).length === 0) {
    return entry;
  }

  return {
    ...entry,
    expectedStep: applyOutputHintsToText(entry.expectedStep, hints),
    rawStep: applyOutputHintsToText(entry.rawStep, hints),
    details: applyOutputHintsToText(entry.details, hints),
  };
}

function getRawEntryStepText(rawEntry) {
  if (!rawEntry) {
    return '';
  }

  const stepText = String(rawEntry.step || '').trim();
  const statusText = String(rawEntry.status || '').trim();
  const isModernSchema = /^(PASS|FAIL|SKIP)$/i.test(stepText) && statusText && !/^(PASS|FAIL|SKIP)$/i.test(statusText);

  if (isModernSchema) {
    return statusText;
  }

  return stepText || statusText;
}

function getRawEntryStatus(rawEntry) {
  if (!rawEntry) {
    return null;
  }

  const stepText = String(rawEntry.step || '').trim();
  const statusText = String(rawEntry.status || '').trim();
  const isModernSchema = /^(PASS|FAIL|SKIP)$/i.test(stepText) && statusText && !/^(PASS|FAIL|SKIP)$/i.test(statusText);

  if (isModernSchema) {
    return stepText.toUpperCase();
  }

  return statusText || stepText;
}

function findRawLogIndex(rawLogs, expectedLog, excludedIndices = new Set()) {
  if (expectedLog.logKey) {
    const exactIndex = rawLogs.findIndex(
      (entry, index) => !excludedIndices.has(index) && entry.logKey === expectedLog.logKey,
    );
    if (exactIndex !== -1) {
      return exactIndex;
    }
  }

  return rawLogs.findIndex(
    (entry, index) =>
      !excludedIndices.has(index) && normalizeStepText(getRawEntryStepText(entry)) === normalizeStepText(expectedLog.step),
  );
}

function findKnownUnmappedRawIndices(rawLogs, knownUnmappedLogs) {
  const indices = new Set();

  rawLogs.forEach((entry, index) => {
    const matchesKnown = knownUnmappedLogs.some((known) => {
      if (known.logKey && entry.logKey && known.logKey === entry.logKey) {
        return true;
      }
      return normalizeStepText(getRawEntryStepText(entry)) === normalizeStepText(known.step);
    });

    if (matchesKnown) {
      indices.add(index);
    }
  });

  return indices;
}

function buildMatchedExecutionLog(expectedLog, rawEntry) {
  if (!rawEntry) {
    return null;
  }

  return {
    logKey: expectedLog.logKey || null,
    expectedStep: expectedLog.step,
    rawStep: getRawEntryStepText(rawEntry),
    status: getRawEntryStatus(rawEntry),
    details: rawEntry.details || null,
  };
}

function buildGroupVerification(group, rawLogs, matchedRawIndices, knownUnmappedRawIndices) {
  const matchedExecutionLogs = [];
  const missingExecutionLogs = [];

  for (const expectedLog of group.executionLogs || []) {
    const excludedIndices = new Set([...knownUnmappedRawIndices]);
    const rawIndex = findRawLogIndex(rawLogs, expectedLog, excludedIndices);
    const rawEntry = rawIndex === -1 ? null : rawLogs[rawIndex];

    if (rawEntry) {
      matchedRawIndices.add(rawIndex);
      const matchedLog = buildMatchedExecutionLog(expectedLog, rawEntry);
      matchedExecutionLogs.push(applyOutputHintsToEntry(matchedLog, group.outputHints || {}));
    } else {
      missingExecutionLogs.push({
        logKey: expectedLog.logKey || null,
        expectedStep: expectedLog.step,
      });
    }
  }

  const baseGroup = {
    groupId: group.id,
    outputMode: group.outputMode,
    requirement: group.requirement,
    outputHints: group.outputHints || {},
    verifiedExecutionLogs: matchedExecutionLogs,
    missingExecutionLogs,
    notes: group.notes || null,
  };

  if (group.outputMode === 'summary') {
    return {
      ...baseGroup,
      summary: applyOutputHintsToText(group.requirement, group.outputHints || {}),
    };
  }

  return baseGroup;
}

function buildVerificationSummary(totalExpectedLogs, matchedLogs) {
  const missingLogs = totalExpectedLogs - matchedLogs;
  const coveragePercent = totalExpectedLogs === 0 ? 0 : Math.round((matchedLogs / totalExpectedLogs) * 100);

  return {
    totalExpectedLogs,
    matchedLogs,
    missingLogs,
    coveragePercent,
  };
}

function processMappedEntry(entry, mapping) {
  const rawLogs = applyGlobalRules(entry.results || entry.steps || []);
  const knownUnmappedLogs = mapping.unmappedLogs || [];
  const knownUnmappedRawIndices = findKnownUnmappedRawIndices(rawLogs, knownUnmappedLogs);
  const matchedRawIndices = new Set();
  const verifiedActualResults = [];

  let totalExpectedLogs = 0;
  let matchedLogs = 0;

  for (const group of mapping.expectedGroups || []) {
    const groupVerified = buildGroupVerification(group, rawLogs, matchedRawIndices, knownUnmappedRawIndices);
    verifiedActualResults.push(groupVerified);
    totalExpectedLogs += group.executionLogs ? group.executionLogs.length : 0;
    matchedLogs += groupVerified.verifiedExecutionLogs.length;
  }

  const detectedUnmappedLogs = rawLogs
    .map((entry, index) => ({ entry, index }))
    .filter(({ index }) => !matchedRawIndices.has(index) && !knownUnmappedRawIndices.has(index))
    .map(({ entry }) => ({
      logKey: entry.logKey || null,
      step: entry.step,
      status: entry.status,
      details: entry.details || null,
    }));

  return {
    ...entry,
    reportingMode: mapping.reportingMode,
    verifiedActualResults,
    knownUnmappedLogs,
    detectedUnmappedLogs,
    verificationSummary: buildVerificationSummary(totalExpectedLogs, matchedLogs),
    unmappedLogs: knownUnmappedLogs,
  };
}

function processPlaceholderEntry(entry) {
  return {
    ...entry,
    reportingMode: null,
    verifiedActualResults: [],
    knownUnmappedLogs: [],
    detectedUnmappedLogs: [],
    verificationSummary: {
      totalExpectedLogs: 0,
      matchedLogs: 0,
      missingLogs: 0,
      coveragePercent: 0,
    },
  };
}

function resolveTestCaseId(entry) {
  return entry.testId || entry.testCaseId || null;
}

function main() {
  const rawResults = JSON.parse(fs.readFileSync(rawResultsPath, 'utf8'));
  const verifiedResults = rawResults.map((entry) => {
    const tcId = resolveTestCaseId(entry);
    const mapping = tcId ? mappings.testCases[tcId] : null;
    if (!mapping) {
      return processPlaceholderEntry(entry);
    }
    return processMappedEntry(entry, mapping);
  });

  fs.writeFileSync(verifiedResultsPath, JSON.stringify(verifiedResults, null, 2), 'utf8');
  console.log(`Verified results written to ${verifiedResultsPath}`);
}

main();

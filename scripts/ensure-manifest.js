const fs = require('fs');
const path = require('path');

const manifestPath = path.join(process.cwd(), '.next', 'server', 'middleware-manifest.json');
const defaultManifest = {
  version: 3,
  middleware: {},
  functions: {},
  sortedMiddleware: []
};

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const ensureManifest = () => {
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

  let shouldWrite = true;

  if (fs.existsSync(manifestPath)) {
    shouldWrite = false;
    try {
      const contents = fs.readFileSync(manifestPath, 'utf8');
      const existing = contents.trim().length ? JSON.parse(contents) : undefined;
      shouldWrite = !existing;
      shouldWrite = shouldWrite || existing.version !== defaultManifest.version;
      shouldWrite = shouldWrite || !isPlainObject(existing.middleware);
      shouldWrite = shouldWrite || !isPlainObject(existing.functions);
      shouldWrite = shouldWrite || !Array.isArray(existing.sortedMiddleware);
    } catch (error) {
      shouldWrite = true;
    }
  }

  if (shouldWrite) {
    fs.writeFileSync(manifestPath, JSON.stringify(defaultManifest, null, 2));
  }
};

try {
  ensureManifest();
} catch (error) {
  console.error('[ensure-manifest] Failed to ensure middleware manifest:', error);
  process.exit(1);
}

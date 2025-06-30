import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const collectionName = process.argv[2];

if (!collectionName) {
  console.error('Please provide a collection name: node scripts/createCollection.js MyCollection');
  process.exit(1);
}

const collectionFileName = `${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}.ts`;
const collectionFilePath = path.resolve(__dirname, '../src/collections', collectionFileName);
const payloadConfigPath = path.resolve(__dirname, '../src/payload.config.ts');

const collectionTemplate = `import type { CollectionConfig } from 'payload';

export const ${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}: CollectionConfig = {
  slug: '${collectionName.toLowerCase()}',
  admin: {
    useAsTitle: 'title', // You might want to change this based on your collection's fields
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
};
`;

// Create collection file
fs.writeFileSync(collectionFilePath, collectionTemplate);
console.log(`Created collection file: ${collectionFilePath}`);

// Update payload.config.ts
let payloadConfigContent = fs.readFileSync(payloadConfigPath, 'utf8');

const importStatement = `import { ${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} } from './collections/${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}';`;
const collectionsArrayRegex = /(collections:\s*\[[^\]]*?)(\])/s;

if (!payloadConfigContent.includes(importStatement)) {
  // Add import statement
  payloadConfigContent = importStatement + '\\n' + payloadConfigContent;
}

if (collectionsArrayRegex.test(payloadConfigContent)) {
  payloadConfigContent = payloadConfigContent.replace(
    collectionsArrayRegex,
    `$1,\\n    ${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}$2`
  );
} else {
  console.error('Could not find collections array in payload.config.ts');
  process.exit(1);
}

fs.writeFileSync(payloadConfigPath, payloadConfigContent);
console.log(`Updated ${payloadConfigPath} with new collection.`);

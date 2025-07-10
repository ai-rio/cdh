# Collection Scaffolding Script

This script automates the creation of new Payload CMS collections, reducing manual effort and ensuring consistency.

## Features

*   Generates a new collection file (`.ts`) in `src/collections` with a basic structure.
*   Automatically imports and registers the new collection in `src/payload.config.ts`.

## Usage

To create a new collection, run the following command in your terminal:

```bash
pnpm generate:collection [CollectionName]
```

Replace `[CollectionName]` with the desired name of your collection (e.g., `Products`, `Categories`). The script will automatically convert the name to PascalCase for the file and slugify it for the collection slug.

## Example

To create a collection named `Products`:

```bash
pnpm generate:collection Products
```

This will:

1.  Create `src/collections/Products.ts` with a basic collection configuration.
2.  Add `import { Products } from './collections/Products';` to `src/payload.config.ts`.
3.  Add `Products` to the `collections` array in `src/payload.config.ts`.

## Considerations

*   The generated collection file includes a basic `title` field. You will need to customize the `fields` array in the generated file to match your collection's requirements.
*   The `useAsTitle` admin property is set to `title` by default. Adjust this as needed.
*   The script performs basic checks but does not handle complex scenarios like duplicate collection names or malformed `payload.config.ts` files. Always review the changes after running the script.

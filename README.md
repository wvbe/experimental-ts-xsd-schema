This is a tool for defining a data schema in such a way that it can be serialized to a TypeScript
type definition, as well as an XSD module.

In the future it may generate a function to convert XML data in this schema to a JS object.

Other conversions (such as generating an XSD from TS types) are probably out of scope.

For example;

```ts
// schema-test.ts
import { toType } from 'https://raw.githubusercontent.com/wvbe/experimental-ts-xsd-schema/master/mod.ts';

await Deno.writeTextFile(
  'schema-out.ts',
  toType({
    id: 'test-2',
    root: {
      type: 'element',
      name: 'root-element',
      attributes: [
        {
          type: 'attribute',
          name: 'opt',
          constraint: 'string',
          multiple: false,
          required: false,
        },
        {
          type: 'attribute',
          name: 'req',
          constraint: 'number',
          multiple: false,
          required: true,
        },
        {
          type: 'attribute',
          name: 'opts',
          constraint: 'string',
          multiple: true,
          required: false,
        },
        {
          type: 'attribute',
          name: 'reqs',
          constraint: 'number',
          multiple: true,
          required: true,
        },
      ],
      contents: null,
    },
  }),
);
```

```sh
deno run --allow-write schema-test.ts
cat schema-out.ts
```
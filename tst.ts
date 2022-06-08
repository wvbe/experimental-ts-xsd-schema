import { toType } from 'https://raw.githubusercontent.com/wvbe/experimental-ts-xsd-schema/master/mod.ts';

await Deno.writeTextFile(
	'schema.ts',
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

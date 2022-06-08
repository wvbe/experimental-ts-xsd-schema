import { expect, it, run } from 'https://deno.land/x/tincan@1.0.1/mod.ts';

import { toType } from './schemaBuilder.ts';
import { formatTypeScript as formatted } from './utilities.ts';

/**
 * This test asserts that the `toType` function does not immediately crash.
 */
it('Serialize an empty schema', () => {
	expect(
		toType({
			id: 'test-1',
			root: {
				type: 'element',
				name: 'root-element',
				attributes: [],
				contents: null,
			},
		}),
	).toBe(
		formatted(`
			export type Schema = {};
		`),
	);
});

/**
 * This test asserts that attributes with varying settings of `.required` and `.multiple` are
 * serialized correctly to TS.
 */
it('Serialize an element with attributes', () => {
	expect(
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
	).toBe(
		formatted(`
			export type Schema = {
				opt?: string;
				req: number;
				opts?: string[];
				reqs: number[]
			};
		`),
	);
});

/**
 * This test asserts that unordered element content models are serialized correctly
 */
it('Serialize an unordered content model', () => {
	expect(
		toType({
			id: 'test-3',
			root: {
				type: 'element',
				name: 'root-element',
				attributes: [],
				contents: {
					type: 'unordered',
					contents: [
						{
							type: 'element',
							name: 'child-element-1',
							attributes: [
								{
									type: 'attribute',
									name: 'foo',
									constraint: 'string',
									multiple: false,
									required: false,
								},
							],
							contents: null,
						},
						{
							type: 'element',
							name: 'child-element-2',
							attributes: [
								{
									type: 'attribute',
									name: 'bar',
									constraint: 'string',
									multiple: false,
									required: false,
								},
							],
							contents: null,
						},
					],
				},
			},
		}),
	).toBe(
		formatted(`
			export type Schema = {
				$contents: Array<
					{
						foo?: string;
					} |
					{
						bar?: string;
					}
				>;
			};
		`),
	);
});

/**
 * This test asserts that ordered element content models are serialized correctly
 */
it('Serialize an ordered content model', () => {
	expect(
		toType({
			id: 'test-3',
			root: {
				type: 'element',
				name: 'root-element',
				attributes: [],
				contents: {
					type: 'ordered',
					contents: [
						{
							type: 'element',
							name: 'child-element-1',
							attributes: [
								{
									type: 'attribute',
									name: 'foo',
									constraint: 'string',
									multiple: false,
									required: false,
								},
							],
							contents: null,
						},
						{
							type: 'element',
							name: 'child-element-2',
							attributes: [
								{
									type: 'attribute',
									name: 'bar',
									constraint: 'string',
									multiple: false,
									required: false,
								},
							],
							contents: null,
						},
					],
				},
			},
		}),
	).toBe(
		formatted(`
			export type Schema = {
				$contents: [
					{
						foo?: string;
					},
					{
						bar?: string;
					}
				];
			};
		`),
	);
});

run();

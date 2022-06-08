import { expect, it, run } from 'https://deno.land/x/tincan@1.0.1/mod.ts';

import { formatTypeScript as formatted } from './libraries/utilities.ts';
import Schema from './mod.ts';

/**
 * This test asserts that the `toType` function does not immediately crash.
 */
it('Serialize an empty schema', () => {
	const schema = new Schema({
		id: 'test-1',
		root: {
			type: 'element',
			name: 'root-element',
			attributes: [],
			contents: null,
		},
	});
	expect(schema.toTypeScript()).toBe(
		formatted(`
			export type Schema = {};
		`),
	);
	expect(schema.toXsd()).toBe(
		`
			<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://todo" xmlns="http://todo" elementFormDefault="qualified">
				<xs:element name="root-element" />
			</xs:schema>
		`.replace(/\n|\t/g, ''),
	);
});

/**
 * This test asserts that attributes with varying settings of `.required` and `.multiple` are
 * serialized correctly to TS.
 */
it('Serialize an element with attributes', () => {
	const schema = new Schema({
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
	});
	expect(schema.toTypeScript()).toBe(
		formatted(`
			export type Schema = {
				opt?: string;
				req: number;
				opts?: string[];
				reqs: number[]
			};
		`),
	);
	expect(schema.toXsd()).toBe(
		`
			<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://todo" xmlns="http://todo" elementFormDefault="qualified">
				<xs:element name="root-element">
					<xs:complexType>
						<xs:attribute name="opt" type="xs:string" use="optional" />
						<xs:attribute name="req" type="xs:number" use="required" />
						<xs:attribute name="opts" type="xs:string" use="optional" />
						<xs:attribute name="reqs" type="xs:number" use="required" />
					</xs:complexType>
				</xs:element>
			</xs:schema>
		`.replace(/\n|\t/g, ''),
	);
});

/**
 * This test asserts that unordered element content models are serialized correctly
 */
it('Serialize an unordered content model', () => {
	const schema = new Schema({
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
	});
	expect(schema.toTypeScript()).toBe(
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
	expect(schema.toXsd()).toBe(
		`
			<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://todo" xmlns="http://todo" elementFormDefault="qualified">
				<xs:element name="root-element">
					<xs:complexType>
						<xs:choice>
							<xs:element name="child-element-1">
								<xs:complexType>
									<xs:attribute name="foo" type="xs:string" use="optional" />
								</xs:complexType>
							</xs:element>
							<xs:element name="child-element-2">
								<xs:complexType>
									<xs:attribute name="bar" type="xs:string" use="optional" />
								</xs:complexType>
							</xs:element>
						</xs:choice>
					</xs:complexType>
				</xs:element>
			</xs:schema>
		`.replace(/\n|\t/g, ''),
	);
});

/**
 * This test asserts that ordered element content models are serialized correctly
 */
it('Serialize an ordered content model', () => {
	const schema = new Schema({
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
	});
	expect(schema.toTypeScript()).toBe(
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
	expect(schema.toXsd()).toBe(
		`
			<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://todo" xmlns="http://todo" elementFormDefault="qualified">
				<xs:element name="root-element">
					<xs:complexType>
						<xs:sequence>
							<xs:element name="child-element-1">
								<xs:complexType>
									<xs:attribute name="foo" type="xs:string" use="optional" />
								</xs:complexType>
							</xs:element>
							<xs:element name="child-element-2">
								<xs:complexType>
									<xs:attribute name="bar" type="xs:string" use="optional" />
								</xs:complexType>
							</xs:element>
						</xs:sequence>
					</xs:complexType>
				</xs:element>
			</xs:schema>
		`.replace(/\n|\t/g, ''),
	);
});

run();

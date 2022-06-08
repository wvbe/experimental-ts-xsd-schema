import {
	Jsonml,
	SchemaAttribute,
	SchemaAttributeConstraints,
	SchemaContentModelOrdered,
	SchemaContentModelUnordered,
	SchemaDefinition,
	SchemaElement,
} from './types.ts';
import { formatJsonml } from './utilities.ts';

function $constraint(constraint: SchemaAttributeConstraints) {
	switch (constraint) {
		case 'date':
			return 'xs:date';
		case 'string':
			return 'xs:string';
		case 'number':
			return 'xs:number';
		default:
			throw new Error(`Unsupported type "${constraint}"`);
	}
}

function $attribute(attribute: SchemaAttribute): Jsonml {
	return [
		'xs:attribute',
		{
			name: attribute.name,
			type: $constraint(attribute.constraint),
			use: attribute.required ? 'required' : 'optional',
		},
	];
}

function $contentModelOrdered(contentModel: SchemaContentModelOrdered): Jsonml {
	return [
		'xs:sequence',
		...contentModel.contents.map((content) => {
			if (content.type === 'element') {
				return $element(content);
			} else if (content.type === 'unordered') {
				return $contentModelUnordered(content);
			} else {
				throw new Error();
			}
		}),
	];
}

function $contentModelUnordered(contentModel: SchemaContentModelUnordered): Jsonml {
	return [
		'xs:choice',
		...contentModel.contents.map((content) => {
			if (content.type === 'element') {
				return $element(content);
			} else if (content.type === 'ordered') {
				return $contentModelOrdered(content);
			} else {
				throw new Error();
			}
		}),
	];
}

function $element(element: SchemaElement): Jsonml {
	const attributes: { [name: string]: string } = { name: element.name };
	const jsonml: Jsonml = ['xs:element', attributes];

	if (!element.contents && !element.attributes.length) {
		return jsonml;
	}

	const complexType: Jsonml = ['xs:complexType'];

	if (element.contents?.type === 'ordered') {
		complexType.push($contentModelOrdered(element.contents));
	} else if (element.contents?.type === 'unordered') {
		complexType.push($contentModelUnordered(element.contents));
	} else if (element.contents?.type === 'contents') {
		attributes.type = 'xs:string';
	}

	element.attributes.forEach((attr) => {
		complexType.push($attribute(attr));
	});

	jsonml.push(complexType);
	return jsonml;
}

export default function toXsd(schema: SchemaDefinition) {
	return formatJsonml([
		'xs:schema',
		{
			'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
			targetNamespace: 'http://todo',
			xmlns: 'http://todo',
			elementFormDefault: 'qualified',
		},
		$element(schema.root),
	]);
}

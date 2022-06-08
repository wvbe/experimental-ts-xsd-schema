import {
	SchemaAttribute,
	SchemaAttributeConstraints,
	SchemaContentModelOrdered,
	SchemaContentModelUnordered,
	SchemaDefinition,
	SchemaElement,
} from './types.ts';
import { formatTypeScript } from './utilities.ts';

function $constraint(constraint: SchemaAttributeConstraints) {
	switch (constraint) {
		case 'date':
			return 'Date';
		default:
			return constraint;
	}
}

function $contents() {
	return `$contents: string;`;
}

function $attribute(attribute: SchemaAttribute) {
	return `\n${attribute.name}${attribute.required ? '' : '?'}: ${
		$constraint(attribute.constraint) || 'any'
	}${attribute.multiple ? '[]' : ''};`;
}

function $contentModelOrdered(contentModel: SchemaContentModelOrdered) {
	let str = '$contents: [';
	str += contentModel.contents
		.map((content) => {
			if (content.type === 'element') {
				return $element(content);
			} else if (content.type === 'unordered') {
				return $contentModelUnordered(content);
			} else {
				throw new Error();
			}
		})
		.join(', ');
	str += '];';
	return str;
}

function $contentModelUnordered(contentModel: SchemaContentModelUnordered) {
	let str = '$contents: Array<';
	str += contentModel.contents
		.map((content) => {
			if (content.type === 'element') {
				return $element(content);
			} else if (content.type === 'ordered') {
				return $contentModelOrdered(content);
			} else {
				throw new Error();
			}
		})
		.join(' | ');
	str += '>;';
	return str;
}

function $element(element: SchemaElement) {
	let str = '{';
	element.attributes.forEach((attr) => {
		str += $attribute(attr);
	});
	if (element.contents) {
		if (element.contents.type === 'contents') {
			str += $contents();
		} else if (element.contents.type === 'ordered') {
			str += $contentModelOrdered(element.contents);
		} else if (element.contents.type === 'unordered') {
			str += $contentModelUnordered(element.contents);
		} else {
			throw new Error();
		}
	}
	str += '}';
	return str;
}

export default function toTypeScript(schema: SchemaDefinition) {
	return formatTypeScript(`export type Schema = ${$element(schema.root)}`);
}

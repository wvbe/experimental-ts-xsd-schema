export type SchemaAttributeConstraints = 'number' | 'string' | 'date';

export type SchemaAttribute = {
	type: 'attribute';
	name: string;
	constraint: SchemaAttributeConstraints;
	required: boolean;
	multiple: boolean;
};

export type SchemaContents = {
	type: 'contents';
};

export type SchemaElement = {
	type: 'element';
	name: string;
	attributes: SchemaAttribute[];
	contents: null | SchemaContents | SchemaContentModelUnordered | SchemaContentModelOrdered;
};

// Translate to xs:choice
export type SchemaContentModelUnordered = {
	type: 'unordered';
	contents: Array<SchemaElement | SchemaContentModelOrdered>;
};

// Translate to xs:sequence
export type SchemaContentModelOrdered = {
	type: 'ordered';
	contents: Array<SchemaElement | SchemaContentModelUnordered>;
};

export type SchemaDefinition = {
	id: string;
	root: SchemaElement;
};

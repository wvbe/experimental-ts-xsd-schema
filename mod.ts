import toTypeScript from './libraries/toTypeScript.ts';
import toXsd from './libraries/toXsd.ts';
import { SchemaDefinition } from './libraries/types.ts';

export default class schemaBuilder {
	model: SchemaDefinition;
	constructor(model: SchemaDefinition) {
		this.model = model;
	}

	toTypeScript(): string {
		return toTypeScript(this.model);
	}

	toXsd(): string {
		return toXsd(this.model);
	}
}

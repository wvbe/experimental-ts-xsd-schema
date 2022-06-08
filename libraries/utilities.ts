import prettier from 'https://esm.sh/prettier@2.5.0';
import typescriptParser from 'https://esm.sh/prettier@2.5.0/parser-typescript';

import { Jsonml } from './types.ts';

export function formatTypeScript(str: string): string {
	return prettier.format(str, {
		plugins: [typescriptParser],
		parser: 'typescript',
	});
}

export function formatJsonml(jsonml: Jsonml): string {
	if (typeof jsonml === 'string') {
		return new String(jsonml).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	// Make a copy of the JsonML array so we don't accidentially mutate anybody else's data

	let xmlString = '';
	let next = 0;

	const nodeName = jsonml[next] as string;
	++next;

	if (nodeName && nodeName.charAt(0) === '?') {
		return '<' + nodeName + (jsonml.length ? ' ' + jsonml.join('') : '') + '?>';
	}

	if (nodeName && nodeName.charAt(0) === '!') {
		return jsonml[next] ? '<!--' + jsonml[0] + '-->' : '<!---->';
	}

	if (nodeName) {
		xmlString += '<' + nodeName;

		if (jsonml[next] && typeof jsonml[next] === 'object' && !Array.isArray(jsonml[next])) {
			const attributes = jsonml[next] as { [attr: string]: string | undefined };
			++next;

			Object.keys(attributes)
				.filter((attributeName) => attributes[attributeName])
				.forEach((attributeName) => {
					xmlString += ' ' + attributeName + '="' + attributes[attributeName] + '"';
				});
		}

		if (next >= jsonml.length) {
			xmlString += ' />';
			return xmlString;
		}

		xmlString += '>';
	}

	for (true; next < jsonml.length; next++) {
		xmlString += formatJsonml(jsonml[next] as string | Jsonml);
	}

	if (nodeName) {
		xmlString += '</' + nodeName + '>';
	}

	return xmlString;
}

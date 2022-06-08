import prettier from 'https://esm.sh/prettier@2.5.0';
import typescriptParser from 'https://esm.sh/prettier@2.5.0/parser-typescript';

export function formatTypeScript(str: string) {
	return prettier.format(str, {
		plugins: [typescriptParser],
		parser: 'typescript',
	});
}


export const toCamelCase = (str: string): string => {
	return str
		.replace(/^[A-Z]*/g, (match) => match?.toLowerCase())
		.replace(/[-_](.)/g, (_match, char) => char.toUpperCase());
}
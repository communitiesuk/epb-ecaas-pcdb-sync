import { toCamelCase } from "./strings.js";

export const keysToCamelCase = (obj: Object): Record<string, unknown> => {
	const output: Record<string, unknown> = {};

	Object.keys(obj).forEach(prop => {
		output[toCamelCase(prop)] = obj[prop as keyof typeof obj];
	});

	return output;
}
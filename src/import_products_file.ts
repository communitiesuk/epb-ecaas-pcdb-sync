import type { BreResponse } from "./pcdb.types.js";
import { importAirSourceHeatPumps } from "./product-types/air_source_heat_pumps.js";
import { readFile } from "fs/promises";

export const importProducts = async (filePath: string) => {
	const file = await readFile(filePath, 'utf-8');
	const products = JSON.parse(file) as BreResponse[];

	await importAirSourceHeatPumps(products);
}
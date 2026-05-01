export interface BreResponse {
	exportDate: string;
	exportVersion: number;
	productTypes: BreProduct[]
}

export interface BreProduct {
	data: object[];
	productType: string;
	productTypeName: string;
}

export interface ProductData {
	id: string;
	brandName: string;
	modelName: string;
	modelQualifier?: string;
	technologyType: string;
	technologyGroup?: string;
}
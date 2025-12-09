export interface BreResponse {
	data: unknown[];
	TestData: unknown[];
	productType: string;
}

export interface ProductData {
	id: string;
	brandName: string;
	modelName: string;
	modelQualifier?: string;
	technologyType: string;
}

export interface ProductTestData {
	productID: string
}
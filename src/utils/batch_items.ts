export const batchItems = <T>(products: T[]): T[][] => {
	console.log(`Batching ${products.length} items`);
	
	const batchSize = 25;
	const batches: T[][] = [];

	const createBatch = (currentBatch: number) => {
		const batch = [];

		for (let index = currentBatch * batchSize; index < (currentBatch + 1) * batchSize; index++) {
			const p = products[index];

			if (!p) {
				break;
			}
			
			batch.push(p);
		}

		batches.push(batch);
		
		if (batch.length >= batchSize) {
			createBatch(currentBatch + 1);
		}
	};

	createBatch(0);

	return batches;
};
import type { FixedRangeConfig } from "@/types/range";

export async function getFixedRangeConfig(): Promise<FixedRangeConfig> {
	return {
		rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
	};
}

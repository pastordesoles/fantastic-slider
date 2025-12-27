import type { RangeConfig } from "@/types/range";

export async function getRangeConfig(): Promise<RangeConfig> {
	return {
		min: 1,
		max: 100,
	};
}

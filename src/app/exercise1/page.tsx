"use client";

import { useEffect, useState } from "react";
import { Range } from "@/components/Range";
import { BackButton } from "@/components/shared";
import { getRangeConfig } from "@/services/rangeService";
import type { RangeConfig } from "@/types/range";
import styles from "./page.module.css";

const Exercise1Page = () => {
	const [config, setConfig] = useState<RangeConfig | null>(null);

	useEffect(() => {
		getRangeConfig().then(setConfig);
	}, []);

	if (!config) return null;

	return (
		<main className={styles.exercise}>
			<BackButton />
			<h1 className={styles.exercise__title}>Exercise 1</h1>
			<Range
				min={config.min}
				max={config.max}
				step={1}
				initialMinValue={config.min}
				initialMaxValue={config.max}
				label="Select Range"
			/>
		</main>
	);
};

export default Exercise1Page;

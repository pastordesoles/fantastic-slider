"use client";

import { useEffect, useState } from "react";

import { Range } from "@/components/Range";
import { BackButton } from "@/components/shared";
import { getFixedRangeConfig } from "@/services/fixedRangeService";
import type { FixedRangeConfig } from "@/types/range";

import styles from "./page.module.css";

const Exercise2Page = () => {
	const [config, setConfig] = useState<FixedRangeConfig | null>(null);

	useEffect(() => {
		getFixedRangeConfig().then(setConfig);
	}, []);

	if (!config) return null;

	return (
		<main className={styles.exercise}>
			<BackButton />
			<h1 className={styles.exercise__title}>Exercise 2</h1>
			<Range
				values={config.rangeValues}
				initialMinIndex={0}
				initialMaxIndex={config.rangeValues.length - 1}
				label="Select Price Range"
				currency="€"
			/>
		</main>
	);
};

export default Exercise2Page;

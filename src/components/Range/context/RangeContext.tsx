"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { RangeComponentProps } from "@/types/range";

import { useRange } from "../hooks/useRange";

type RangeContextValue = ReturnType<typeof useRange>;

const RangeContext = createContext<RangeContextValue | null>(null);

interface RangeProviderProps {
	children: ReactNode;
	config: RangeComponentProps;
}

const RangeProvider = ({ children, config }: RangeProviderProps) => {
	const range = useRange(config);

	return (
		<RangeContext.Provider value={range}>{children}</RangeContext.Provider>
	);
};

const useRangeContext = () => {
	const context = useContext(RangeContext);
	if (process.env.NODE_ENV !== "production" && !context) {
		throw new Error("useRangeContext must be used within a RangeProvider");
	}
	return context as RangeContextValue;
};

export { RangeProvider, useRangeContext };

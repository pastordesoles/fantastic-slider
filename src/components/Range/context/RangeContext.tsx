"use client";

import { createContext, type ReactNode, useContext } from "react";

import type {
	FixedRangeProps,
	RangeProps as NormalRangeProps,
} from "@/types/range";

import { useRange } from "../hooks/useRange";

type RangeProps = NormalRangeProps | FixedRangeProps;

type RangeContextValue = ReturnType<typeof useRange>;

const RangeContext = createContext<RangeContextValue | null>(null);

interface RangeProviderProps {
	children: ReactNode;
	config: RangeProps;
}

const RangeProvider = ({ children, config }: RangeProviderProps) => {
	const range = useRange(config);

	return (
		<RangeContext.Provider value={range}>{children}</RangeContext.Provider>
	);
};

const useRangeContext = () => {
	const context = useContext(RangeContext);
	if (!context) {
		throw new Error("useRangeContext must be used within a RangeProvider");
	}
	return context;
};

export { RangeProvider, useRangeContext };

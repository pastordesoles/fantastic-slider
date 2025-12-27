import { useRangeContext } from "../../context/RangeContext";

const useRangeTrack = () => {
	const context = useRangeContext();

	const isFixedMode = context.mode === "fixed";

	const trackClass = isFixedMode ? "fixed-range__track" : "range__track";

	const activeClass = isFixedMode
		? "fixed-range__track-active fixed-range__track-highlighted"
		: "range__track-active range__track-highlighted";

	const minPercentage = context.minPercentage;
	const maxPercentage = context.maxPercentage;
	const trackRef = context.trackRef;

	return {
		trackClass,
		activeClass,
		minPercentage,
		maxPercentage,
		trackRef,
	};
};

export { useRangeTrack };

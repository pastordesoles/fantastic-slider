import { useRangeContext } from "../../context/RangeContext";

const useRangeTrack = () => {
	const context = useRangeContext();

	const trackClass = "range__track";
	const activeClass = "range__track-active range__track-highlighted";

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

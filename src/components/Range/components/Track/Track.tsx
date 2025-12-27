import { forwardRef, type ReactNode } from "react";

import clsx from "clsx";

import styles from "./Track.module.css";
import { useRangeTrack } from "./useRangeTrack";

interface TrackProps {
	children: ReactNode;
}

const Track = forwardRef<HTMLDivElement, TrackProps>(({ children }, ref) => {
	const { trackClass, activeClass, minPercentage, maxPercentage, trackRef } =
		useRangeTrack();

	const finalRef = ref || trackRef;

	return (
		<div
			ref={finalRef}
			className={clsx(styles[trackClass])}
			data-testid="range-track"
		>
			<div
				className={clsx(activeClass.split(" ").map((cls) => styles[cls]))}
				data-testid="range-track-highlighted"
				style={{
					left: `${minPercentage}%`,
					width: `${maxPercentage - minPercentage}%`,
				}}
			/>
			{children}
		</div>
	);
});

Track.displayName = "Track";

export { Track };

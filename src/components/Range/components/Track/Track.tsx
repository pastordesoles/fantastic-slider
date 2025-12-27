import { forwardRef, type ReactNode } from "react";
import styles from "./Track.module.css";
import { useRangeTrack } from "./useRangeTrack";

interface TrackProps {
	children: ReactNode;
}

const Track = forwardRef<HTMLDivElement, TrackProps>(({ children }, ref) => {
	const { trackClass, activeClass, minPercentage, maxPercentage, trackRef } =
		useRangeTrack();

	const finalRef = ref || trackRef;

	const activeClassNames = activeClass
		.split(" ")
		.map((cls) => styles[cls])
		.join(" ");

	return (
		<div
			ref={finalRef}
			className={styles[trackClass]}
			data-testid="range-track"
		>
			<div
				className={activeClassNames}
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

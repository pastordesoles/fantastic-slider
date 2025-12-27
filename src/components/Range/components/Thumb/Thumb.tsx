import { forwardRef } from "react";

import clsx from "clsx";

import { Bullet } from "../Bullet/Bullet";
import styles from "./Thumb.module.css";
import { useRangeThumb } from "./useRangeThumb";

interface ThumbProps {
	type: "min" | "max";
	children?: React.ReactNode;
}

const Thumb = forwardRef<HTMLDivElement, ThumbProps>(
	({ type, children }, ref) => {
		const {
			value,
			position,
			isActive,
			isSeparated,
			showBullet,
			currency,
			handleInteractionStart,
			handleKeyDown,
			setShowBullet,
			ariaValueMin,
			ariaValueMax,
			ariaValueNow,
			ariaValueText,
			ariaLabelledBy,
			baseClass,
			activeClass,
			separatedClass,
		} = useRangeThumb({
			type,
			thumbRef: ref as React.RefObject<HTMLDivElement>,
		});

		return (
			<div
				ref={ref}
				role="slider"
				aria-labelledby={ariaLabelledBy}
				aria-valuemin={ariaValueMin}
				aria-valuemax={ariaValueMax}
				aria-valuenow={ariaValueNow}
				aria-valuetext={ariaValueText}
				tabIndex={0}
				className={clsx(
					styles[baseClass],
					isActive && styles[activeClass],
					isActive && "active",
					isSeparated && styles[separatedClass],
				)}
				data-position={position}
				onMouseDown={handleInteractionStart}
				onTouchStart={handleInteractionStart}
				onFocus={handleInteractionStart}
				onKeyDown={handleKeyDown}
				onMouseEnter={() => setShowBullet(true)}
				onMouseLeave={() => setShowBullet(false)}
			>
				{children || (
					<Bullet value={value} currency={currency} visible={showBullet} />
				)}
			</div>
		);
	},
);

Thumb.displayName = "Thumb";

export { Thumb };

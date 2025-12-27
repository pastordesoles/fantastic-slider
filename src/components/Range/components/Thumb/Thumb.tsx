import { forwardRef } from "react";
import { Bullet } from "../Bullet";
import styles from "./Thumb.module.css";
import { useRangeThumb } from "./useRangeThumb";

interface ThumbProps {
	type: "min" | "max";
	children?: React.ReactNode;
}

export const Thumb = forwardRef<HTMLDivElement, ThumbProps>(
	({ type, children }, ref) => {
		const {
			value,
			position,
			label,
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

		const classNames = [
			styles[baseClass],
			isActive && styles[activeClass],
			isActive && "active",
			isSeparated && styles[separatedClass],
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div
				ref={ref}
				role="slider"
				aria-label={label}
				aria-labelledby={ariaLabelledBy}
				aria-valuemin={ariaValueMin}
				aria-valuemax={ariaValueMax}
				aria-valuenow={ariaValueNow}
				aria-valuetext={ariaValueText}
				tabIndex={0}
				className={classNames}
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

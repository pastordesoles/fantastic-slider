import clsx from "clsx";

import styles from "./Label.module.css";
import { useLabel } from "./useLabel";

interface LabelProps {
	type: "min" | "max";
}

const Label = ({ type }: LabelProps) => {
	const {
		displayValue,
		label,
		isEditable,
		isEditing,
		tempValue,
		className,
		min,
		max,
		handleClick,
		handleChange,
		applyValue,
		handleKeyDown,
	} = useLabel({ type });

	const classNames = className.split(" ").map((cls) => styles[cls]);

	if (!isEditable) {
		return <div className={clsx(classNames)}>{displayValue}</div>;
	}

	if (isEditing) {
		return (
			<input
				type="number"
				className={styles["range__value-input"]}
				value={tempValue}
				onChange={handleChange}
				onBlur={applyValue}
				onKeyDown={handleKeyDown}
				min={min}
				max={max}
				aria-label={`Edit ${label.toLowerCase()}`}
			/>
		);
	}

	return (
		<button
			type="button"
			className={clsx(classNames)}
			onClick={handleClick}
			aria-label={`${label}: ${displayValue}. Click to edit.`}
		>
			{displayValue}
		</button>
	);
};

export { Label };

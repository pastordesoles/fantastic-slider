import styles from "./Label.module.css";
import { useRangeOutput } from "./useRangeOutput";

interface LabelProps {
	type: "min" | "max";
}

export function Label({ type }: LabelProps) {
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
	} = useRangeOutput({ type });

	if (!isEditable) {
		return <div className={styles[className]}>{displayValue}</div>;
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
			className={styles[className]}
			onClick={handleClick}
			aria-label={`${label}: ${displayValue}. Click to edit.`}
		>
			{displayValue}
		</button>
	);
}

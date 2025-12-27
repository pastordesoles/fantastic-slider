import { useState } from "react";
import styles from "./Label.module.css";

interface LabelProps {
	value: number;
	label: string;
	editable?: boolean;
	min?: number;
	max?: number;
	onValueChange?: (value: number) => void;
	currency?: string;
}

export function Label({
	value,
	label,
	editable = false,
	min,
	max,
	onValueChange,
	currency,
}: LabelProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [tempValue, setTempValue] = useState(String(value));

	if (!editable) {
		const displayValue = currency ? `${currency}${value.toFixed(2)}` : value;
		const className = currency
			? styles["fixed-range__value-label"]
			: styles["range__value-label"];

		return <div className={className}>{displayValue}</div>;
	}

	const handleClick = () => {
		setIsEditing(true);
		setTempValue(String(value));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempValue(e.target.value);
	};

	const applyValue = () => {
		const numValue = Number.parseInt(tempValue, 10);
		if (!Number.isNaN(numValue) && min !== undefined && max !== undefined) {
			const clampedValue = Math.max(min, Math.min(numValue, max));
			onValueChange?.(clampedValue);
			setTempValue(String(clampedValue));
		} else {
			setTempValue(String(value));
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			applyValue();
		} else if (e.key === "Escape") {
			setTempValue(String(value));
			setIsEditing(false);
		}
	};

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
			className={styles["range__value-label"]}
			onClick={handleClick}
			aria-label={`${label}: ${value}. Click to edit.`}
		>
			{value}
		</button>
	);
}

import { useState } from "react";

import { useRangeContext } from "../../context/RangeContext";

type LabelType = "min" | "max";

interface UseLabelProps {
	type: LabelType;
}

const useLabel = ({ type }: UseLabelProps) => {
	const context = useRangeContext();
	const [isEditing, setIsEditing] = useState(false);
	const [tempValue, setTempValue] = useState("");

	const isMin = type === "min";
	const isFixedMode = context.mode === "fixed";
	const isEditable = !isFixedMode;

	const value = isMin ? context.minValue : context.maxValue;
	const label = isMin ? "Minimum value" : "Maximum value";

	const onValueChange =
		context.mode === "normal"
			? isMin
				? context.updateMinValue
				: context.updateMaxValue
			: undefined;

	const minConstraint =
		context.mode === "normal"
			? isMin
				? context.min
				: context.minValue
			: undefined;

	const maxConstraint =
		context.mode === "normal"
			? isMin
				? context.maxValue
				: context.max
			: undefined;

	const currency =
		isFixedMode && context.mode === "fixed" ? context.currency : undefined;

	const displayValue = currency ? `${currency}${value.toFixed(2)}` : value;

	const className = currency
		? "range__value-label range__value-label--fixed"
		: "range__value-label";

	const handleClick = () => {
		if (!isEditable) return;
		setIsEditing(true);
		setTempValue(String(value));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempValue(e.target.value);
	};

	const applyValue = () => {
		const numValue = Number.parseInt(tempValue, 10);
		if (
			!Number.isNaN(numValue) &&
			minConstraint !== undefined &&
			maxConstraint !== undefined &&
			onValueChange
		) {
			const clampedValue = Math.max(
				minConstraint,
				Math.min(numValue, maxConstraint),
			);
			onValueChange(clampedValue);
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

	return {
		value,
		displayValue,
		label,
		isEditable,
		isEditing,
		tempValue,
		currency,
		className,
		min: minConstraint,
		max: maxConstraint,
		handleClick,
		handleChange,
		applyValue,
		handleKeyDown,
	};
};

export { useLabel };

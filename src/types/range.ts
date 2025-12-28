export interface RangeConfig {
	min: number;
	max: number;
}

export interface RangeValues {
	minValue: number;
	maxValue: number;
}

export interface RangeProps {
	min: number;
	max: number;
	step?: number;
	initialMinValue?: number;
	initialMaxValue?: number;
	onChange?: (values: RangeValues) => void;
	label?: string;
}

export interface FixedRangeConfig {
	rangeValues: number[];
}

export interface FixedRangeValues {
	minValue: number;
	maxValue: number;
	minIndex: number;
	maxIndex: number;
}

export interface FixedRangeProps {
	values: number[];
	initialMinIndex?: number;
	initialMaxIndex?: number;
	onChange?: (values: FixedRangeValues) => void;
	label?: string;
	currency?: string;
}

export type RangeComponentProps = RangeProps | FixedRangeProps;

export const isFixedRange = (
	props: RangeComponentProps,
): props is FixedRangeProps => {
	return "values" in props;
};

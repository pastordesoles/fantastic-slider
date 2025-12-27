import styles from "./Bullet.module.css";

interface BulletProps {
	value: number;
	currency?: string;
	visible: boolean;
}

export function Bullet({ value, currency, visible }: BulletProps) {
	if (!visible) return null;

	const displayValue = currency ? `${currency}${value.toFixed(2)}` : value;

	return <div className={styles.bullet}>{displayValue}</div>;
}

import Link from "next/link";

import styles from "./BackButton.module.css";

interface BackButtonProps {
	href?: string;
	label?: string;
}

export function BackButton({
	href = "/",
	label = "Back to home",
}: BackButtonProps) {
	return (
		<Link href={href} className={styles["back-button"]}>
			{label}
		</Link>
	);
}

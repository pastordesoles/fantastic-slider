import Link from "next/link";

import styles from "./page.module.css";

export default function Home() {
	return (
		<main className={styles.home}>
			<Link href="/exercise1" className={styles.home__button}>
				Exercise 1
			</Link>
			<Link href="/exercise2" className={styles.home__button}>
				Exercise 2
			</Link>
		</main>
	);
}

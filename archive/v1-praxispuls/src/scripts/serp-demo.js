// Drives the hero SERP demo's before -> beat -> after sequence. All visual
// change happens through the [data-state] attribute and CSS transitions in
// SerpDemo.astro; this script only updates text content and timing.

const FACHRICHTUNGEN = {
	zahnarzt: { label: "Zahnarzt", name: "Zahnärzte am Stadtgarten" },
	hautarzt: { label: "Hautarzt", name: "Hautarztpraxis Grünewald" },
	physio: { label: "Physiotherapie", name: "Physiotherapie Vitalpunkt" },
	kosmetik: { label: "Kosmetik", name: "Kosmetikstudio Rosenhof" },
};

const STADTTEILE = {
	ruettenscheid: "Rüttenscheid",
	innenstadt: "Innenstadt",
	sued: "Süd",
};

const BEFORE_CURRENT = "Seite 3 · Platz 27";
const AFTER = { rating: 4.8, reviews: 12, current: "Neu: Platz 3 · lokaler Top-3-Pack" };

function initSerpDemo(root) {
	const fachSelect = root.querySelector("[data-serp-fach]");
	const ortSelect = root.querySelector("[data-serp-ort]");
	const queryEl = root.querySelector("[data-serp-query]");
	const nameEl = root.querySelector("[data-serp-name]");
	const starsFg = root.querySelector("[data-serp-stars-fg]");
	const reviewsEl = root.querySelector("[data-serp-reviews]");
	const currentEl = root.querySelector("[data-serp-current-value]");

	if (!fachSelect || !ortSelect || !queryEl || !nameEl || !starsFg || !reviewsEl || !currentEl) return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	let timers = [];
	let countFrame = null;

	function clearPending() {
		for (const timer of timers) clearTimeout(timer);
		timers = [];
		if (countFrame) cancelAnimationFrame(countFrame);
	}

	function currentScenario() {
		const fach = FACHRICHTUNGEN[fachSelect.value] ?? FACHRICHTUNGEN.zahnarzt;
		const ortLabel = STADTTEILE[ortSelect.value] ?? STADTTEILE.ruettenscheid;
		return {
			query: `${fach.label.toLowerCase()} ${ortLabel.toLowerCase()}`,
			name: fach.name,
		};
	}

	function countReviewsUp(to, duration) {
		const start = performance.now();
		function step(now) {
			const progress = Math.min(1, (now - start) / duration);
			reviewsEl.textContent = `${Math.round(progress * to)} Bewertungen`;
			if (progress < 1) countFrame = requestAnimationFrame(step);
		}
		countFrame = requestAnimationFrame(step);
	}

	function play() {
		clearPending();
		const scenario = currentScenario();
		queryEl.textContent = scenario.query;
		nameEl.textContent = scenario.name;
		starsFg.style.transform = "scaleX(0)";
		reviewsEl.textContent = "0 Bewertungen";
		currentEl.textContent = BEFORE_CURRENT;
		root.setAttribute("data-state", "before");

		if (reduceMotion) {
			root.setAttribute("data-state", "after");
			starsFg.style.transform = `scaleX(${AFTER.rating / 5})`;
			reviewsEl.textContent = `${AFTER.reviews} Bewertungen`;
			currentEl.textContent = AFTER.current;
			return;
		}

		timers.push(setTimeout(() => root.setAttribute("data-state", "beat"), 700));
		timers.push(
			setTimeout(() => {
				root.setAttribute("data-state", "after");
				starsFg.style.transform = `scaleX(${AFTER.rating / 5})`;
				currentEl.textContent = AFTER.current;
				countReviewsUp(AFTER.reviews, 900);
			}, 1300),
		);
	}

	fachSelect.addEventListener("change", play);
	ortSelect.addEventListener("change", play);

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					play();
					observer.disconnect();
				}
			}
		},
		{ threshold: 0.4 },
	);
	observer.observe(root);
}

document.querySelectorAll("[data-serp]").forEach(initSerpDemo);

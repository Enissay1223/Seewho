// Draws the EKG spine as the page scrolls. Two modes, set via the
// data-ekg-line attribute PulseLine.astro puts on its <svg>:
//   "reveal" — draws in once when the line enters the viewport (dividers).
//   "scroll" — dash-offset tracks scroll position continuously (the tall
//              Behandlungsplan spine).
// Reduced motion: PulseLine's CSS defaults (--ekg-length: none) already
// render a solid static line, so this script simply never runs.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
	const revealPaths = [];
	const scrollPaths = [];

	for (const svg of document.querySelectorAll('[data-ekg-line="reveal"]')) {
		const path = svg.querySelector("path");
		if (path) revealPaths.push(path);
	}
	for (const svg of document.querySelectorAll('[data-ekg-line="scroll"]')) {
		const path = svg.querySelector("path");
		if (path) scrollPaths.push(path);
	}

	function measure(path) {
		const length = Math.ceil(path.getTotalLength());
		path.style.setProperty("--ekg-length", length);
		return length;
	}

	// --- Reveal: draw in once, on enter. ---
	const revealLengths = new Map();
	for (const path of revealPaths) {
		revealLengths.set(path, measure(path));
		path.style.setProperty("--ekg-offset", revealLengths.get(path));
	}

	const revealObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const path = entry.target.querySelector("path");
				if (!path) continue;
				const length = revealLengths.get(path) ?? measure(path);
				const start = performance.now();
				const duration = 1400;
				function step(now) {
					const t = Math.min(1, (now - start) / duration);
					const eased = 1 - Math.pow(1 - t, 3);
					path.style.setProperty("--ekg-offset", Math.round(length * (1 - eased)));
					if (t < 1) requestAnimationFrame(step);
				}
				requestAnimationFrame(step);
				revealObserver.unobserve(entry.target);
			}
		},
		{ threshold: 0.3 },
	);
	for (const path of revealPaths) revealObserver.observe(path.closest("svg"));

	// --- Scroll: dash-offset tracks scroll progress within each line's own height. ---
	const scrollLengths = new Map();
	const activeScrollSvgs = new Set();

	for (const path of scrollPaths) {
		scrollLengths.set(path, measure(path));
		path.style.setProperty("--ekg-offset", scrollLengths.get(path));
	}

	const scrollObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) activeScrollSvgs.add(entry.target);
				else activeScrollSvgs.delete(entry.target);
			}
		},
		{ threshold: 0, rootMargin: "10% 0px 10% 0px" },
	);
	for (const path of scrollPaths) scrollObserver.observe(path.closest("svg"));

	let ticking = false;
	function updateScrollLines() {
		ticking = false;
		const viewportH = window.innerHeight;
		for (const svg of activeScrollSvgs) {
			const path = svg.querySelector("path");
			if (!path) continue;
			const length = scrollLengths.get(path);
			const rect = svg.getBoundingClientRect();
			const progress = Math.min(1, Math.max(0, (viewportH * 0.85 - rect.top) / rect.height));
			path.style.setProperty("--ekg-offset", Math.round(length * (1 - progress)));
		}
	}
	function onScroll() {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(updateScrollLines);
		}
	}
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", () => {
		for (const path of [...revealPaths, ...scrollPaths]) measure(path);
		updateScrollLines();
	});
	updateScrollLines();

	// --- Step markers switch on once the scroll line has drawn past them. ---
	const markerObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-active");
					markerObserver.unobserve(entry.target);
				}
			}
		},
		{ rootMargin: "-35% 0px -35% 0px" },
	);
	for (const marker of document.querySelectorAll("[data-ekg-marker]")) markerObserver.observe(marker);
}

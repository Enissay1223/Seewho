// Scroll-reveal for [data-reveal] elements. The html.js class gates the
// hidden initial state (see global.css), so without JS nothing is ever hidden.

document.documentElement.classList.add("js");

const items = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
	);
	items.forEach((el) => observer.observe(el));
} else {
	items.forEach((el) => el.classList.add("is-visible"));
}

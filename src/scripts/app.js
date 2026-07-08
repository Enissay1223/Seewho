// Umkreis — all motion lives here. GSAP + ScrollTrigger for scroll scenes,
// Lenis for smooth scrolling. With prefers-reduced-motion nothing in this
// file runs: the page is fully readable static (no CSS-hidden states except
// under html.gsap, which is only set below).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
	document.documentElement.classList.add("gsap");
	gsap.registerPlugin(ScrollTrigger);

	// ---------- Smooth scroll ----------
	const lenis = new Lenis({ lerp: 0.11 });
	lenis.on("scroll", ScrollTrigger.update);
	gsap.ticker.add((time) => lenis.raf(time * 1000));
	gsap.ticker.lagSmoothing(0);
	// Exposed for debugging/tests (harmless in production).
	window.__lenis = lenis;

	// Anchor links scroll smoothly through Lenis.
	document.querySelectorAll('a[href^="#"]').forEach((a) => {
		a.addEventListener("click", (e) => {
			const id = a.getAttribute("href");
			if (id && id.length > 1 && document.querySelector(id)) {
				e.preventDefault();
				lenis.scrollTo(id);
			}
		});
	});

	// ---------- Hero intro ----------
	gsap
		.timeline({ defaults: { ease: "power3.out" } })
		.from("[data-hero-eyebrow]", { y: 22, opacity: 0, duration: 0.7 }, 0.1)
		.from("[data-hero-line]", { yPercent: 115, duration: 1.0, stagger: 0.13 }, 0.15)
		.from("[data-hero-sub]", { y: 26, opacity: 0, duration: 0.8 }, 0.65)
		.from("[data-hero-cta]", { y: 26, opacity: 0, duration: 0.8 }, 0.78)
		.from("[data-media-wall]", { opacity: 0, y: 26, scale: 0.97, duration: 1.3, ease: "power2.out" }, 0.4);

	// ---------- Statement: pinned, lines light up as you scroll ----------
	const statementLines = gsap.utils.toArray(".statement-line");
	if (statementLines.length) {
		const mmStatement = gsap.matchMedia();

		mmStatement.add("(max-width: 767px)", () => {
			const statementTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: "#these",
					start: "top top",
					end: "+=260%",
					pin: true,
					scrub: true,
					anticipatePin: 1,
				},
			});

			statementLines.forEach((line, index) => {
				statementTimeline
					.to(
						line,
						{
							opacity: 1,
							y: 0,
							filter: "blur(0px)",
							duration: 0.55,
							ease: "power2.out",
						},
						index,
					)
					.to(line, { opacity: 1, duration: 0.35 }, index + 0.55);

				if (index < statementLines.length - 1) {
					statementTimeline.to(
						line,
						{
							opacity: 0,
							y: -24,
							filter: "blur(8px)",
							duration: 0.35,
							ease: "power2.in",
						},
						index + 0.9,
					);
				}
			});

			return () => {
				statementTimeline.scrollTrigger?.kill();
				statementTimeline.kill();
			};
		});

		mmStatement.add("(min-width: 768px)", () => {
			const statementTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: "#these",
					start: "top top",
					end: "+=165%",
					pin: true,
					scrub: true,
					anticipatePin: 1,
				},
			});

			statementLines.forEach((line, index) => {
				statementTimeline
					.to(
						line,
						{
							opacity: 1,
							y: 0,
							filter: "blur(0px)",
							duration: 0.75,
							ease: "power2.out",
						},
						index * 0.72,
					)
					.to(line, { opacity: 1, duration: 0.35 }, index * 0.72 + 0.75);
			});

			return () => {
				statementTimeline.scrollTrigger?.kill();
				statementTimeline.kill();
			};
		});
	}

	// ---------- Leistungen: horizontal scroll scene (desktop only) ----------
	const mm = gsap.matchMedia();
	mm.add("(min-width: 768px)", () => {
		const wrap = document.querySelector("[data-hscroll]");
		const track = document.querySelector("[data-hscroll-track]");
		if (!wrap || !track) return;

		const distance = () => Math.max(1, track.scrollWidth - window.innerWidth);
		const tween = gsap.to(track, {
			x: () => -distance(),
			ease: "none",
			scrollTrigger: {
				trigger: wrap,
				start: "top top",
				end: () => `+=${distance()}`,
				pin: true,
				scrub: 1,
				anticipatePin: 1,
				invalidateOnRefresh: true,
			},
		});

		return () => {
			tween.scrollTrigger?.kill();
			tween.kill();
			gsap.set(track, { clearProps: "x" });
		};
	});

	// ---------- Generic reveals ----------
	ScrollTrigger.batch("[data-fade]", {
		start: "top 86%",
		once: true,
		onEnter: (batch) =>
			gsap.from(batch, {
				y: 44,
				opacity: 0,
				duration: 1,
				ease: "power3.out",
				stagger: 0.12,
				overwrite: true,
			}),
	});

	// ---------- Prozess: gold line grows alongside the steps ----------
	const prozessLine = document.querySelector("[data-prozess-line]");
	if (prozessLine) {
		gsap.fromTo(
			prozessLine,
			{ scaleY: 0 },
			{
				scaleY: 1,
				ease: "none",
				scrollTrigger: {
					trigger: "[data-prozess]",
					start: "top 70%",
					end: "bottom 65%",
					scrub: true,
				},
			},
		);
	}

	// ---------- Price count-up ----------
	gsap.utils.toArray("[data-count]").forEach((el) => {
		const end = parseFloat(el.dataset.count);
		if (Number.isNaN(end)) return;
		ScrollTrigger.create({
			trigger: el,
			start: "top 88%",
			once: true,
			onEnter: () => {
				const obj = { v: 0 };
				gsap.to(obj, {
					v: end,
					duration: 1.3,
					ease: "power2.out",
					onUpdate: () => {
						el.textContent = Math.round(obj.v).toLocaleString("de-DE");
					},
				});
			},
		});
	});

	// ---------- Mockup parallax ----------
	gsap.utils.toArray("[data-parallax]").forEach((el) => {
		gsap.to(el, {
			yPercent: -7,
			ease: "none",
			scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
		});
	});

	// ---------- Footer wordmark ----------
	const wordmark = document.querySelector("[data-wordmark]");
	if (wordmark) {
		gsap.from(wordmark, {
			yPercent: 35,
			opacity: 0,
			ease: "power2.out",
			scrollTrigger: { trigger: wordmark, start: "top 96%", end: "top 60%", scrub: true },
		});
	}

	// ---------- Mobile sticky CTA appears after the hero ----------
	const mobileCta = document.querySelector("[data-mobile-cta]");
	if (mobileCta) {
		ScrollTrigger.create({
			start: () => window.innerHeight * 0.9,
			endTrigger: "#kontakt",
			end: "top bottom",
			onToggle: (self) => mobileCta.classList.toggle("is-on", self.isActive),
		});
	}

	// Re-measure once webfonts have swapped in.
	if (document.fonts?.ready) {
		document.fonts.ready.then(() => ScrollTrigger.refresh());
	}
}

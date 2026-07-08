export function withBase(path = ""): string {
	const base = import.meta.env.BASE_URL.endsWith("/")
		? import.meta.env.BASE_URL
		: `${import.meta.env.BASE_URL}/`;
	const cleanPath = path.replace(/^\/+/, "");

	return cleanPath ? `${base}${cleanPath}` : base;
}

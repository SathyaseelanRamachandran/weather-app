export const init = async () => {
	const res = await fetch("/api/testing");
	const data = await res.json();

	console.log("data is: ", data.test);
};

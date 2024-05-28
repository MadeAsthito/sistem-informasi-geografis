document.addEventListener("DOMContentLoaded", async function () {
	// Menampilkan peta
	const mainMap = L.map("mainMap").setView([-8.65, 115.216667], 12);

	// Menambahkan layer peta
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
		maxZoom: 18,
	}).addTo(mainMap);
});

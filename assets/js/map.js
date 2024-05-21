document.addEventListener("DOMContentLoaded", async function () {
	// Menampilkan peta
	var mainMap = L.map("mainMap").setView(
		[-8.795279032677602, 115.17553347766035],
		12
	);

	// Menambahkan layer peta
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
		maxZoom: 18,
	}).addTo(mainMap);
});

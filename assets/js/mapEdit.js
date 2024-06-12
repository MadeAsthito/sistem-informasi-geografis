document.addEventListener("DOMContentLoaded", async function () {
	const token = localStorage.getItem("token");
	const api_main_url = localStorage.getItem("api_main_url");
	let res_url = api_main_url + "api/mregion";
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-type": "application/json",
	};
	const data_region = await axios.get(res_url, { headers }).then((response) => {
		return response.data;
	});

	console.log(data_region);

	function insertSelectOption(select_el, data, filterCondition) {
		// Clear existing options
		const name_atribute = select_el.id.slice(0, -2);

		const filteredData = filterCondition ? data.filter(filterCondition) : data;

		// Add options for each item in the array
		filteredData.forEach((item) => {
			const option = document.createElement("option");
			option.value = item.id;
			option.text = item[name_atribute]
				.toLowerCase()
				.replace(/(?:^|\s)\S/g, function (a) {
					return a.toUpperCase();
				});
			select_el.appendChild(option);
		});
	}

	// Populate Provinsi select
	const provinsiSelect = document.getElementById("provinsiId");
	insertSelectOption(provinsiSelect, data_region.provinsi);

	// Populate Provinsi select
	res_url = api_main_url + "api/mjenisjalan";
	const data_jenis_jalan = await axios
		.get(res_url, { headers })
		.then((response) => {
			return response.data;
		});
	const jenisjalanSelect = document.getElementById("jenisjalanId");
	insertSelectOption(jenisjalanSelect, data_jenis_jalan.eksisting);

	// Populate Provinsi select
	res_url = api_main_url + "api/meksisting";
	const data_eksisting = await axios
		.get(res_url, { headers })
		.then((response) => {
			return response.data;
		});
	const eksistingSelect = document.getElementById("eksistingId");
	insertSelectOption(eksistingSelect, data_eksisting.eksisting);

	// Populate Provinsi select
	res_url = api_main_url + "api/mkondisi";
	const data_kondisi = await axios
		.get(res_url, { headers })
		.then((response) => {
			return response.data;
		});
	const kondisiSelect = document.getElementById("kondisiId");
	insertSelectOption(kondisiSelect, data_kondisi.eksisting);

	const kabupatenSelect = document.getElementById("kabupatenId");
	const kecamatanSelect = document.getElementById("kecamatanId");
	const desaSelect = document.getElementById("desaId");

	// FUNGSI POPULASI DATA
	function populateEdit(data_ruas_jalan) {
		// SET DATA
		document.getElementById("kodeRuas").value = data_ruas_jalan.kode_ruas;
		document.getElementById("namaRuas").value = data_ruas_jalan.nama_ruas;
		document.getElementById("keterangan").value = data_ruas_jalan.keterangan;
		document.getElementById("lebar").value = data_ruas_jalan.lebar;

		let desa = data_region.desa.find((k) => k.id == data_ruas_jalan.desa_id);
		let kecamatan = data_region.kecamatan.find((k) => k.id == desa.kec_id);
		let kabupaten = data_region.kabupaten.find((k) => k.id == kecamatan.kab_id);
		let provinsi = data_region.provinsi.find((k) => k.id == kabupaten.prov_id);

		document.getElementById("provinsiId").value = provinsi.id;
		const selectedProvinsiId = provinsiSelect.value;
		insertSelectOption(
			kabupatenSelect,
			data_region.kabupaten,
			(item) => item.prov_id == selectedProvinsiId
		);
		document.getElementById("kabupatenId").value = kabupaten.id;
		const selectedKabupatenId = kabupatenSelect.value;
		insertSelectOption(
			kecamatanSelect,
			data_region.kecamatan,
			(item) => item.kab_id == selectedKabupatenId
		);
		document.getElementById("kecamatanId").value = kecamatan.id;
		const selectedKecamatanId = kecamatanSelect.value;
		insertSelectOption(
			desaSelect,
			data_region.desa,
			(item) => item.kec_id == selectedKecamatanId
		);

		document.getElementById("desaId").value = data_ruas_jalan.desa_id;

		document.getElementById("jenisjalanId").value =
			data_ruas_jalan.jenisjalan_id;
		document.getElementById("eksistingId").value = data_ruas_jalan.eksisting_id;
		document.getElementById("kondisiId").value = data_ruas_jalan.kondisi_id;
	}

	// FUNGSI POPULASI MAP
	function populateEditMap(data_paths) {
		polyline_paths = polyline.decode(data_paths);
		console.log(polyline_paths);

		polyline_paths.forEach(([lat, lng]) => {
			const marker = L.marker([lat, lng], { draggable: true }).addTo(mainMap);

			marker.on("dragend", function () {
				drawPolyline();
			});

			// Add click event to remove marker on Ctrl+Click
			marker.on("click", function (event) {
				if (event.originalEvent.ctrlKey) {
					mainMap.removeLayer(marker);
					markers = markers.filter((m) => m !== marker);
					drawPolyline();
				}
			});

			markers.push(marker);
			drawPolyline();
		});
	}

	// PROSES POPULASI
	const window_url = window.location.href;
	const query_params = window_url.split("?")[1];
	const edit_id = query_params.split("=")[1];

	res_url = api_main_url + "api/ruasjalan/" + edit_id;
	await axios.get(res_url, { headers }).then((response) => {
		populateEdit(response.data.ruasjalan);
		populateEditMap(response.data.ruasjalan.paths);

		console.log(markers);
		console.log(points);
	});
});

// Menampilkan peta
let mainMap = L.map("editMap").setView([-8.65, 115.216667], 12);

// Menambahkan layer peta
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution:
		'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
	maxZoom: 18,
}).addTo(mainMap);

// Initialize an array to store the points
var points = [];
var markers = [];
var polylineFunc = polyline;

// Function to draw the polyline
function drawPolyline() {
	// Remove the existing polyline, if any
	if (mainMap.hasLayer(polyline)) {
		mainMap.removeLayer(polyline);
	}
	// Create a new polyline and add it to the map
	points = markers.map((marker) => marker.getLatLng());
	polyline = L.polyline(points, { color: "red" }).addTo(mainMap);
}

// Event listener for map clicks
mainMap.on("click", function (e) {
	// Get the clicked location's coordinates
	const { lat, lng } = e.latlng;
	const marker = L.marker([lat, lng], { draggable: true }).addTo(mainMap);

	marker.on("dragend", function () {
		drawPolyline();
	});

	// Add click event to remove marker on Ctrl+Click
	marker.on("click", function (event) {
		if (event.originalEvent.ctrlKey) {
			mainMap.removeLayer(marker);
			markers = markers.filter((m) => m !== marker);
			drawPolyline();
		}
	});

	markers.push(marker);
	drawPolyline();
});

// Initialize a polyline layer
L.polyline(points, { color: "red" }).addTo(mainMap);

// Initialize a polyline layer
// let polyline = L.polyline(points, { color: 'red' }).addTo(mainMap);

function insertSelectOption(select_el, data, filterCondition) {
	// Clear existing options
	select_el.innerHTML = "";
	const name_atribute = select_el.id.slice(0, -2);
	const view_name_atribute = name_atribute
		.toLowerCase()
		.replace(/(?:^|\s)\S/g, function (a) {
			return a.toUpperCase();
		});
	// Add default option
	const defaultOption = document.createElement("option");
	defaultOption.text = "Pilih " + view_name_atribute + "...";
	defaultOption.selected = true;
	defaultOption.disabled = true;
	select_el.appendChild(defaultOption);

	const filteredData = filterCondition ? data.filter(filterCondition) : data;

	// Add options for each item in the array
	filteredData.forEach((item) => {
		const option = document.createElement("option");
		option.value = item.id;
		option.text = item[name_atribute]
			.toLowerCase()
			.replace(/(?:^|\s)\S/g, function (a) {
				return a.toUpperCase();
			});
		select_el.appendChild(option);
	});
}

// Populate Kabupaten select
const provinsiSelect = document.getElementById("provinsiId");
const kabupatenSelect = document.getElementById("kabupatenId");
const kecamatanSelect = document.getElementById("kecamatanId");
const desaSelect = document.getElementById("desaId");

function editData() {
	// CHECK IF THERE IS MARKER
	let data_points = points;
	if (data_points.length <= 1) {
		return Swal.fire({
			title: "Failed",
			text: "Missing Data! Please insert the polyline position by clicking it on the ma",
			icon: "error"
		});
	}

	// GET DATA
	const kodeRuas = document.getElementById("kodeRuas").value;
	const namaRuas = document.getElementById("namaRuas").value;
	const keterangan = document.getElementById("keterangan").value;
	const lebar = document.getElementById("lebar").value;

	const paths = polylineFunc.encode(
		points.map((point) => [point.lat, point.lng])
	);
	console.log(paths);

	const startPoint = points[0];
	const endPoint = points[points.length - 1];
	const panjang = mainMap.distance(startPoint, endPoint);

	const provinsiId = document.getElementById("provinsiId").value;
	const kabupatenId = document.getElementById("kabupatenId").value;
	const kecamatanId = document.getElementById("kecamatanId").value;
	const desaId = document.getElementById("desaId").value;

	const jenisjalanId = document.getElementById("jenisjalanId").value;
	const eksistingId = document.getElementById("eksistingId").value;
	const kondisiId = document.getElementById("kondisiId").value;

	// CHECK DATA FORM
	if (
		!kodeRuas ||
		!namaRuas ||
		!lebar ||
		!provinsiId ||
		!kabupatenId ||
		!kecamatanId ||
		!desaId ||
		!jenisjalanId ||
		!eksistingId ||
		!kondisiId
	) {
		return alert("Missing Data! Please insert all of the data on the form");
	}

	const token = localStorage.getItem("token");
	const api_main_url = localStorage.getItem("api_main_url");

	const window_url = window.location.href;
	const query_params = window_url.split("?")[1];
	const edit_id = query_params.split("=")[1];

	const res_url = api_main_url + "api/ruasjalan/" + edit_id;
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-type": "application/json",
	};
	axios
		.put(
			res_url,
			{
				paths: paths,
				desa_id: desaId,
				kode_ruas: kodeRuas,
				nama_ruas: namaRuas,
				panjang: panjang,
				lebar: lebar,
				desa_id: desaId,
				jenis: provinsiId,
				eksisting_id: eksistingId,
				kondisi_id: kondisiId,
				jenisjalan_id: jenisjalanId,
				keterangan: keterangan,
			},
			{ headers }
		)
		.then((response) => {
			// Handle successful call
			console.log(response.data); // Assuming the API returns a token

			// Redirect to another page (e.g., dashboard)
			window.location.href = "/index.html"; // Replace with your dashboard page URL
		})
		.catch((error) => {
			// Handle error
			console.error("Data failed edited:", error);
			alert("Data failed edited. Please check your data and credentials.");
		});
}

provinsiSelect.addEventListener("change", () => {
	const token = localStorage.getItem("token");
	const api_main_url = localStorage.getItem("api_main_url");
	const res_url = api_main_url + "api/mregion";
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-type": "application/json",
	};
	axios.get(res_url, { headers }).then((response) => {
		const data_region = response.data;
		const selectedProvinsiId = provinsiSelect.value;
		insertSelectOption(
			kabupatenSelect,
			data_region.kabupaten,
			(item) => item.prov_id == selectedProvinsiId
		);
	});
});

// Populate Kecamatan select
kabupatenSelect.addEventListener("change", () => {
	const token = localStorage.getItem("token");
	const api_main_url = localStorage.getItem("api_main_url");
	const res_url = api_main_url + "api/mregion";
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-type": "application/json",
	};
	axios.get(res_url, { headers }).then((response) => {
		const data_region = response.data;
		const selectedKabupatenId = kabupatenSelect.value;
		insertSelectOption(
			kecamatanSelect,
			data_region.kecamatan,
			(item) => item.kab_id == selectedKabupatenId
		);
	});
});

// Populate Desa select
kecamatanSelect.addEventListener("change", () => {
	const token = localStorage.getItem("token");
	const api_main_url = localStorage.getItem("api_main_url");
	const res_url = api_main_url + "api/mregion";
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-type": "application/json",
	};
	axios.get(res_url, { headers }).then((response) => {
		const data_region = response.data;
		const selectedKecamatanId = kecamatanSelect.value;
		insertSelectOption(
			desaSelect,
			data_region.desa,
			(item) => item.kec_id == selectedKecamatanId
		);
	});
});

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
			option.text = item[name_atribute];
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

	function clickZoom(e) {
		mainMap.setView(e.target.getLatLng(), 15);
	}

	function addPolyline(data_ruas) {
		const path = data_ruas.paths;
		let decodedPath = polyline.decode(path);
		let color = "#adb5bd";

		L.polyline(decodedPath, {
			color: color,
		})
			.addTo(mainMap)
			.on("click", clickZoom);
	}

	res_url = api_main_url + "api/ruasjalan";
	const data_ruas = await axios.get(res_url, { headers }).then((response) => {
		return response.data;
	});

	const ruas_jalan = data_ruas.ruasjalan;
	ruas_jalan.forEach((ruas) => {
		addPolyline(ruas);
	});
});

// Menampilkan peta
var mainMap = L.map("editMap").setView([-8.65, 115.216667], 12);

// Initialize an array to store the points
var points = [];
var plylineLayer = [];
var markers = [];
var polylineFunc = polyline;

// Menambahkan layer peta
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution:
		'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
	maxZoom: 18,
}).addTo(mainMap);

var drawnItems = new L.FeatureGroup();
mainMap.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
	position: "topright",
	draw: {
		polyline:  {
			shapeOptions: {
				color: 'blue' // Change this color to your desired color
			}
		},
		polygon: false,
		rectangle: false,
		circle: false,
		marker: false,
	},
	edit: {
		featureGroup: drawnItems
	}
});
mainMap.addControl(drawControl);

mainMap.on("draw:created", function (e) {
	if(points.length > 0) drawnItems.removeLayer(plylineLayer);

	var layer = e.layer;
	
	plylineLayer = layer;
	points = layer._latlngs;
	
	console.log(layer._latlngs);
	
	drawnItems.addLayer(layer);
});

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

function addData() {
	// CHECK IF THERE IS MARKER
	let data_points = points;
	if (data_points.length <= 1) {
		return Swal.fire({
			title: "Data tidak lengkap!",
			text: "Mohon masukkan polyline dengan mengklik icon polyline di peta pojok kanan atas.",
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
		return Swal.fire({
			title: "Missing Data!",
			text: "Mohon masukkan seluruh data di form.",
			icon: "error",
		});
	}

	const token = localStorage.getItem("token");
	const api_main_url = localStorage.getItem("api_main_url");
	const res_url = api_main_url + "api/ruasjalan";
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-type": "application/json",
	};
	axios
		.post(
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

			Swal.fire({
				title: "Sukses!",
				text: "Data berhasil di simpan.",
				icon: "success",
			}).then((result) => {
				// Redirect to another page (e.g., dashboard)
				window.location.href = "/index.html"; // Replace with your dashboard page URL
			});
		})
		.catch((error) => {
			// Handle error
			console.error("Data failed uploaded:", error);
			Swal.fire({
				title: "Gagal!",
				text: "Data gagal di simpan.",
				icon: "error",
			});
		});
}

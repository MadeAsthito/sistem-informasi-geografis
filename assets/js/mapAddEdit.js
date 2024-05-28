document.addEventListener("DOMContentLoaded", async function () {
	// Menampilkan peta
	const mainMap = L.map("mainMap").setView([-8.65, 115.216667], 12);

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

	// Menambahkan layer peta
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
		maxZoom: 18,
	}).addTo(mainMap);
});

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

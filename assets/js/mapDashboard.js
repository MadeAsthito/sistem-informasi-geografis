var mainMap;

document.addEventListener("DOMContentLoaded", async function () {
	// Menampilkan peta
	mainMap = L.map("mainMap").setView([-8.65, 115.216667], 12);

	// Menambahkan layer peta
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
		maxZoom: 18,
	}).addTo(mainMap);

	/*Legend specific*/
	var legend = L.control({ position: "bottomright" });

	legend.onAdd = function (mainMap) {
		var div = L.DomUtil.create("div", "legend");
		div.innerHTML += "<h4>Jenis Jalan</h4>";
		div.innerHTML += '<i style="background: blue"></i><span>Provinsi</span><br>';
		div.innerHTML += '<i style="background: purple"></i><span>Kabupaten</span><br>';
		div.innerHTML += '<i style="background: green"></i><span>Desa</span><br>';

		return div;
	};

	legend.addTo(mainMap);

	/*Legend specific*/
	var selectLegend = L.control({ position: "topright" });

	selectLegend.onAdd = function (mainMap) {
		var div = L.DomUtil.create("div", "selectLegend");

		div.innerHTML += '<div class="form-floating mb-3"><select class="form-select" id="legend_type" aria-label="Floating label select example" onchange="updateLegend()"><option value="jenis" selected>Jenis Jalan</option><option value="eksisting">Perkerasan Jalan</option><option value="kondisi">Kondisi Jalan</option></select><label for="legend_type">Legend</label></div>';

		return div;
	};

	selectLegend.addTo(mainMap);

	/*Legend specific*/
	var addDataLegend = L.control({ position: "bottomleft" });

	addDataLegend.onAdd = function (mainMap) {
		var div = L.DomUtil.create("div", "addDataLegend");

		div.innerHTML += '<a href="./add_data.html" class="btn btn-primary text-white">+ Tambah Data Jalan</a>';

		return div;
	};

	addDataLegend.addTo(mainMap);


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

	res_url = api_main_url + "api/mjenisjalan";
	const data_jenis_jalan = await axios.get(res_url, { headers }).then((response) => {
		return response.data;
	});

	res_url = api_main_url + "api/meksisting";
	const data_eksisting = await axios.get(res_url, { headers }).then((response) => {
		return response.data;
	});

	res_url = api_main_url + "api/mkondisi";
	const data_kondisi = await axios.get(res_url, { headers }).then((response) => {
		return response.data;
	});

	formatContentRuas = function (status, data_ruas, lat, lng) {
		let data_desa = data_region.desa.find((k) => k.id == data_ruas.desa_id);
		let _data_jenis_jalan = data_jenis_jalan.eksisting.find(
			(k) => k.id == data_ruas.jenisjalan_id
		);
		_data_jenis_jalan = _data_jenis_jalan.jenisjalan;

		let _data_eksisting = data_eksisting.eksisting.find(
			(k) => k.id == data_ruas.eksisting_id
		);
		_data_eksisting = _data_eksisting.eksisting;

		let _data_kondisi = data_kondisi.eksisting.find(
			(k) => k.id == data_ruas.kondisi_id
		);
		_data_kondisi = _data_kondisi.kondisi;

		return `
			<h6 class="m-0 text-center">
				<b>${data_ruas.kode_ruas} | ${data_ruas.nama_ruas}</b>
			</h6>
			<p class="text-center m-0"><b>${status}</b></p>
			<hr class="my-2" />
			<div class="container">
				<div class="row">
					<div class="col p-0">
						<p class="m-0">Desa</p>
					</div>
					<div class="col col-1 p-0">
						<p class="m-0">:</p>
					</div>
					<div class="col p-0">
						<p class="m-0">${data_desa.desa}</p>
					</div>
				</div>
				<div class="row">
					<div class="col p-0">
						<p class="m-0">Jenis</p>
					</div>
					<div class="col col-1 p-0">
						<p class="m-0">:</p>
					</div>
					<div class="col p-0">
						<p class="m-0">${_data_jenis_jalan}</p>
					</div>
				</div>
				<div class="row">
					<div class="col p-0">
						<p class="m-0">Perkerasan</p>
					</div>
					<div class="col col-1 p-0">
						<p class="m-0">:</p>
					</div>
					<div class="col p-0">
						<p class="m-0">${_data_eksisting}</p>
					</div>
				</div>
				<div class="row">
					<div class="col p-0">
						<p class="m-0">Kondisi</p>
					</div>
					<div class="col col-1 p-0">
						<p class="m-0">:</p>
					</div>
					<div class="col p-0">
						<p class="m-0">${_data_kondisi}</p>
					</div>
				</div>
				<div class="row">
					<div class="col p-0">
						<p class="m-0">Panjang</p>
					</div>
					<div class="col col-1 p-0">
						<p class="m-0">:</p>
					</div>
					<div class="col p-0">
						<p class="m-0"> ${(data_ruas.panjang / 1000).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km</p>
					</div>
				</div>
				<div class="row">
					<div class="col p-0">
						<p class="m-0">Lebar</p>
					</div>
					<div class="col col-1 p-0">
						<p class="m-0">:</p>
					</div>
					<div class="col p-0">
						<p class="m-0"> ${data_ruas.lebar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} m</p>
					</div>
				</div>
				<div class="row">
					<div class="col px-0 py-2">
						<a class="text-warning text-center" href="/edit_data.html?id=${data_ruas.id
			}">Edit Data</a>
					</div>
					<div class="col px-0 py-2">
						<a class="text-danger text-center" onclick="deleteData(${data_ruas.id
			})">Delete Data</a>
					</div>
				</div>
			</div>
		`;
	};

	function clickZoom(e) {
		mainMap.setView(e.target.getLatLng(), 15);
	}


	function addPolyline(data_ruas) {
		const path = data_ruas.paths;
		let decodedPath = polyline.decode(path);
		let startPoint = decodedPath[0];
		let endPoint = decodedPath[decodedPath.length - 1];
		let color = "green";
		if (data_ruas.jenisjalan_id == 1) color = "blue";
		if (data_ruas.jenisjalan_id == 2) color = "purple";

		// Custom icon
		var customIcon = L.divIcon({
			className: 'custom-marker-icon',
			html: `<span class="material-icons-sharp" style="font-size: 24px; line-height: 24px;text-align: center;color: ${color};">location_on</span>`,
			iconSize: [24, 24],
			iconAnchor: [12, 24] // Adjust anchor point to the middle of the bottom
		});

		L.polyline(decodedPath, {
			color: color,
		})
			.addTo(mainMap)
			.bindPopup(
				formatContentRuas("Jalan", data_ruas, startPoint[0], startPoint[1])
			)
			.on("click", clickZoom);
		L.marker([startPoint[0], startPoint[1]], {icon: customIcon })
			.addTo(mainMap)
			.bindPopup(
				formatContentRuas("Start", data_ruas, startPoint[0], startPoint[1])
			)
			.on("click", clickZoom);
		L.marker([endPoint[0], endPoint[1]], {icon: customIcon })
			.addTo(mainMap)
			.bindPopup(formatContentRuas("End", data_ruas, endPoint[0], endPoint[1]))
			.on("click", clickZoom);
	}

	function addDataRuas(idTable, data_ruas, iterasi) {
		const tableBody = document.getElementById(idTable);

		const path = data_ruas.paths;
		let decodedPath = polyline.decode(path);
		let startPoint = decodedPath[0];

		let row = tableBody.insertRow();

		// Insert data into the row cells
		let indexCell = row.insertCell();
		indexCell.textContent = iterasi;
		indexCell.style.textAlign = "center";

		let kodeRuasCell = row.insertCell();
		kodeRuasCell.textContent = data_ruas.kode_ruas;
		kodeRuasCell.style.textAlign = "left";

		let namaRuasCell = row.insertCell();
		namaRuasCell.textContent = data_ruas.nama_ruas;
		namaRuasCell.style.textAlign = "left";

		let data_desa = data_region.desa.find((k) => k.id == data_ruas.desa_id);
		let desaCell = row.insertCell();
		desaCell.textContent = data_desa.desa;
		desaCell.style.textAlign = "left";

		let _data_jenis_jalan = data_jenis_jalan.eksisting.find(
			(k) => k.id == data_ruas.jenisjalan_id
		);
		let jenisJalanCell = row.insertCell();
		jenisJalanCell.textContent = _data_jenis_jalan.jenisjalan;
		jenisJalanCell.style.textAlign = "left";

		let _data_eksisting = data_eksisting.eksisting.find(
			(k) => k.id == data_ruas.eksisting_id
		);
		let eksistingCell = row.insertCell();
		eksistingCell.textContent = _data_eksisting.eksisting;
		eksistingCell.style.textAlign = "left";

		let _data_kondisi = data_kondisi.eksisting.find(
			(k) => k.id == data_ruas.kondisi_id
		);
		let kondisiCell = row.insertCell();
		kondisiCell.textContent = _data_kondisi.kondisi;
		kondisiCell.style.textAlign = "left";

		let panjangCell = row.insertCell();
		panjangCell.textContent = (data_ruas.panjang / 1000).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " km";
		panjangCell.style.textAlign = "center";

		let lebarCell = row.insertCell();
		lebarCell.textContent = data_ruas.lebar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " m";
		lebarCell.style.textAlign = "center";

		// Update :
		let selectCell = row.insertCell();
		let selectButton = document.createElement("button");
		selectButton.innerHTML = '<span class="material-icons-sharp">search</span>';
		selectButton.classList.add(
			"btn",
			"btn-primary",
			"d-flex",
			"flex-column",
			"justify-content-center"
		);
		selectButton.onclick = function () {
			mainMap.setView([startPoint[0], startPoint[1]], 15);
			window.scrollTo(0, 0);
		};
		selectCell.appendChild(selectButton);

		let editCell = row.insertCell();
		let editButton = document.createElement("button");
		editButton.innerHTML = '<span class="material-icons-sharp">edit</span>';
		editButton.classList.add(
			"btn",
			"btn-secondary",
			"d-flex",
			"flex-column",
			"justify-content-center"
		);
		editButton.onclick = function () {
			window.location.href = "./edit_data.html?id=" + data_ruas.id;
		};
		editCell.appendChild(editButton);

		let deleteCell = row.insertCell();
		let deleteButton = document.createElement("button");
		deleteButton.innerHTML = '<span class="material-icons-sharp">delete</span>';
		deleteButton.classList.add(
			"btn",
			"btn-danger",
			"d-flex",
			"flex-column",
			"justify-content-center"
		);
		deleteButton.onclick = function () {
			deleteData(data_ruas.id);
		};
		deleteCell.appendChild(deleteButton);
	}

	res_url = api_main_url + "api/ruasjalan";
	const data_ruas = await axios.get(res_url, { headers }).then((response) => {
		return response.data;
	});

	const ruas_jalan = data_ruas.ruasjalan;
	let i = 1;

	ruas_jalan.forEach((ruas) => {
		addPolyline(ruas);
		addDataRuas("data-table", ruas, i);
		i++;
	});

	console.log(ruas_jalan)

	let tot_des = ruas_jalan.filter((k) => k.jenisjalan_id == 1).length;
	let tot_kab = ruas_jalan.filter((k) => k.jenisjalan_id == 2).length;
	let tot_prov = ruas_jalan.filter((k) => k.jenisjalan_id == 3).length;
	document.getElementById('tot_des').innerHTML = tot_des;
	document.getElementById('tot_kab').innerHTML = tot_kab;
	document.getElementById('tot_prov').innerHTML = tot_prov;

	let tot_baik = ruas_jalan.filter((k) => k.kondisi_id == 1).length;
	let tot_sedang = ruas_jalan.filter((k) => k.kondisi_id == 2).length;
	let tot_rusak = ruas_jalan.filter((k) => k.kondisi_id == 3).length;
	document.getElementById('tot_baik').innerHTML = tot_baik;
	document.getElementById('tot_sedang').innerHTML = tot_sedang;
	document.getElementById('tot_rusak').innerHTML = tot_rusak;

	new DataTable('#dashboard');
});


function deleteData(id) {
	var token = localStorage.getItem("token");

	Swal.fire({
		title: "Apakah anda yakin ingin menghapus data ini?",
		text: "Klik Iya jika anda yakin",
		showCancelButton: true,
		confirmButtonText: "Iya",
		cancelButtonText: `Tidak`
	}).then((result) => {
		if (result.isConfirmed) {
			const api_main_url = localStorage.getItem("api_main_url");
			const res_url = api_main_url + "api/ruasjalan/" + id;
			const headers = {
				Authorization: `Bearer ${token}`,
				"Content-type": "application/json",
			};
			axios
				.delete(res_url, {
					headers,
				})
				.then((response) => {
					Swal.fire({
						title: "Sukses!",
						text: "Data berhasil di simpan.",
						icon: "success"
					}).then((result) => {
						window.location.href = "/index.html";
					});
				})
				.catch((error) => {
					console.error("Data failed deleted:", error);
					Swal.fire({
						title: "Gagal!",
						text: "Data gagal di simpan.",
						icon: "error"
					});
				});

			console.log("deleting data for #" + id_restaurant);
		}
	});

}

// Function to get legend content based on type
function getLegendContent(type) {
	if (type === 'jenis') {
		return `
			<h4>Jenis Jalan</h4>
			<i style="background: blue"></i><span>Provinsi</span><br>
			<i style="background: purple"></i><span>Kabupaten</span><br>
			<i style="background: green"></i><span>Desa</span><br>
		`;
	} else if (type === 'kondisi') {
		return `
			<h4>Kondisi Jalan</h4>
			<i style="background: green"></i><span>Baik</span><br>
			<i style="background: orange"></i><span>Sedang</span><br>
			<i style="background: red"></i><span>Rusak</span><br>
		`;
	} else if (type === 'eksisting') {
		return `
			<h4>Perkerasan Jalan</h4>
			<i style="background: brown"></i><span>Tanah</span><br>
			<i style="background: maroon"></i><span>Tanah/Beton</span><br>
			<i style="background: gray"></i><span>Perkerasan</span><br>
			<i style="background: lightgray"></i><span>Koral</span><br>
			<i style="background: darkgray"></i><span>Lapen</span><br>
			<i style="background: beige"></i><span>Paving</span><br>
			<i style="background: black"></i><span>Hotmix</span><br>
			<i style="background: orange"></i><span>Beton</span><br>
			<i style="background: orangered"></i><span>Beton/Lapen</span><br>
		`;
	}
}

function clickZoom(e) {
	mainMap.setView(e.target.getLatLng(), 15);
}

// Function to update legend content
function updateLegendPolyline(data_ruas, legend_type) {
	const path = data_ruas.paths;
	let decodedPath = polyline.decode(path);
	let startPoint = decodedPath[0];
	let endPoint = decodedPath[decodedPath.length - 1];
	let color = "blue";
	if (legend_type == 'jenis') {
		if (data_ruas.jenisjalan_id == 1) color = "blue";
		if (data_ruas.jenisjalan_id == 2) color = "purple";
		if (data_ruas.jenisjalan_id == 3) color = "green";
	} else if (legend_type == 'kondisi') {
		if (data_ruas.kondisi_id == 1) color = "green";
		if (data_ruas.kondisi_id == 2) color = "orange";
		if (data_ruas.kondisi_id == 3) color = "red";
	} else if (legend_type == 'eksisting') {
		if (data_ruas.eksisting_id == 1) color = "brown";
		if (data_ruas.eksisting_id == 2) color = "maroon";
		if (data_ruas.eksisting_id == 3) color = "gray";
		if (data_ruas.eksisting_id == 4) color = "lightgray";
		if (data_ruas.eksisting_id == 5) color = "darkgray";
		if (data_ruas.eksisting_id == 6) color = "beige";
		if (data_ruas.eksisting_id == 7) color = "black";
		if (data_ruas.eksisting_id == 8) color = "orange";
		if (data_ruas.eksisting_id == 9) color = "orangered";
	}

	L.polyline(decodedPath, {
		color: color,
	})
		.addTo(mainMap)
		.bindPopup(
			formatContentRuas("Jalan", data_ruas, startPoint[0], startPoint[1])
		)
		.on("click", clickZoom);
	L.marker([startPoint[0], startPoint[1]])
		.addTo(mainMap)
		.bindPopup(
			formatContentRuas("Start", data_ruas, startPoint[0], startPoint[1])
		)
		.on("click", clickZoom);
	L.marker([endPoint[0], endPoint[1]])
		.addTo(mainMap)
		.bindPopup(formatContentRuas("End", data_ruas, endPoint[0], endPoint[1]))
		.on("click", clickZoom);
}

async function updateLegend() {

	const token = localStorage.getItem("token");
	const api_main_url = localStorage.getItem("api_main_url");
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-type": "application/json",
	};
	let res_url = api_main_url + "api/ruasjalan";
	const data_ruas = await axios.get(res_url, { headers }).then((response) => {
		return response.data;
	});

	var selectedValue = document.getElementById('legend_type').value;
	var legendContent = getLegendContent(selectedValue);
	document.querySelector('.legend').innerHTML = legendContent;

	data_ruas.ruasjalan.forEach((ruas) => {
		updateLegendPolyline(ruas, selectedValue);
	});
}

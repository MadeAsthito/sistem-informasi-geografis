document.addEventListener("DOMContentLoaded", async function () {
	// Menampilkan peta
	const mainMap = L.map("mainMap").setView([-8.65, 115.216667], 12);

	// Menambahkan layer peta
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
		maxZoom: 18,
	}).addTo(mainMap);

	formatContentRuas = function (status, data_ruas, lat, lng) {
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
						<p class="m-0">${data_ruas.desa_id}</p>
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
						<p class="m-0"> ${data_ruas.panjang.toFixed(2)} m</p>
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
						<p class="m-0"> ${data_ruas.lebar} m</p>
					</div>
				</div>
				<div class="row">
					<div class="col p-0">
						<p class="m-0">Lat</p>
					</div>
					<div class="col col-1 p-0">
						<p class="m-0">:</p>
					</div>
					<div class="col p-0">
						<p class="m-0"> ${lat}</p>
					</div>
				</div>
				<div class="row">
					<div class="col p-0">
						<p class="m-0">Lng</p>
					</div>
					<div class="col col-1 p-0">
						<p class="m-0">:</p>
					</div>
					<div class="col p-0">
						<p class="m-0"> ${lng}</p>
					</div>
				</div>
			</div>
		`;
	};

	function addPolyline(data_ruas) {
		const path = data_ruas.paths;
		let decodedPath = polyline.decode(path);
		let startPoint = decodedPath[0];
		let endPoint = decodedPath[decodedPath.length - 1];

		L.polyline(decodedPath, {
			color: "blue",
		}).addTo(mainMap);
		L.marker([startPoint[0], startPoint[1]])
			.addTo(mainMap)
			.bindPopup(formatContentRuas('Start', data_ruas, startPoint[0], startPoint[1]));
		L.marker([endPoint[0], endPoint[1]])
			.addTo(mainMap)
			.bindPopup(formatContentRuas('End', data_ruas, endPoint[0], endPoint[1]));
	}

	function addDataRuas(idTable, data_ruas, iterasi) {
		const tableBody = document.getElementById(idTable);

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

		let desaCell = row.insertCell();
		desaCell.textContent = data_ruas.desa_id;
		desaCell.style.textAlign = "left";

		let panjangCell = row.insertCell();
		panjangCell.textContent = data_ruas.panjang.toFixed(2) + " m";
		panjangCell.style.textAlign = "center";

		let lebarCell = row.insertCell();
		lebarCell.textContent = data_ruas.lebar + " m";
		lebarCell.style.textAlign = "center";

		// Update :
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

	const token = localStorage.getItem("token");
	const api_main_url = localStorage.getItem("api_main_url");
	const res_url = api_main_url + "api/ruasjalan";
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-type": "application/json",
	};
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
});

function deleteData(id) {
	var token = localStorage.getItem("token");

	var confirmed = confirm(
		"Are you sure wanted to delete this data? Click OK if you wanted to proceed"
	);
	if (confirmed) {
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
				alert("Data successfully deleted");
				window.location.href = "/index.html";
			})
			.catch((error) => {
				console.error("Data failed deleted:", error);
				alert("Data failed deleted. Please check your data and credentials.");
			});

		console.log("deleting data for #" + id_restaurant);
	}
}
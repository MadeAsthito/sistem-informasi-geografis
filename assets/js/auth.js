document.addEventListener("DOMContentLoaded", function () {
	// CHECK IF NOT IN LOGIN / REGISTER PAGE
	var noAuth = ["/login.html", "/register.html", "/login", "/register"];
	console.log("Checking Auth.....");
	if (!noAuth.includes(window.location.pathname)) {
		// CHECK TOKEN
		console.log("On Application");
		const token = localStorage.getItem("token");
		if (!token) {
			window.location.href = "/login.html";
		} else {
			// GET USER
			let userName = localStorage.getItem("username");
			const el_name = document.getElementById("username");
			let api_main_url = localStorage.getItem("api_main_url");
			let res_url = api_main_url + "api/user";
			let headers = {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			};
			console.log("GET USER");
			axios
				.get(res_url, { headers })
				.then((response) => {
					let dataResponse = response.data.data;
					console.log(dataResponse);
					let userName = dataResponse.user.name;

					localStorage.setItem("username", userName);
					el_name.innerHTML = userName;
				})
				.catch((error) => {
					// Handle error
					let errorResponse = error.response.data;
					console.error("Get Data User Failed:", errorResponse);
					if (errorResponse.code == "403") window.location.href = "/login.html";
					Swal.fire({
						title: "Gagal!",
						text: "Gagal mengambil data user.",
						icon: "error",
					});
				});
		}
	}
});

function login() {
	console.log("login start");

	// GET DATA LOGIN
	let el_warning = document.getElementById("warningSign");

	let el_email = document.getElementById("email");
	let email = el_email.value;

	let el_password = document.getElementById("password");
	let password = el_password.value;

	// POST DATA LOGIN
	let api_main_url = "https://gisapis.manpits.xyz/";
	let res_url = api_main_url + "api/login";
	axios
		.post(res_url, {
			email: email,
			password: password,
		})
		.then((response) => {
			console.log(response.data);
			let res_data = response.data.meta;
			console.log(res_data);
			localStorage.setItem("token", res_data.token);
			localStorage.setItem("email_user", email);
			localStorage.setItem("api_main_url", api_main_url);

			window.location.href = "/index.html";
		})
		.catch((error) => {
			console.error("Login failed:", error);
			el_email.classList.add("is-invalid");
			el_password.classList.add("is-invalid");
			el_warning.classList.remove("d-none");
		});
}

function register() {
	console.log("register start");

	// GET DATA REGISTER
	let el_warning = document.getElementById("warningSign");

	let el_name = document.getElementById("fullname");
	let name = el_name.value;

	let el_email = document.getElementById("email");
	let email = el_email.value;

	let el_password = document.getElementById("password");
	let password = el_password.value;

	// POST DATA REGISTER
	let api_main_url = "https://gisapis.manpits.xyz/";
	let res_url = api_main_url + "api/register";
	axios
		.post(res_url, {
			name: name,
			email: email,
			password: password,
		})
		.then((response) => {
			console.log(response.data);
			let message = response.data.meta.message;

			if (message == "Successfully create user") {
				Swal.fire({
					title: "Sukses!",
					text: message,
					icon: "success",
				}).then((result) => {
					window.location.href = "/login.html";
				});
			} else {
				el_warning.innerHTML = message;
				el_name.classList.add("is-invalid");
				el_email.classList.add("is-invalid");
				el_password.classList.add("is-invalid");
				el_warning.classList.remove("d-none");
			}
		});
}

function logout() {
	let token = localStorage.getItem("token");

	Swal.fire({
		title: "Apakah anda yakin ingin sign out?",
		text: "Klik Iya jika anda yakin",
		showCancelButton: true,
		confirmButtonText: "Iya",
		cancelButtonText: `Tidak`,
	}).then((result) => {
		if (result.isConfirmed) {
			let api_main_url = localStorage.getItem("api_main_url");

			let res_url = api_main_url + "api/logout";

			let headers = {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
				"Content-Type": "application/json", // Specify the content type as JSON
			};
			axios
				.post(
					res_url,
					{},
					{
						headers,
					}
				)
				.then((response) => {
					// Populate the input field for input with id :
					// name
					// description
					// email
					// phoneNumber

					localStorage.removeItem("token");
					localStorage.removeItem("user");
					localStorage.removeItem("username");
					localStorage.removeItem("api_url");

					Swal.fire({
						title: "Sukses!",
						text: "Berhasil Sign Out!",
						icon: "success",
						timer: 2000,
					}).then((result) => {
						window.location.href = "/login.html";
					});
				})
				.catch((error) => {
					// Handle error
					console.error("Logging Out Failed:", error);

					Swal.fire({
						title: "Gagal!",
						text: "Gagal Sign Out!",
						icon: "error",
					});
				});

			console.log("Logging Out");
		}
	});
}

function goToDashboard() {
	window.location.href = "index.html";
}

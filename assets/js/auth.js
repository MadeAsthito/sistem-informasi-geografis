function login() {
	console.log("login start");

	// Retrieve username and password from the form
	var el_warning = document.getElementById("warningSign");

	var el_email = document.getElementById("email");
	var email = el_email.value;

	var el_password = document.getElementById("password");
	var password = el_password.value;

	var api_main_url = "https://gisapis.manpits.xyz/";
	var res_url = api_main_url + "api/login";

	console.log("email : " + email);
	console.log("password : " + password);
	console.log("res_url : " + res_url);

	axios
		.post(res_url, {
			email: email,
			password: password,
		})
		.then((response) => {
			console.log(response.data);
			var res_data = response.data.meta;
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

	var el_warning = document.getElementById("warningSign");

	var el_name = document.getElementById("fullname");
	var name = el_name.value;

	var el_email = document.getElementById("email");
	var email = el_email.value;

	var el_password = document.getElementById("password");
	var password = el_password.value;

	var api_main_url = "https://gisapis.manpits.xyz/";
	var res_url = api_main_url + "api/register";

	axios
		.post(res_url, {
			name: name,
			email: email,
			password: password,
		})
		.then((response) => {
			console.log(response.data);
			var message = response.data.meta.message;

			if (message == "Successfully create user") {
				window.location.href = "/login.html";
			} else {
				el_warning.innerHTML = message;
				el_name.classList.add("is-invalid");
				el_email.classList.add("is-invalid");
				el_password.classList.add("is-invalid");
				el_warning.classList.remove("d-none");
			}
		});
}

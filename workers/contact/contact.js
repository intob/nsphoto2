addEventListener("fetch", event => {
	event.respondWith(handle(event.request));
});

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

async function handle(request) {
	// handle CORS pre-flight request
	if (request.method === "OPTIONS") {
		return new Response(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, g-recaptcha",
				"Access-Control-Max-Age": 1728185
			},
		});
	}

	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Vary": "Origin"
	};

	
	if (request.method !== "POST") {
		return new Response(JSON.stringify({status: "error", statusCode: 405, message: "Method not allowed, use POST"}, {status: 500, headers}));
	}

	const recaptchaToken = request.headers.get("g-recaptcha");
	if (!recaptchaToken) {
		return new Response(JSON.stringify({status: "error", statusCode: 405, message: "reCaptcha header missing"}, {status: 500, headers}));
	}

	const recaptchaIsValid = await verifyRecaptcha(recaptchaToken);
	if (!recaptchaIsValid) {
		return new Response(JSON.stringify({status: "error", statusCode: 400, message: "Invalid reCaptcha"}, {status: 500, headers}));
	}

	const {firstName, lastName, email, phone, message} = await parseRequest(request);

	if (!firstName || !lastName || !email || !message) {
		return new Response(JSON.stringify({status: "error", statusCode: 400, message: "Please complete all required fields"}, {status: 500, headers}));
	}

	if (!emailRegex.test(email)) {
		return new Response(JSON.stringify({status: "error", statusCode: 400, message: "Please enter a valid email address"}, {status: 500, headers}));
	}

	const notification = buildNotification(firstName, lastName, email, phone, message);

	return Promise.all([sendTelegramMessage(notification), sendTelegramContact(firstName, lastName, email, phone)])
		.catch(error => {
			return new Response(JSON.stringify({status: "error", message: error}), {
				status: 500,
				headers,
			});
		})
		.then(() => {
			return new Response(JSON.stringify({status: "sucesss", message: "Sent"}), {
				status: 200,
				headers,
			});
		});
}

async function parseRequest(request) {
	const json = await request.json();
	return {
		firstName: json.firstName,
		lastName: json.lastName,
		email: json.email,
		phone: json.phone,
		message: json.message
	}
}

function buildNotification(firstName, lastName, email, phone, message) {
	return `${lastName}, ${firstName} // ${message} // ${email}, ${phone}`;
}

async function verifyRecaptcha(recaptchaToken) {
	const response = await fetch(
		"https://www.google.com/recaptcha/api/siteverify",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: `secret=${RECAPTCHA}&response=${recaptchaToken}`,
		}
	)
	const responseJson = await response.json()
	if (!responseJson.success) {
		return false;
	}
	return true;
}

function sendTelegramMessage(notification) {
	if (!TELEGRAM_CHATS || !TELEGRAM_BOT_TOKEN) {
		return Promise.reject("TELEGRAM_CHATS or TELEGRAM_BOT_TOKEN is missing");
	}
	const chats = TELEGRAM_CHATS.split(',');
	const promises = chats.map(chatId => {
		return fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(notification)}`);
	});
	return Promise.allSettled(promises);
}

function sendTelegramContact(firstName, lastName, email, phone) {
	if (!phone) {
		return Promise.resolve();
	}
	if (!TELEGRAM_CHATS || !TELEGRAM_BOT_TOKEN) {
		return Promise.reject("TELEGRAM_CHATS or TELEGRAM_BOT_TOKEN is missing");
	}
	const vcard = makeVCard(firstName, lastName, email, phone);
	const chats = TELEGRAM_CHATS.split(',');
	const promises = chats.map(chatId => {
		return fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendContact?chat_id=${chatId}&first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&phone_number=${encodeURIComponent(phone)}&vcard=${encodeURIComponent(vcard)}`);
	});
	return Promise.allSettled(promises);
}

function makeVCard(firstName, lastName, email, phone) {
	return `
		BEGIN:VCARD
		VERSION:4.0
		N:${lastName}, ${firstName}
		FN:${firstName} ${lastName}
		TEL;WORK;MSG:${phone}
		EMAIL;INTERNET:${email}
		END:VCARD
	`;
}
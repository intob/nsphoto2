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
  };

  try {
    if (request.method !== "POST") {
      throw {status: "error", statusCode: 405, message: "Method not allowed, use POST"};
    }

    const recaptchaToken = request.headers.get('g-recaptcha');
    if (!recaptchaToken) {
      throw {status: "error", statusCode: 405, message: "reCaptcha header missing"};
    }

    const recaptchaIsValid = await verifyRecaptcha(request);
    if (!recaptchaIsValid) {
      throw {status: "error", statusCode: 405, message: "Invalid reCaptcha"};
    }


    const {name, email, phone, message} = await parseFormRequest(request);

    if (!name || !email || !message) {
      throw {status: "error", statusCode: 400, message: "Please complete all required fields"};
    }

    if (!emailRegex.test(email)) {
      throw {status: "error", statusCode: 400, message: "Please enter a valid email address"};
    }

    const pushoverResponse = await (await sendPushoverNotification(firstName, lastName, email, phone, message)).json();

    if (pushoverResponse.status !== 1) {
      throw {status: "error", statusCode: 500, message: "Failed to send notification"};
    }

    return new Response(JSON.stringify({ status: "sucesss", message: "Sent" }), {
      status: 200,
      headers,
    });
  } catch (error) {
      return new Response(JSON.stringify(error), {
        status: error.statusCode,
        headers
      });
  }
}

async function parseFormRequest(request) {
  const json = await request.json();
  return {
    name: json.name,
    email: json.email,
    phone: json.phone,
    message: json.message
  }
}

async function sendPushoverNotification(name, email, phone, message) {
  const notificationText = `Enquiry from ${name}: ${message} ${email}, ${phone}`;
  return await fetch(
    "https://api.pushover.net/1/messages.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "cloudflare-worker-nsphoto-contact",
        accept: "application/json",
      },
      body: JSON.stringify({
        token: PUSHOVER_TOKEN,
        user: PUSHOVER_USER_KEY,
        message: notificationText
      })
    }
  );
}

async function verifyRecaptcha(recaptchaToken) {
  const recaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret: RECAPTCHA,
        response: recaptchaToken
      })
    }
  )
  const recaptchaBody = await recaptchaResponse.json()

  if (!recaptchaBody.success) {
    return false;
  }

  return true;
}
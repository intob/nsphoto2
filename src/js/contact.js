const workerUrl = "https://nsphoto-contact.dr-useless.workers.dev"

const contactFormSelector = "form.contact";

export default function initContactForm() {
    const contactForm = document.querySelector(contactFormSelector);

    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();
            grecaptcha.ready(() => {
                grecaptcha.execute('6Lfv0bUUAAAAAMGdj5GMUSsPWIL8IK4pKE50epBF', {action: 'submit'}).then(token => {
                    sendToWorker(token);
                });
              });
        });
    }
}

function sendToWorker(token) {
    const request = new XMLHttpRequest();
    request.open("POST", workerUrl);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("g-recaptcha", token)
    request.addEventListener("load", response => {
        console.log(response);
    });
    const body = JSON.stringify({
        message: 'name: Joey, email: joey@mail.com, message: helloooo!',
    })
    request.send(body);
}
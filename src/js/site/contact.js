import loadScript from './load-script';
import {ready} from './async';

const workerUrl = 'https://nsphoto-contact.dr-useless.workers.dev';
const recaptchaScriptUrl = 'https://www.google.com/recaptcha/api.js?render=6Lfv0bUUAAAAAMGdj5GMUSsPWIL8IK4pKE50epBF';

const contactFormSelector = 'form.contact';
const responseContainerSelector = 'form.contact .response';
const successMessageSelector = 'form.contact .success-message';
const submitButtonSelector = 'form.contact button';

loadScript(recaptchaScriptUrl)
  .then(() => ready())
  .then(() => initContactForm());


function initContactForm() {
  const contactForm = document.querySelector(contactFormSelector);
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      contactForm.querySelector('button').setAttribute('disabled', '');
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6Lfv0bUUAAAAAMGdj5GMUSsPWIL8IK4pKE50epBF', {action: 'submit'}).then(token => {
          sendToWorker(token);
        });
      });
    });
  }
}

function sendToWorker(token) {
  const request = new XMLHttpRequest();
  request.open('POST', workerUrl);
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('g-recaptcha', token);
  request.responseType = 'json';
  request.addEventListener('load', () => {
    document.querySelector(submitButtonSelector).removeAttribute('disabled');
    const responseContainer = document.querySelector(responseContainerSelector);
    if (request.status !== 200) {
      responseContainer.textContent = request.response.message;
      responseContainer.removeAttribute('hidden');
    } else {
      responseContainer.setAttribute('hidden', '');
      document.querySelector(successMessageSelector).removeAttribute('hidden');
      document.querySelector(contactFormSelector).reset();
    }

  });
  const body = JSON.stringify({
    name: document.querySelector('input[name=name]').value,
    email: document.querySelector('input[name=email]').value,
    phone: document.querySelector('input[name=phone]').value,
    message: document.querySelector('textarea[name=message]').value
  });
  request.send(body);
}

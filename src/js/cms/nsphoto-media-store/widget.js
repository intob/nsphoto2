import "./styles.css";
import ready from '../../ready';

export default class MediaStoreWidget {

  constructor({ handleInsert }) {
    this.handleInsert = handleInsert;

    ready().then(() => {
      const modalFragment = document.createRange().createContextualFragment(`
        <div class="nsphoto-media-store-modal" hidden="">
        <form method="POST" action="#">
          <div class="drop-container">
            Drop Here
          </div>
          <input type="file" name="file"/>
          <button type="submit">Upload</button>
        </form>
      `);
      document.body.appendChild(modalFragment);

      getModal().querySelector('form').addEventListener('submit', e => this.handleSubmit(e));
    });
  }

  handleShow() {
    getModal().removeAttribute("hidden");
  }

  handleHide() {
    getModal().setAttribute("hidden", "");
  }

  handleSubmit(e) {
    e.preventDefault();

    const fileInput = getModal().querySelector('input[name=file]');

    readFile(fileInput.files[0])
      .then(data => uploadData(data)
      .then(response => {
        console.log(response);
        // STORE KEY IN CONTENT
        console.log(this);
        this.handleInsert(response.url);
      }));

    this.handleHide();
  }
}

function getModal() {
  return document.querySelector('.nsphoto-media-store-modal');
}


function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      resolve(event.target.result);
    });
  reader.readAsArrayBuffer(file);
  });
}

function uploadData(data) {
  return fetch("https://nsphoto-media-store.dr-useless.workers.dev/", {
    method: "PUT",
    headers: {
      "authorization": getAuthToken(),
      "content-type": "image/jpeg" // GET CONTENT TYPE
    },
    body: data
  })
  .then(response => response.json());
}

function getAuthToken() {
  return `Bearer ${JSON.parse(localStorage.getItem("netlify-cms-user")).token}`;
}
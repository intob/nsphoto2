export default function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    let ready = false;
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.onerror = err => {
      reject(err, script);
    };
    script.onload = script.onreadystatechange = () => {
      if (!ready && (!this.readyState || this.readyState === 'complete')) {
        ready = true;
        resolve();
      }
    };
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentElement.insertBefore(script, firstScript);
  });
}

export function ready() {
	if (document.readyState !== 'loading') {
		return Promise.resolve();
	} else {
		return new Promise(resolve => {
			window.addEventListener('DOMContentLoaded', () => resolve());
		});
	}
}

export function load() {
	if (document.readyState === 'complete') {
		return Promise.resolve();
	} else {
		return new Promise(resolve => {
			window.addEventListener('load', () => resolve());
		});
	}
}

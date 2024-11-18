var scriptEl = document.createElement('script')
scriptEl.type = 'text/javascript'
scriptEl.src = chrome.runtime.getURL('js/fetch_script.js')
document.documentElement.appendChild(scriptEl);
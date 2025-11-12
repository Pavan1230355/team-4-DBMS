const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', msg => console.log('JSDOM LOG:', msg));
virtualConsole.on('error', msg => console.error('JSDOM ERROR:', msg));
virtualConsole.on('warn', msg => console.warn('JSDOM WARN:', msg));
virtualConsole.on('info', msg => console.info('JSDOM INFO:', msg));

console.log('Starting JSDOM load of index.html (will load external scripts from http://localhost:8000)');

const dom = new JSDOM(html, {
  url: 'http://localhost:8000/',
  resources: 'usable',
  runScripts: 'dangerously',
  virtualConsole,
  beforeParse(window) {
    // Pre-set a logged-in user so the page doesn't redirect to login during tests
    try {
      window.localStorage.setItem('current_user', JSON.stringify({ fullname: 'Test User' }));
    } catch (e) {
      // ignore
    }
  }
});

let loaded = false;

dom.window.addEventListener('load', () => {
  loaded = true;
  console.log('Window load fired');

  try {
    const type = typeof dom.window.showPage;
    console.log('typeof showPage ->', type);

    if (type === 'function') {
      console.log('Invoking showPage("search")');
      try {
        dom.window.showPage('search');
      } catch (err) {
        console.error('Error calling showPage:', err);
      }

      const active = Array.from(dom.window.document.querySelectorAll('.page')).find(p => p.classList.contains('active'));
      console.log('Active page id after showPage:', active ? active.id : 'none');
    } else {
      console.error('showPage is not available in window');
      // Try fetching and evaluating script.js manually to diagnose execution issues
      (async () => {
        try {
          console.log('Attempting to fetch and eval script.js from server');
          const res = await fetch('http://localhost:8000/script.js');
          const js = await res.text();
          dom.window.eval(js);
          console.log('Evaluated script.js in window context');
          console.log('typeof showPage after eval ->', typeof dom.window.showPage);
          const active = Array.from(dom.window.document.querySelectorAll('.page')).find(p => p.classList.contains('active'));
          console.log('Active page id after manual eval:', active ? active.id : 'none');
          // Simulate clicking the Search nav link
          const searchLink = dom.window.document.querySelector("a[onclick*='showPage(\'search\')']");
          if (searchLink) {
            console.log('Found search link, dispatching click');
            searchLink.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
            const activeAfterClick = Array.from(dom.window.document.querySelectorAll('.page')).find(p => p.classList.contains('active'));
            console.log('Active page after clicking Search:', activeAfterClick ? activeAfterClick.id : 'none');
          } else {
            console.log('Search link not found for click test');
          }
        } catch (err) {
          console.error('Error fetching/eval script.js:', err);
        }
      })();
    }
  } catch (err) {
    console.error('Unexpected error during checks:', err);
  }

  // Print any script errors captured on window
  setTimeout(() => {
    console.log('Test complete, exiting');
    process.exit(0);
  }, 200);
});

// Safety timeout
setTimeout(() => {
  if (!loaded) {
    console.error('Timeout: window.load did not fire within 6s');
    process.exit(2);
  }
}, 6000);

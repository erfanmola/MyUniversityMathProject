if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,a)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let c={};const r=e=>i(e,o),t={module:{uri:o},exports:c,require:r};s[o]=Promise.all(n.map((e=>t[e]||r(e)))).then((e=>(a(...e),c)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"2123cab4b75d60db37bbafdbc821ab38"},{url:"assets/icomoon-f2f2cdff.svg",revision:null},{url:"assets/icons/android-chrome-192x192.png",revision:"0a32aeb0a02d14e071ee5dc3b96fef40"},{url:"assets/icons/android-chrome-maskable-192x192.png",revision:"0a32aeb0a02d14e071ee5dc3b96fef40"},{url:"assets/icons/android-chrome-maskable-512x512.png",revision:"4504794b057c4909d95ce7529f5ac856"},{url:"assets/icons/apple-touch-icon-120x120.png",revision:"a3cdb1af644fe6e7ee06fe52e974baa3"},{url:"assets/icons/apple-touch-icon-152x152.png",revision:"b381610131c7b6066fc795fef445782e"},{url:"assets/icons/apple-touch-icon-180x180.png",revision:"b3e6a50ff3198ae1160376c0dee7951e"},{url:"assets/icons/apple-touch-icon-60x60.png",revision:"1e4cdd98c6a9ab9771d041f47a421337"},{url:"assets/icons/apple-touch-icon-76x76.png",revision:"0ce67b46803f5a27aa689ea3b7da936a"},{url:"assets/icons/apple-touch-icon.png",revision:"b3e6a50ff3198ae1160376c0dee7951e"},{url:"assets/icons/favicon-16x16.png",revision:"14c5430f562b14962e2f7a1e4e785258"},{url:"assets/icons/favicon-32x32.png",revision:"c646777f7ef4b790f6543924de5a1b7b"},{url:"assets/icons/favicon.ico",revision:"ee38c172ddd766ac4a240a3488279c5c"},{url:"assets/icons/msapplication-icon-144x144.png",revision:"3c2369e94811f96661ed76e0899796fb"},{url:"assets/icons/mstile-150x150.png",revision:"a8d43d82e9a890aaa1b23e33a420cc6d"},{url:"assets/icons/safari-pinned-tab.svg",revision:"4d1f1e0019b624b1eb2d134104b0672e"},{url:"assets/main-8abf30b1.js",revision:null},{url:"assets/main-e850bf96.css",revision:null},{url:"index.html",revision:"2123cab4b75d60db37bbafdbc821ab38"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"assets/icons/android-chrome-192x192.png",revision:"0a32aeb0a02d14e071ee5dc3b96fef40"},{url:"assets/icons/android-chrome-maskable-512x512.png",revision:"4504794b057c4909d95ce7529f5ac856"},{url:"manifest.webmanifest",revision:"7b18ac9e4cc639201af3565fc5a316c3"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
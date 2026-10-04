/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-b1bafff1'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "2e72f764cb519d8bf776a4f3cc34b617"
  }, {
    "url": "pwa-512x512.png",
    "revision": "e48f7878938c64a9e8776a7d9badf842"
  }, {
    "url": "pwa-192x192.png",
    "revision": "44b4830d672c16c80fc5704ac8e5a2ab"
  }, {
    "url": "index.html",
    "revision": "9d3bb658390c382a9071038f5f422169"
  }, {
    "url": "icon.svg",
    "revision": "d240a01d0b7c851c01399679a051dc34"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "0a0a7fb8a6071b2b1c45b5cf7261e9dd"
  }, {
    "url": "assets/index-Ay03YgHL.js",
    "revision": null
  }, {
    "url": "assets/index-3_nKqeQ3.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "0a0a7fb8a6071b2b1c45b5cf7261e9dd"
  }, {
    "url": "icon.svg",
    "revision": "d240a01d0b7c851c01399679a051dc34"
  }, {
    "url": "pwa-192x192.png",
    "revision": "44b4830d672c16c80fc5704ac8e5a2ab"
  }, {
    "url": "pwa-512x512.png",
    "revision": "e48f7878938c64a9e8776a7d9badf842"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "2e72f764cb519d8bf776a4f3cc34b617"
  }, {
    "url": "manifest.webmanifest",
    "revision": "7402af1b0e9e4fe77b0019e16e2b5b30"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/\.(?:png|jpg|jpeg|svg|gif|webp)$/i, new workbox.StaleWhileRevalidate({
    "cacheName": "images-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 2592000
    })]
  }), 'GET');

}));

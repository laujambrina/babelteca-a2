const CACHE='babelteca-a2-v2';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  // Only cache same-origin GET requests, never API calls
  var url = new URL(e.request.url);
  if(e.request.method!=='GET' || url.origin!==self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      if(res&&res.status===200){
        var rc=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,rc));
      }
      return res;
    }))
  );
});

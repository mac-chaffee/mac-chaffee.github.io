// I experimented with service workers, but they ended up
// being more trouble than they're worth for my use case.
// So this script cleans up any old service workers
self.addEventListener('install', function (e) {
    self.skipWaiting();
});

self.addEventListener('activate', function (e) {
    self.registration.unregister()
        .then(function () {
            return self.clients.matchAll();
        })
        .then(function (clients) {
            clients.forEach(client => client.navigate(client.url))
        });
});

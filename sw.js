console.log('Service Work Run!! : ', self);

// 오프라인 웹앱을 위한 기능 구현

var version = 'V2';
var CACHE_NAME = 'pwa-offline-v2'; // 캐싱 스토리지에 저장될 파일 이름
let newCacheList = ['pwa-offline-v2'];
var filesToCache = ['./', './css/app.css', './images/vue.png']; // 캐싱할 웹 리소스의 목록

console.log('Version : ', version);


// 오프라인 웹 리소스를 위한 캐시 생성 및 설치
self.addEventListener('install', event => {
  console.log('Service Worker Install');
  self.skipWaiting();
  // waitUntil 이벤트가 끝나기 전까진 종료되지 않음
  event.waitUntil(
    // 캐시 스토리지 오픈
    caches
      .open(CACHE_NAME) // PWA File
      .then(cache => {
        // PWA file에 모두 집어 넣어라
        return cache.addAll(filesToCache);
      })
      .catch(error => {
        console.log(error);
      }),
  );
});

// 브라우저에서 서버로 자원 요청할 때 사용
self.addEventListener('fetch', event => {
  console.log('Service Worker Fetch');

  // 이벤트 응답 결과
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(error => {
        console.log(error);
      }),
  );
});

// 웹 리소스 업데이트 시 사용
self.addEventListener('activate', event => {
  console.log('Service Worker Activate');

  // waitUntil 이벤트가 끝나기 전까진 종료되지 않음
  event.waitUntil(
    caches
      .keys()
      .then(cacheList => {
        // 새로운 서비스 워커에서 사용할 캐시 이외의 모든 캐시는 삭제
        return Promise.all(
          cacheList.map(cacheName => {
            if (newCacheList.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .catch(error => {
        console.log(error);
      }),
  );
});

// Functional: PUSH
self.addEventListener('push', event => {
  console.log('Push ' + event.data.text());

  const title = 'My PWA!';
  const options = {
    body: event.data.text()
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// PUSH Click Event
self.addEventListener('notificationclick', function (event) {
  console.log('Push clicked');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://localhost:5500')
  );
});
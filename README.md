# kariyeryonetimimcom
# Proje Kurulumu

* Frontend Ve Backend Klasörünü indiriyoruz. 
* Ardından her iki klasör'e de 
- .env adında 2 adet dosya açıyoruz.

### backend .env

```js
SERVER_PORT="3001"
JWT_SECRET="secretsecretsecret"
```

### frontend .env

```js
PUBLIC_API_URL=http://127.0.0.1:3001
```

- bunları klasörlere attıktan sonra backend klasörüne giriyoruz.

```
npm install
```
- yazıyoruz ardından paketlerimiz yükleniyor ve `npm run dev` diyerek backend aktif hale getirirlir.


- frontend klasörüne girdikten sonra backend deki aynı işlemleri yapıyoruz.
```
npm install && npm run dev
```

ardından default olarak [bu linkden](http://localhost:3000) siteye ulaşabilirsiniz.



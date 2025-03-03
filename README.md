# AngularFire
The official [Angular](https://angular.io/) library for [Firebase](https://firebase.google.com/).

<strong><pre>ng add @angular/fire</pre></strong>

AngularFire smooths over the rough edges an Angular developer might encounter when implementing the framework-agnostic [Firebase JS SDK](https://github.com/firebase/firebase-js-sdk) & aims to provide a more natural developer experience by conforming to Angular conventions.

- **Dependency injection** - Provide and Inject Firebase services in your components
- **Zone.js wrappers** - Stable zones allow proper functionality of service workers, forms, SSR, and pre-rendering
- **Observable based** - Utilize RxJS rather than callbacks for realtime streams
- **NgRx friendly API** - Integrate with NgRx using AngularFire's action based APIs.
- **Lazy-loading** - AngularFire dynamically imports much of Firebase, reducing time to load your app
- **Deploy schematics** - Get your Angular application deployed on Firebase Hosting with a single command
- **Google Analytics** - Zero-effort Angular Router awareness in Google Analytics
- **Router Guards** - Guard your Angular routes with built-in Firebase Authentication checks

## Example use

### Environment Config

Update the 'environment.ts' file with your firebase config information

Add the following to your 'app.modules.ts' file

```ts
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    provideFirebaseApp(() => initializeApp({ environment.firebase })),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  ...
})
export class AppModule { }
```

Try it out in the component

```ts
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Item {
  name: string,
  ...
};

@Component({
  selector: 'app-root',
  template: `
  <ul>
    <li *ngFor="let item of item$ | async">
      {{ item.name }}
    </li>
  </ul>
  `
})
export class AppComponent {
  item$: Observable<Item[]>;
  constructor(firestore: Firestore) {
    const items = collection(firestore, 'items');
    this.item$ = collectionData(items) as Observable<Item[]>;
  }
}
```

## Compatibility

### Angular and Firebase versions

AngularFire doesn't follow Angular's versioning as Firebase also has breaking changes throughout the year. Instead we try to maintain compatibility with both Firebase and Angular majors for as long as possible, only breaking when we need to support a new major of one or the other.

| Angular | Firebase | AngularFire  |
| --------|----------|--------------|
| 14      | 9        | ^7.4         |
| 13      | 9        | ^7.2         |
| 12      | 9        | ^7.0         |
| 12      | 7,8      | ^6.1.5       |
| 11      | 7,8      | ^6.1         |
| 10      | 8        | ^6.0.4       |
| 10      | 7        | ^6.0.3       |
| 9       | 8        | ^6.0.4       |
| 9       | 7        | ^6.0         |

<sub>Version combinations not documented here __may__ work but are untested and you will see NPM peer warnings.</sub>

### Polyfills

Neither AngularFire or Firebase ship with polyfills. To have compatability across as wide-range of environments we suggest the following polyfills be added to your application:

| API | Environments | Suggested Polyfill | License |
|-----|--------------|--------------------|---------|
| Various ES5+ features  | Safari &lt; 10 | [`core-js/stable`](https://github.com/zloirock/core-js#readme) | MIT |
| `globalThis` | [Chrome &lt; 71<br>Safari &lt; 12.1<br>iOS &lt; 12.2<br>Node &lt; 12](https://caniuse.com/mdn-javascript_builtins_globalthis) | [`globalThis`](https://github.com/es-shims/globalThis#readme) | MIT |
| `Proxy` | [Safari &lt; 10](https://caniuse.com/proxy) | [`proxy-polyfill`](https://github.com/GoogleChrome/proxy-polyfill#readme) | Apache 2.0 |
| `fetch` | [Safari &lt; 10.1<br>iOS &lt; 10.3](https://caniuse.com/fetch) | [`cross-fetch`](https://github.com/lquixada/cross-fetch#readme) | MIT |

## Resources

[Quickstart](docs/install-and-setup.md) - Get your first application up and running by following our quickstart guide.

[Contributing](CONTRIBUTING.md)

[Stackblitz Template](https://stackblitz.com/edit/angular-fire-start) - Remember to set your Firebase configuration in `app/app.module.ts`.

[Upgrading to v7.0? Check out our guide.](docs/version-7-upgrade.md)

### Sample apps

We have three sample apps in this repository:

1. [`samples/compat`](samples/compat) a kitchen sink application that demonstrates use of the "compatability" API
1. [`samples/modular`](samples/modular) a kitchen sink application that demonstrates the new tree-shakable API
1. [`samples/advanced`](samples/advanced) the same app as `samples/modular` but demonstrates more advanced concepts such as Angular Universal state-transfer, dynamically importing Firebase feature modules, and Firestore data bundling.

### Having troubles?

Get help on our [Q&A board](https://github.com/angular/angularfire/discussions?discussions_q=category%3AQ%26A), the official [Firebase Mailing List](https://groups.google.com/forum/#!forum/firebase-talk), the [Firebase Community Slack](https://firebase.community/) (`#angularfire2`), the [Angular Community Discord](http://discord.gg/angular) (`#firebase`), [Gitter](https://gitter.im/angular/angularfire2), the [Firebase subreddit](https://www.reddit.com/r/firebase), or [Stack Overflow](https://stackoverflow.com/questions/tagged/angularfire2).

> **NOTE:** AngularFire is maintained by Googlers but is not a supported Firebase product. Questions on the mailing list and issues filed here are answered on a <strong>best-effort basis</strong> by maintainers and other community members. If you are able to reproduce a problem with Firebase <em>outside of AngularFire's implementation</em>, please [file an issue on the Firebase JS SDK](https://github.com/firebase/firebase-js-sdk/issues) or reach out to the personalized [Firebase support channel](https://firebase.google.com/support/).

## Developer Guide

AngularFire has a new tree-shakable API, however this is still under active development and documentation is in the works, so we suggest most developers stick with the Compatiability API for the time being. [See the v7 upgrade guide for more information.](docs/version-7-upgrade.md). 

This developer guide assumes you're using the Compatiability API (`@angular/fire/compat/*`).

### Monitor usage of your application in production

> `AngularFireAnalytics` provides a convenient method of interacting with Google Analytics in your Angular application. The provided `ScreenTrackingService` and `UserTrackingService` automatically log events when you're using the Angular Router or Firebase Authentication respectively. [Learn more about Google Analytics](https://firebase.google.com/docs/analytics).

- [Getting started with Google Analytics](docs/analytics/getting-started.md)

### Interacting with your database(s)

Firebase offers two cloud-based, client-accessible database solutions that support realtime data syncing. [Learn about the differences between them in the Firebase Documentation](https://firebase.google.com/docs/firestore/rtdb-vs-firestore).

#### Cloud Firestore

> `AngularFirestore` allows you to work with Cloud Firestore, the new flagship database for mobile app development. It improves on the successes of Realtime Database with a new, more intuitive data model. Cloud Firestore also features richer, faster queries and scales better than Realtime Database.

- [Documents](docs/firestore/documents.md)
- [Collections](docs/firestore/collections.md)
- [Querying Collections](docs/firestore/querying-collections.md)
- [Offline data](docs/firestore/offline-data.md)

#### Realtime Database

> `AngularFireDatabase` allows you to work with the Realtime Database, Firebase's original database. It's an efficient, low-latency solution for mobile apps that require synced states across clients in realtime.

- [Objects](docs/rtdb/objects.md)
- [Lists](docs/rtdb/lists.md)
- [Querying lists](docs/rtdb/querying-lists.md)

### Authenticate users

- [Getting started with Firebase Authentication](docs/auth/getting-started.md)
- [Route users with AngularFire guards](docs/auth/router-guards.md)

### Local Emulator Suite

- [Getting started with Firebase Emulator Suite](docs/emulators/emulators.md)

### Upload files

- [Getting started with Cloud Storage](docs/storage/storage.md)

### Receive push notifications

- [Getting started with Firebase Messaging](docs/messaging/messaging.md)

### **BETA:** Change behavior and appearance of your application without deploying

> Firebase Remote Config is a cloud service that lets you change the behavior and appearance of your app without requiring users to download an app update. [Learn more about Remote Config](https://firebase.google.com/docs/remote-config).

- [Getting started with Remote Config](docs/remote-config/getting-started.md)

### Monitor your application performance in production

> Firebase Performance Monitoring is a service that helps you to gain insight into the performance characteristics of your iOS, Android, and web apps. [Learn more about Performance Monitoring](https://firebase.google.com/docs/perf-mon).

- [Getting started with Performance Monitoring](docs/performance/getting-started.md)

### Directly call Cloud Functions

- [Getting started with Callable Functions](docs/functions/functions.md)

### Deploying your application

> Firebase Hosting is production-grade web content hosting for developers. With Hosting, you can quickly and easily deploy web apps and static content to a global content delivery network (CDN) with a single command.

- [Deploy your application on Firebase Hosting](docs/deploy/getting-started.md)

#### Server-side rendering

> Angular Universal is a technology that allows you to run your Angular application on a server. This allows you to generate your HTML in a process called server-side rendering (SSR). AngularFire is compatible with server-side rendering; allowing you to take advantage of the Search Engine Optimization, link previews, the performance gains granted by the technology, and more. [Learn more about Angular Universal](https://angular.io/guide/universal).

- [Getting started with Angular Universal](docs/universal/getting-started.md)
- [Deploying your Universal application on Cloud Functions for Firebase](docs/universal/cloud-functions.md)
- [Prerendering your Universal application](docs/universal/prerendering.md)

### Ionic

- [Installation and Setup with Ionic CLI](docs/ionic/cli.md)
- [Using AngularFire with Ionic 2](docs/ionic/v2.md)
- [Using AngularFire with Ionic 3](docs/ionic/v3.md)

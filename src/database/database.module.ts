import { NgModule, Optional, NgZone, InjectionToken, ModuleWithProviders } from '@angular/core';
import { FirebaseDatabase, getDatabase } from 'firebase/database';

import { AuthInstances } from '@angular/fire/auth';
import { ɵgetDefaultInstanceOf, ɵmemoizeInstance, ɵAngularFireSchedulers } from '@angular/fire';
import { Database, DatabaseInstances, DATABASE_PROVIDER_NAME } from './database';
import { getApp } from 'firebase/app';
import { FirebaseApps } from '@angular/fire/app';

export const PROVIDED_DATABASE_INSTANCES = new InjectionToken<Database[]>('angularfire2.database-instances');

export function defaultDatabaseInstanceFactory(_: Database[]) {
  const defaultDatabase = ɵgetDefaultInstanceOf<FirebaseDatabase>(DATABASE_PROVIDER_NAME) || getDatabase(getApp());
  return new Database(defaultDatabase);
}

export function databaseInstanceFactory(fn: () => FirebaseDatabase) {
  return (zone: NgZone) => {
    const database = ɵmemoizeInstance<FirebaseDatabase>(fn, zone);
    return new Database(database);
  };
}

const DATABASE_INSTANCES_PROVIDER = {
  provide: DatabaseInstances,
  deps: [
    [new Optional(), PROVIDED_DATABASE_INSTANCES ],
  ]
};

const DEFAULT_DATABASE_INSTANCE_PROVIDER = {
  provide: Database,
  useFactory: defaultDatabaseInstanceFactory,
  deps: [
    NgZone,
    [new Optional(), PROVIDED_DATABASE_INSTANCES ],
  ]
};

@NgModule({
  providers: [
    DEFAULT_DATABASE_INSTANCE_PROVIDER,
    DATABASE_INSTANCES_PROVIDER,
  ]
})
export class DatabaseModule {
}

export function provideDatabase(fn: () => FirebaseDatabase): ModuleWithProviders<DatabaseModule> {
  return {
    ngModule: DatabaseModule,
    providers: [{
      provide: PROVIDED_DATABASE_INSTANCES,
      useFactory: databaseInstanceFactory(fn),
      multi: true,
      deps: [
        NgZone,
        ɵAngularFireSchedulers,
        FirebaseApps,
        // Database+Auth work better if Auth is loaded first
        [new Optional(), AuthInstances ],
      ]
    }]
  };
}

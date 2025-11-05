import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

const ctx = (import.meta as any).webpackContext('./', {
  recursive: true,
  regExp: /\.spec\.ts$/
});
for (const key of ctx.keys()) {
  ctx(key);
}

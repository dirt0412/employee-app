import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { EmployeeFiltersComponent } from './employee-filters.component';

describe('EmployeeFiltersComponent (Reactive)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFiltersComponent],
    }).compileComponents();
  });

  it('emits firstNameChange after debounce', fakeAsync(() => {
    const fixture = TestBed.createComponent(EmployeeFiltersComponent);
    const comp = fixture.componentInstance;

    comp.debounceMs = 200;
    fixture.detectChanges(); 

    let emitted = '';
    const sub = comp.firstNameChange.subscribe(v => (emitted = v));

    comp.form.controls.firstName.setValue('Ann');
    tick(199);
    expect(emitted).toBe('', 'should not emit before debounce');

    tick(1); // = 200ms
    expect(emitted).toBe('Ann');

    sub.unsubscribe();
    flush();
  }));

  it('emits lastNameChange after debounce', fakeAsync(() => {
    const fixture = TestBed.createComponent(EmployeeFiltersComponent);
    const comp = fixture.componentInstance;

    comp.debounceMs = 150;
    fixture.detectChanges();

    let emitted = '';
    const sub = comp.lastNameChange.subscribe(v => (emitted = v));

    comp.form.controls.lastName.setValue('Smith');
    tick(149);
    expect(emitted).toBe('', 'should not emit before debounce');

    tick(1); // = 150ms
    expect(emitted).toBe('Smith');

    sub.unsubscribe();
    flush();
  }));

  it('updates form when @Input values change (no events emitted)', () => {
    const fixture = TestBed.createComponent(EmployeeFiltersComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges(); 

    let firstEmitted = 'INIT';
    let lastEmitted = 'INIT';
    const s1 = comp.firstNameChange.subscribe(v => (firstEmitted = v));
    const s2 = comp.lastNameChange.subscribe(v => (lastEmitted = v));

    comp.firstName = 'Zoe';
    comp.lastName = 'Lee';
    comp.ngOnChanges({
      firstName: new SimpleChange('', 'Zoe', false),
      lastName: new SimpleChange('', 'Lee', false),
    });

    expect(comp.form.controls.firstName.value).toBe('Zoe');
    expect(comp.form.controls.lastName.value).toBe('Lee');

    expect(firstEmitted).toBe('INIT');
    expect(lastEmitted).toBe('INIT');

    s1.unsubscribe();
    s2.unsubscribe();
  });
});

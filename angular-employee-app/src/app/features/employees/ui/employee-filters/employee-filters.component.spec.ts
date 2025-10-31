import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmployeeFiltersComponent } from './employee-filters.component';

describe('EmployeeFiltersComponent (Reactive)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFiltersComponent]
    }).compileComponents();
  });

  it('emit firstNameChange after debounce', fakeAsync(() => {
    const fixture = TestBed.createComponent(EmployeeFiltersComponent);
    const comp = fixture.componentInstance;

    comp.debounceMs = 200; // test delay
    fixture.detectChanges();

    let emitted = '';
    comp.firstNameChange.subscribe(v => (emitted = v));

    comp.form.controls.firstName.setValue('Ann');
    tick(199);
    expect(emitted).toBe('', 'should not emit before debounce');

    tick(1); // 200ms
    expect(emitted).toBe('Ann');
  }));

  it('emit sortKeyChange without debounce', () => {
    const fixture = TestBed.createComponent(EmployeeFiltersComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    let emitted: any;
    comp.sortKeyChange.subscribe(v => (emitted = v));

    comp.form.controls.sortKey.setValue('lastName');
    expect(emitted).toBe('lastName');
  });

  it('updates form when sortKey input changes (no emit)', () => {
    const fixture = TestBed.createComponent(EmployeeFiltersComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    let emitted: any = undefined;
    comp.sortKeyChange.subscribe(v => (emitted = v));

    comp.sortKey = 'lastName' as any;
    comp.ngOnChanges({ sortKey: { previousValue: undefined, currentValue: 'lastName', firstChange: true, isFirstChange: () => true } as any });
    expect(comp.form.controls.sortKey.value).toBe('lastName' as any);
    expect(emitted).toBeUndefined();
  });

});
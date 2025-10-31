import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EmployeeTableComponent } from './employee-table.component';
import { Employee, Gender } from '../../models/employee.model';

describe('EmployeeTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmployeeTableComponent,
        RouterTestingModule
      ]
    }).compileComponents();
  });

  it('renders table rows based on input', () => {
    const fixture = TestBed.createComponent(EmployeeTableComponent);
    const comp = fixture.componentInstance;

    comp.employees = [
      { id: 1, registryNumber: '00000001', firstName: 'Anna', lastName: 'Kowalska', gender: Gender.Female },
      { id: 2, registryNumber: '00000002', firstName: 'Piotr', lastName: 'Nowak', gender: Gender.Male }
    ] as Employee[];

    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('emits sortKeyChange on first header click, then toggleSortDir on repeated click', () => {
    const fixture = TestBed.createComponent(EmployeeTableComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    let keyEmitted: any;
    let toggled = false;
    comp.sortKeyChange.subscribe(k => (keyEmitted = k));
    comp.toggleSortDir.subscribe(() => (toggled = true));

    comp.onHeaderClick('firstName' as any);
    expect(keyEmitted).toBe('firstName');

    comp.sortKey = 'firstName' as any;
    comp.onHeaderClick('firstName' as any);
    expect(toggled).toBeTrue();
  });

  it('sortedEmployees sorts by gender and direction', () => {
    const fixture = TestBed.createComponent(EmployeeTableComponent);
    const comp = fixture.componentInstance;

    comp.employees = [
      { id: 1, registryNumber: '00000001', firstName: 'Anna', lastName: 'K', gender: Gender.Female },
      { id: 2, registryNumber: '00000002', firstName: 'Bartek', lastName: 'K', gender: Gender.Male },
      { id: 3, registryNumber: '00000003', firstName: 'Cezary', lastName: 'K', gender: Gender.Other },
    ] as Employee[];

    comp.sortKey = 'gender' as any;
    comp.sortDir = 'asc';
    const asc = comp.sortedEmployees().map((e: Employee) => e.gender);

    comp.sortDir = 'desc';
    const desc = comp.sortedEmployees().map((e: Employee) => e.gender);

    expect(asc.join()).not.toEqual(desc.join());
  });

  it('getArrow returns ▲ for asc and ▼ for desc when column is active; empty otherwise', () => {
    const fixture = TestBed.createComponent(EmployeeTableComponent);
    const comp = fixture.componentInstance;

    comp.sortKey = 'firstName' as any;
    comp.sortDir = 'asc';
    expect(comp.getArrow('firstName' as any)).toBe('▲');
    expect(comp.getArrow('lastName' as any)).toBe('');

    comp.sortDir = 'desc';
    expect(comp.getArrow('firstName' as any)).toBe('▼');
  });

});
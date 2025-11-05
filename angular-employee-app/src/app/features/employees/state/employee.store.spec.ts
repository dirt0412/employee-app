import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { EmployeeStore, SortKey } from './employee.store';
import { EmployeeService } from '../data-access/employee.service';

class EmployeeServiceMock {

  employees$ = new BehaviorSubject<any[]>([]);
}

describe('EmployeeStore', () => {
  let store: EmployeeStore;
  let svc: EmployeeServiceMock;

  beforeEach(() => {
    svc = new EmployeeServiceMock();

    TestBed.configureTestingModule({
      providers: [
        EmployeeStore,
        { provide: EmployeeService, useValue: svc },
      ],
    });

    store = TestBed.inject(EmployeeStore);
  });

  it('starts with empty list', () => {
    expect(store.filteredEmployees()).toEqual([]);
  });

  it('filters by firstName and lastName', () => {

    svc.employees$.next([
      { firstName: 'Anna', lastName: 'Nowak', registryNumber: '100' },
      { firstName: 'Antek', lastName: 'Kowalski', registryNumber: '101' },
      { firstName: 'Bartek', lastName: 'Nowak', registryNumber: '102' },
    ]);

    expect(store.filteredEmployees().length).toBe(3);

    store.setFirstNameFilter('an');
    expect(store.filteredEmployees().map(e => e.firstName)).toEqual(['Anna', 'Antek']);

    store.setLastNameFilter('now'); 
    expect(store.filteredEmployees().map(e => e.lastName)).toEqual(['Nowak']);
  });

  it('sorts by key and direction', () => {
    svc.employees$.next([
      { firstName: 'C', lastName: 'Z', registryNumber: '102' },
      { firstName: 'A', lastName: 'X', registryNumber: '100' },
      { firstName: 'B', lastName: 'Y', registryNumber: '101' },
    ]);

    store.setSortKey('firstName' as SortKey);
    expect(store.filteredEmployees().map(e => e.firstName)).toEqual(['A', 'B', 'C']);

    store.toggleSortDir();
    expect(store.filteredEmployees().map(e => e.firstName)).toEqual(['C', 'B', 'A']);
  });
});

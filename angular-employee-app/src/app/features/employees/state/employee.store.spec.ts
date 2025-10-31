import { EmployeeStore } from './employee.store';
import { EmployeeService } from '../data-access/employee.service';
import { Gender } from '../models/employee.model';

describe('EmployeeStore (Signals)', () => {
  let service: EmployeeService;
  let store: EmployeeStore;

  beforeEach(() => {
    service = new EmployeeService();
    store = new EmployeeStore(service);
  });

  it('filter by name and surname', () => {
    service.add({ firstName: 'Zenon', lastName: 'Zieliński', gender: Gender.Male });

    store.setFirstNameFilter('Zen');
    store.setLastNameFilter('Ziel');

    const rows = store.filteredEmployees();
    expect(rows.length).toBe(1);
    expect(rows[0].firstName).toBe('Zenon');
  });

  it('toggles sort direction', () => {
    store.setSortKey('firstName');
    const before = store.filteredEmployees().map(e => e.firstName);
    store.toggleSortDir();
    const after = store.filteredEmployees().map(e => e.firstName);
    expect(after.join()).not.toEqual(before.join());
  });

  it('sorts by lastName ascending when setSortKey is used', () => {
    store.setSortKey('lastName');
    const names = store.filteredEmployees().map(e => e.lastName);
    const sorted = [...names].sort((a,b)=>(''+a).localeCompare(''+b));
    expect(names.join()).toBe(sorted.join());
  });

  it('keeps data when clearing sortKey', () => {
    store.setSortKey(undefined);
    const list = store.filteredEmployees();
    expect(Array.isArray(list)).toBeTrue();
    expect(list.length).toBeGreaterThan(0);
  });

});
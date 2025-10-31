import { Injectable, computed, signal } from '@angular/core';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../data-access/employee.service';

export type SortKey = keyof Pick<Employee, 'firstName' | 'lastName' | 'registryNumber'>;
export type SortDir = 'asc' | 'desc';

/** Store: state list (filters + sort), without access to router/HTML. */
@Injectable({ providedIn: 'root' })
export class EmployeeStore {
  private employeesSignal = signal<Employee[]>([]);

  firstNameFilter = signal<string>('');
  lastNameFilter = signal<string>('');
  sortKey = signal<SortKey | undefined>(undefined);
  sortDir = signal<SortDir>('asc');

  constructor(private employeeService: EmployeeService){
    this.employeeService.employees$.subscribe(list => this.employeesSignal.set(list));
  }

  employees = computed(() => this.employeesSignal());

  filteredEmployees = computed(() => {
    const nameF = this.firstNameFilter().toLowerCase();
    const lastF = this.lastNameFilter().toLowerCase();
    let list = this.employees().filter(e =>
      e.firstName.toLowerCase().includes(nameF) &&
      e.lastName.toLowerCase().includes(lastF)
    );
    const key = this.sortKey();
    if (key) {
      list = [...list].sort((a, b) => (''+a[key]).localeCompare(''+b[key]));
      if (this.sortDir() === 'desc') list.reverse();
    }
    return list;
  });

  setFirstNameFilter(v: string){ this.firstNameFilter.set(v ?? ''); }
  setLastNameFilter(v: string){ this.lastNameFilter.set(v ?? ''); }
  setSortKey(v: SortKey | undefined){ this.sortKey.set(v); }
  toggleSortDir(){ this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc'); }
}

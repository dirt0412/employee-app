import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EmployeeListPage } from './employee-list.page';
import { RouterTestingModule } from '@angular/router/testing';
import { EmployeeStore } from '@employees/state/employee.store';

class MockEmployeeStore {
  firstNameFilter() { return ''; }
  lastNameFilter()  { return ''; }

  sortKey() { return 'firstName'; }
  sortDir() { return 'asc'; }
  filteredEmployees() { return [{ id: 1, firstName: 'Jan', lastName: 'Kowalski' }]; }

  setFirstNameFilter(_: string) {}
  setLastNameFilter(_: string) {}
  setSortKey(_: string) {}
  toggleSortDir() {}
}

describe('EmployeeListPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeListPage, RouterTestingModule],
      providers: [{ provide: EmployeeStore, useClass: MockEmployeeStore }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should render the page', () => {
    const fixture = TestBed.createComponent(EmployeeListPage);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const addLink = compiled.querySelector('a.btn.btn-link');
    expect(addLink?.textContent?.trim()).toContain('Add employee');
  });
});

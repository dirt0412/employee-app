import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EmployeeStore, SortKey } from './employee.store';
import { Employee } from '@employees/models/employee.model';
import { EmployeeListPage } from '@employees/pages/employee-list/employee-list.page';


describe('EmployeeListPage', () => {
  beforeEach(async () => {

    const storeMock: Partial<EmployeeStore> = {
      firstNameFilter: () => '',
      lastNameFilter:  () => '',
      sortKey:         () => undefined as SortKey | undefined,
      sortDir:         () => 'asc',
      filteredEmployees: () => [] as Employee[],

      setFirstNameFilter: () => {},
      setLastNameFilter:  () => {},
      setSortKey:         () => {},
      toggleSortDir:      () => {},
    };

    await TestBed.configureTestingModule({
      imports: [EmployeeListPage, RouterTestingModule],
    })

      .overrideProvider(EmployeeStore, { useValue: storeMock })
      .compileComponents();
  });

  it('should render the page', () => {
    const fixture = TestBed.createComponent(EmployeeListPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

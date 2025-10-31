import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeFiltersComponent } from '@employees/ui/employee-filters/employee-filters.component';
import { EmployeeTableComponent } from '@employees/ui/employee-table/employee-table.component';
import { EmployeeStore } from '@employees/state/employee.store';


@Component({
  selector: 'app-employee-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, EmployeeFiltersComponent, EmployeeTableComponent],
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.css'],
})
export class EmployeeListPage {
  constructor(public store: EmployeeStore) {}
}

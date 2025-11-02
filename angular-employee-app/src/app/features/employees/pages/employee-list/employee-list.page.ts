import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeFiltersComponent } from '@employees/ui/employee-filters/employee-filters.component';
import { EmployeeTableComponent } from '@employees/ui/employee-table/employee-table.component';
import { EmployeeStore } from '@employees/state/employee.store';
import { EmployeeService } from '@employees/data-access/employee.service';


@Component({
  selector: 'app-employee-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, EmployeeFiltersComponent, EmployeeTableComponent],
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListPage {
  constructor(public store: EmployeeStore, private employeeService: EmployeeService) {}

  onDeleteRequested(id: number) {
    const ok = confirm('Are you sure you want to delete this employee?');
    if (ok) this.employeeService.delete(id);
  }
}

import { Routes } from '@angular/router';
import { EmployeeListPage } from './features/employees/pages/employee-list/employee-list.page';
import { EmployeeFormPage } from './features/employees/pages/employee-form/employee-form.page';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'employees' },
  { path: 'employees', component: EmployeeListPage, title: 'Employees' },
  { path: 'employees/new', component: EmployeeFormPage, title: 'Add employee' },
  { path: 'employees/:id/edit', component: EmployeeFormPage, title: 'Edit pracownika' },
  { path: '**', redirectTo: 'employees' }
];

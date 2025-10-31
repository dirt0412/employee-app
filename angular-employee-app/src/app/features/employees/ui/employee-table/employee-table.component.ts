import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Employee } from '../../models/employee.model';

type SortKey = 'firstName' | 'lastName' | 'registryNumber' | 'gender';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent {
  @Input() employees: Employee[] = [];

  @Input() sortKey?: SortKey;
  @Input() sortDir: 'asc' | 'desc' = 'asc';
  @Output() sortKeyChange = new EventEmitter<SortKey>();
  @Output() toggleSortDir = new EventEmitter<void>();

  onHeaderClick(key: SortKey): void {
    if (this.sortKey === key) {
      this.toggleSortDir.emit();
    } else {
      this.sortKeyChange.emit(key);
    }
  }

  getArrow(key: SortKey): string {
    if (this.sortKey !== key) return '';
    return this.sortDir === 'asc' ? '▲' : '▼';
  }

  // local sorting, 
  sortedEmployees(): Employee[] {
    if (!this.sortKey) return this.employees ?? [];
    const dir = this.sortDir === 'asc' ? 1 : -1;

    const arr = (this.employees ?? []).slice();
    arr.sort((a, b) => {
      const av = (a as any)[this.sortKey!];
      const bv = (b as any)[this.sortKey!];

      // numbers (registryNumber is a string with leading zeros)
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }

      // rest as string (firstName, lastName, gender, registryNumber)
      const as = (av ?? '').toString();
      const bs = (bv ?? '').toString();
      return as.localeCompare(bs) * dir;
    });

    return arr;
  }
}

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type SortKey = keyof Pick<Employee, 'firstName' | 'lastName' | 'registryNumber'>;

@Component({
  selector: 'app-employee-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-filters.component.html',
  styleUrls: ['./employee-filters.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFiltersComponent implements OnInit, OnChanges {
  /** current sort key (initially provided from the page) */
  @Input() sortKey?: SortKey;
  /** sort direction (displayed on the button; changed externally by the store) */
  @Input() sortDir: 'asc' | 'desc' = 'asc';
  /** delay for typed filters (ms) */
  @Input() debounceMs = 400;

  @Output() firstNameChange = new EventEmitter<string>();
  @Output() lastNameChange = new EventEmitter<string>();
  @Output() sortKeyChange = new EventEmitter<SortKey | undefined>();
  @Output() toggleSortDir = new EventEmitter<void>();

  form = this.fb.group({
    firstName: this.fb.control<string>(''),
    lastName: this.fb.control<string>(''),
    sortKey: this.fb.control<SortKey | undefined>(undefined)
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // first input with delay
    this.form.controls.firstName.valueChanges
      .pipe(debounceTime(this.debounceMs), distinctUntilChanged())
      .subscribe(v => this.firstNameChange.emit(v ?? ''));

    // second input with delay
    this.form.controls.lastName.valueChanges
      .pipe(debounceTime(this.debounceMs), distinctUntilChanged())
      .subscribe(v => this.lastNameChange.emit(v ?? ''));

    // change sortKey without debounce (this is a select)
    this.form.controls.sortKey.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(v => this.sortKeyChange.emit(v ?? undefined));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if sortKey is provided/changed externally (e.g. on page refresh), reflect it in the form
    if (changes['sortKey'] && !changes['sortKey'].firstChange) {
      this.form.patchValue({ sortKey: this.sortKey }, { emitEvent: false });
    } else if (changes['sortKey'] && changes['sortKey'].firstChange) {
      // initial setting of the select
      this.form.patchValue({ sortKey: this.sortKey }, { emitEvent: false });
    }
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-employee-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-filters.component.html',
  styleUrls: ['./employee-filters.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFiltersComponent implements OnInit, OnChanges {
  /** values coming from store (from outside) */
  @Input() firstName: string = '';
  @Input() lastName: string = '';

  @Input() debounceMs = 400;

  /** eventy from parent */
  @Output() firstNameChange = new EventEmitter<string>();
  @Output() lastNameChange = new EventEmitter<string>();

  form = this.fb.group({
    firstName: this.fb.control<string>(''),
    lastName: this.fb.control<string>(''),
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.syncFormFromInputs();

    this.form.controls.firstName.valueChanges
      .pipe(debounceTime(this.debounceMs), distinctUntilChanged())
      .subscribe((v) => this.firstNameChange.emit(v ?? ''));

    this.form.controls.lastName.valueChanges
      .pipe(debounceTime(this.debounceMs), distinctUntilChanged())
      .subscribe((v) => this.lastNameChange.emit(v ?? ''));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('firstName' in changes || 'lastName' in changes) {
      this.syncFormFromInputs();
    }
  }

  private syncFormFromInputs(): void {
    this.form.patchValue(
      {
        firstName: this.firstName ?? '',
        lastName: this.lastName ?? '',
      },
      { emitEvent: false } 
    );
  }
}

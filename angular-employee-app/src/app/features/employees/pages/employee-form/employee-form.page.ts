import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Gender } from '@employees/models/employee.model';
import { EmployeeService } from '@employees/data-access/employee.service';


@Component({
  selector: 'app-employee-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.page.html',
  styleUrls: ['./employee-form.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormPage {
  Gender = Gender;
  private idParam = signal<number | null>(null);

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    gender: [Gender.Male, [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ){
    const idStr = this.route.snapshot.paramMap.get('id');
    this.idParam.set(idStr ? Number(idStr) : null);

    if (this.isEdit()) {
      const emp = this.employeeService.getById(this.id()!);
      if (emp) {
        this.form.patchValue({
          firstName: emp.firstName,
          lastName: emp.lastName,
          gender: emp.gender
        });
      }
    }
  }

  id = computed(() => this.idParam());
  isEdit = () => this.id() !== null;

  registryPreview = computed(() => {
    if (!this.isEdit()) return '— will be awarded —';
    const e = this.employeeService.getById(this.id()!);
    return e?.registryNumber ?? '—';
  });

  onSave(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    if (this.isEdit()) {
      this.employeeService.update(this.id()!, {
        firstName: value.firstName!,
        lastName: value.lastName!,
        gender: value.gender!
      });
    } else {
      this.employeeService.add({
        firstName: value.firstName!,
        lastName: value.lastName!,
        gender: value.gender!
      });
    }
    this.router.navigate(['/employees']);
  }
}

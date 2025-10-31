import { TestBed } from '@angular/core/testing';
import { EmployeeFormPage } from './employee-form.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '@employees/data-access/employee.service';

class ActivatedRouteStub {
  snapshot = { paramMap: { get: (_: string) => null } };
}

describe('EmployeeFormPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFormPage, RouterTestingModule],
      providers: [
        EmployeeService,
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    }).compileComponents();
  });

  it('in the adding mode it shows a message and has an inactive save button when the form is empty', () => {
    const fixture = TestBed.createComponent(EmployeeFormPage);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.textContent).toContain('Adding new employee');

    const saveBtn = compiled.querySelector('button.btn') as HTMLButtonElement;
    expect(saveBtn).toBeTruthy();
    expect(saveBtn.disabled).toBeTrue();
  });

  it('in the edit mode it shows a message and pre-fills the form', () => {
    // Override ActivatedRoute to return id=1
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.paramMap.get = (_: string) => '1';

    const fixture = TestBed.createComponent(EmployeeFormPage);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.textContent).toContain('Edit employee — ID: 1');

    const firstName: HTMLInputElement = compiled.querySelector('input[formControlName="firstName"]')!;
    const lastName: HTMLInputElement = compiled.querySelector('input[formControlName="lastName"]')!;
    expect(firstName.value).toBeTruthy();
    expect(lastName.value).toBeTruthy();
  });


  it('saves in add mode and navigates to /employees when form is valid', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();

    const fixture = TestBed.createComponent(EmployeeFormPage);
    fixture.detectChanges();
    const comp = fixture.componentInstance;

    comp.form.setValue({ firstName: 'John', lastName: 'Doe', gender: 'Male' as any });
    fixture.detectChanges();

    comp.onSave();

    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });


  it('updates in edit mode and calls service.update, then navigates', () => {
    // mode edit
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.paramMap.get = (_: string) => '1';

    const service = TestBed.inject(EmployeeService);
    const updateSpy = spyOn(service, 'update').and.callThrough();

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();

    const fixture = TestBed.createComponent(EmployeeFormPage);
    fixture.detectChanges();
    const comp = fixture.componentInstance;

    // forms is fill from service; change something and save
    comp.form.patchValue({ firstName: 'Edited' });
    fixture.detectChanges();

    comp.onSave();

    expect(updateSpy).toHaveBeenCalled();
    const [idArg, payload] = updateSpy.calls.mostRecent().args;
    expect(typeof idArg).toBe('number');
    expect(payload.firstName).toBe('Edited');

    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });


});
import { EmployeeService } from './employee.service';
import { Gender } from '../models/employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    service = new EmployeeService();
  });

  it('generuje 8-znakowy numer ewidencyjny z wiodącymi zerami', () => {
    const e = service.add({ firstName: 'Test', lastName: 'User', gender: Gender.Other });
    expect(e.registryNumber.length).toBe(8);
    expect(e.registryNumber).toMatch(/^\d{8}$/);
  });

  it('aktualizuje pracownika', () => {
    const e = service.add({ firstName: 'A', lastName: 'B', gender: Gender.Female });
    const updated = service.update(e.id, { firstName: 'Zofia' });
    expect(updated?.firstName).toBe('Zofia');
  });

  it('assigns incrementing id and registryNumber', () => {
    const a = service.add({ firstName: 'A', lastName: 'A', gender: Gender.Other });
    expect(a.id).toBeGreaterThan(100);
    expect(a.registryNumber).toMatch(/^\d{8}$/);
  });

  it('getById returns undefined for missing id', () => {
    expect(service.getById(999999)).toBeUndefined();
  });

});
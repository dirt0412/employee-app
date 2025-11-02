import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee, Gender } from '../models/employee.model';

/**
 * Data-access: trzyma dane w pamięci i generuje registryNumber.
 * Brak logiki UI (filtry/sort) — to jest w store.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>(this.seedEmployees());
  employees$ = this.employeesSubject.asObservable();

  private idCounter = 100;

  getSnapshot(): Employee[] {
    return this.employeesSubject.getValue();
  }

  getById(id: number): Employee | undefined {
    return this.getSnapshot().find(e => e.id === id);
  }

  add(employee: Omit<Employee, 'id' | 'registryNumber'>): Employee {
    const id = ++this.idCounter;
    const registryNumber = this.generateRegistryNumber(id);
    const newEmployee: Employee = { id, registryNumber, ...employee };
    this.employeesSubject.next([...this.getSnapshot(), newEmployee]);
    return newEmployee;
  }

  update(id: number, patch: Partial<Omit<Employee, 'id' | 'registryNumber'>>): Employee | undefined {
    const list = this.getSnapshot();
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    const updated: Employee = { ...list[idx], ...patch };
    const next = [...list];
    next[idx] = updated;
    this.employeesSubject.next(next);
    return updated;
  }

  delete(id: number): boolean {
    const current = this.getSnapshot();
    const exists = current.some(e => e.id === id);

    if (!exists) return false;
    
    this.employeesSubject.next(current.filter(e => e.id !== id));
    return true;
  }

  /** Generuje numer ewidencyjny jako string 8-znakowy z wiodącymi zerami. */
  private generateRegistryNumber(seed: number): string {
    return seed.toString().padStart(8, '0');
  }

  /** mock data */
  private seedEmployees(): Employee[] {
    return [
      { id: 1, registryNumber: '00000001', firstName: 'Anna', lastName: 'Kowalska', gender: Gender.Female },
      { id: 2, registryNumber: '00000002', firstName: 'Piotr', lastName: 'Nowak', gender: Gender.Male },
      { id: 3, registryNumber: '00000003', firstName: 'Ola', lastName: 'Wiśniewska', gender: Gender.Female },
      { id: 4, registryNumber: '00000004', firstName: 'Jan', lastName: 'Krawczyk', gender: Gender.Male },
      { id: 5, registryNumber: '00000005', firstName: 'Sasza', lastName: 'Iwanow', gender: Gender.Other }
    ];
  }
}

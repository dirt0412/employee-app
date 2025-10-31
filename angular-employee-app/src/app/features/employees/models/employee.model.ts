export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface Employee {
  id: number;
  registryNumber: string; 
  firstName: string;      // 1..50
  lastName: string;       // 1..50
  gender: Gender;
}

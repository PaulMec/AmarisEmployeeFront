import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Observable } from 'rxjs';
import { Employee } from '../Models/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl: string = appsettings.apiUrl;

  constructor(private http: HttpClient) { }

  listEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}all`);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}${id}`);
  }
}

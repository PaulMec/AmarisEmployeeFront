import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from '../../Services/employee.service';
import { Employee } from '../../Models/Employee';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  employeeId: string = '';
  listEmployee: Employee[] = [];
  displayedColumns: string[] = ['id', 'employeeName', 'employeeAge', 'employeeEmail', 'employeeSalary', 'employeeSalaryAnnual', 'profileImage'];
  showError: boolean = false;
  errorMessage: string = '';

  constructor(private employeeService: EmployeeService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadAllEmployees();
  }

  loadAllEmployees() {
    this.employeeService.listEmployees().subscribe({
      next: (data) => {
        this.listEmployee = data.map(employee => ({
          ...employee,
          employeeSalaryAnnual: employee.employeeSalary * 12
        }));
      },
      error: (err) => console.error('Failed to load all employees:', err)
    });
  }

  searchEmployeeById() {
    const trimmedId = this.employeeId.trim();
    this.showError = false;

    if (!trimmedId) {
      this.loadAllEmployees();
      return;
    }

    const id = Number(trimmedId);
    if (isNaN(id)) {
      this.showError = true;
      this.errorMessage = 'Por favor, ingrese un número válido';
      this.showSnackbar(this.errorMessage);
      return;
    }

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        if (employee) {
          this.listEmployee = [employee];
        } else {
          this.listEmployee = [];
          this.showError = true;
          this.errorMessage = 'No se encontró un empleado con ese ID';
          this.showSnackbar(this.errorMessage);
        }
      },
      error: (err) => {
        console.error('Failed to load employee:', err);
        this.showError = true;
        this.errorMessage = 'Error al recuperar los datos del empleado';
        this.showSnackbar(this.errorMessage);
      }
    });
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}

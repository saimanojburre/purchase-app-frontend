import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (token: any) => {
        console.log('Token:', token);

        this.authService.saveToken(token);

        // alert('Login success');
        this.router.navigate(['/page1']);
      },
      error: () => {
        alert('Invalid credentials');
      },
    });
  }
}

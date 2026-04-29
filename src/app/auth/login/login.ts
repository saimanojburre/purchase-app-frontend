import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.isLoading) return; //prevent multi clicks

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (token: any) => {
        this.isLoading = false;
        this.authService.saveToken(token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        console.log('Invalid credentials');
      },
    });
  }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Purchase } from '../../services/purchase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page1',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './page1.html',
  styleUrls: ['./page1.css'],
})
export class Page1 implements OnInit {
  form!: FormGroup;
  dataList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: Purchase,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      productName: ['', Validators.required],
      quantity: [0, Validators.required],
      price: [0, Validators.required],
    });

    const savedForm = this.service.getFormData('page1');
    if (savedForm) {
      this.form.patchValue(savedForm);
    }

    this.service.getData$('page1').subscribe((data) => {
      this.dataList = data;
    });

    // listen to form changes
    this.form.valueChanges.subscribe((val) => {
      this.service.setFormData('page1', val);
    });
  }
  onSubmit() {
    if (this.form.invalid) return;

    this.service.create(this.form.value).subscribe({
      next: (res: any) => {
        // call API only once (first time or always if you want fresh)
        this.service.getAll().subscribe((data: any[]) => {
          const latest = data;

          this.dataList = [...latest];

          // store in cache
          this.service.setData('page1', latest);
          this.cd.detectChanges();
        });
      },
    });
  }
}

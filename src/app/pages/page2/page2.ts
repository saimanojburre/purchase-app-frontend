import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Purchase } from '../../services/purchase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page2',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './page2.html',
  styleUrl: './page2.css',
})
export class Page2 {
  form!: FormGroup;
  baseData: any[] = [];
  data: any[] = [];
  editRowId: number | null = null;
  deleteRowId: number | null = null;
  edititem: any = {};

  startDate!: string;
  endDate!: string;
  customerName!: string;
  errmsg = '';
  flag = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private service: Purchase,
    private cd: ChangeDetectorRef,
  ) {}
  ngOnInit() {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      customerName: ['', Validators.required],
    });

    const savedForm = this.service.getFormData('page2');
    if (savedForm) {
      this.form.patchValue(savedForm);
    }

    this.service.getData$('page2').subscribe((obj) => {
      this.data = obj;
    });

    // listen to form changes
    this.form.valueChanges.subscribe((val) => {
      this.service.setFormData('page2', val);
    });
  }

  // search() {
  //   const { startDate, endDate, customerName } = this.form.value;

  //   this.flag = false;
  //   this.errmsg = '';
  //   this.data = [];

  //   // API 1 → Date
  //   this.service.getByDate(startDate, endDate).subscribe((dateRes) => {
  //     // API 2 → Name (will fail if empty)
  //     this.service.getByName(customerName).subscribe({
  //       next: (nameRes) => {
  //         const filtered = nameRes.filter(
  //           (n: any) => n.customerName.toLowerCase() === customerName.toLowerCase(),
  //         );

  //         this.data = [...filtered];
  //         // store in cache
  //         this.service.setData('page2', this.data);
  //         this.cd.detectChanges();
  //         this.flag = false;
  //       },

  //       error: (err) => {
  //         console.error('Name API failed:', err);
  //         this.errmsg = 'Something went wrong, try again later';
  //         this.flag = true;
  //         // REQUIREMENT: no data should be shown
  //         this.data = [];
  //         this.cd.detectChanges();
  //       },
  //     });
  //   });
  // }
  search() {
    if (this.isLoading) return;
    const { startDate, endDate, customerName } = this.form.value;

    this.flag = false;
    this.errmsg = '';
    this.data = [];
    this.isLoading = true;

    this.service.getByDate(startDate, endDate).subscribe((dateRes) => {
      this.service.getByName(customerName).subscribe({
        next: (nameRes) => {
          this.isLoading = false;
          // Apply BOTH filters
          const filtered = dateRes.filter((d: any) => nameRes.some((n: any) => n.id === d.id));

          this.data = [...filtered];

          this.service.setData('page2', this.data);
          this.cd.detectChanges();
        },

        error: (err) => {
          this.isLoading = false;
          this.errmsg = 'Something went wrong, try again later';
          this.flag = true;
          this.data = [];
          this.cd.detectChanges();
        },
      });
    });
  }
  clearForm() {
    this.form.reset();
    this.data = [];
    this.service.setData('page2', this.data);
    this.errmsg = 'No Data Found';
    this.flag = true;
  }

  onEdit(item: any) {
    this.editRowId = item.id;
    this.edititem = { ...item };
  }
  cancelEdit() {
    this.editRowId = null;
    this.edititem = {};
  }
  saveEdit() {
    this.service.update(this.edititem).subscribe({
      next: (res: any) => {
        this.data = this.data.map((item) => (item.id === res.id ? { ...res } : item));
        this.service.setData('page2', this.data);

        this.editRowId = null;
        this.edititem = {};
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Update failed', err);
      },
    });
  }
  onDelete(item: any) {
    this.deleteRowId = item.id;
  }
  cancelDelete() {
    this.deleteRowId = null;
  }
  confirmDeletion(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.form.reset();
        this.data = this.data.filter((item) => item.id !== id);
        this.service.setData('page2', this.data);
        if (this.data.length === 0) {
          this.flag = true;
          this.errmsg = 'No Data Found';
        }
        this.deleteRowId = null;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

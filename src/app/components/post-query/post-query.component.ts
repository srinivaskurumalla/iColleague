import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-post-query',
  templateUrl: './post-query.component.html',
  styleUrls: ['./post-query.component.scss']
})
export class PostQueryComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private dbService: DbService) {
    this.form = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      description: [''],
    });
  }
  ngOnInit(): void {
  }


  submitForm() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.dbService.insertData(formData).subscribe(
        response => {
          console.log(response);
          this.dbService.showSuccess('Query added successfully')
          this.form.reset()
        },
        error => console.error(error)
      );
    }
  }
}

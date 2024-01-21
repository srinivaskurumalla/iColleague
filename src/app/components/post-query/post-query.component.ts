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
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private dbService: DbService) {
    this.form = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      description: [''],

    });
   
  }
  ngOnInit(): void {
  }
 
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  uploadFile() {
    if (this.selectedFile) {
      this.dbService.sendFile(this.selectedFile,3).subscribe(
        response => {
          console.log('File uploaded successfully:', response);
          // Handle success, if needed
          this.dbService.showSuccess('File uploaded successfully');
        },
        error => {
          console.error('Error uploading file:', error);
          this.dbService.showError('File upload failed')
          // Handle error, if needed
        }
      );
    }
  }

  downloadFile() {
    const fileId = 3; // Replace with the actual file ID
    this.dbService.downloadFile(fileId).subscribe(blob => {
      // Create a Blob object from the response
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'downloaded-file'; // You can set the default filename here
      document.body.appendChild(link);
      link.click();

      // Clean up resources
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      this.dbService.showSuccess('File downloaded successfully')
    });
  }
  submitForm() {
    if (this.form.valid) {
      console.log('file', this.form.value.file);
      const formData = this.form.value;
      const fileInput = this.form.get('file');

      if (fileInput && fileInput?.value && fileInput.value.length > 0) {
        const file: File = fileInput.value[0];
        const fileName = file.name;
        console.log('File Name:', fileName);
      }
    }
    this.dbService.insertData(this.form.value).subscribe(
      response => {
        console.log(response);
        this.dbService.showSuccess('Query added successfully')
        this.form.reset()
      },
      error => console.error(error)
    );
  }
}


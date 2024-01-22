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
      this.dbService.sendFile(this.selectedFile, 3).subscribe(
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

      const answerValue = this.form.get('answer')?.value;

      // Match URL pattern in answerValue
      const urlMatch = answerValue?.match(/((?:https?:\/\/)|(?:www\.))(?:\S+[^.,;])?/g);

      let extractedWord = 'here';

      if (urlMatch && urlMatch.length > 0) {
       
        const url = urlMatch[0];
        console.log('Extracted URL:', url);
      
        // Extract the word from the URL
        const match = url.match(/\/\/([^\/.]+)\.([^\/.]+)\./);

        if (match) {
          for (let mtch of match) {
            console.log('matched url names', mtch);
  
          }
          extractedWord = match[1];
          console.log('Extracted Word:', extractedWord);
        } else {
          console.log('No match found for extracting word');
        }
      } else {
        console.log('No match found for extracting URL');
      }

      // Transform the link into the desired format
      const transformedAnswer = answerValue?.replace(
        /((?:https?:\/\/)|(?:www\.))(?:\S+[^.,;])?/g,
        `<a href="${urlMatch}" target="_blank">${extractedWord}</a>`
      );



      const data = {
        ...this.form.value,
        answer: transformedAnswer
      };
      this.dbService.insertData(data).subscribe(
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


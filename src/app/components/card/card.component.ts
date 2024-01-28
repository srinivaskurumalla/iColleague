import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { KnowledgeBaseDto } from 'src/app/Models/knowledgeBaseDto.interface';
import { DbService, knowledgeBase } from 'src/app/services/db.service';
import { FileTable } from "src/app/Models/file.interface";
import { OverlayPanel } from 'primeng/overlaypanel';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @ViewChild('downloadOptionsPanel') downloadOptionsPanel!: OverlayPanel;
  fileId!: number
  fileName: string = 'downloaded-file'
  fileExtensions: string[] = [];

  getFileUrl(_t14: any) {
    return 'empty file name';
  }

  @Input() data: knowledgeBase = {
    id: 0,
    question: '',
    answer: '',
    description: ''
  };
  @Input() dataById: KnowledgeBaseDto = {
    id: 0,
    question: '',
    answer: '',
    description: '',
    fileTables: []
  }
  // @Input() dataById: KnowledgeBaseDto= {
  //   id: 0,
  //   question: '',
  //   answer: '',
  //   description: '',
  //   fileTables: []
  // };
  queryById: boolean = false;
  show: boolean = false;
  constructor(private sanitizer: DomSanitizer, private dbService: DbService) {
    console.log('data by id in const', this.dataById);
    if (this.dataById) {
      this.fileExtensions = this.dataById.fileTables.map(file => this.getFileExtension(file.fileName));
    }

  }

  showDetails: boolean = false;

  ngOnInit(): void {
    console.log('data', this.data);
    console.log('data By Id', this.dataById);


  }
  getSanitizedHTML(): SafeHtml {
    this.queryById = false
    const data = this.sanitizer.bypassSecurityTrustHtml(this.data?.answer);
    if (data != undefined) {
      this.show = true

      return data;
    }
    else return ''
  }
  getSanitizedHTMLById(): SafeHtml {
    this.queryById = true;

    return this.sanitizer.bypassSecurityTrustHtml(this.dataById?.answer);
  }
  toggleDetails() {
    this.showDetails = !this.showDetails
  }
  isPdfFile(fileName: string): boolean {
    const pdfExtensions = ['pdf'];
    const fileExtension = this.getFileExtension(fileName);
    return pdfExtensions.includes(fileExtension.toLowerCase());
  }
  isWordFile(fileName: string): boolean {
    const wordExtensions = ['doc', 'docx'];
    const fileExtension = this.getFileExtension(fileName);
    console.log('file extenstion', fileExtension);
    return wordExtensions.includes(fileExtension.toLowerCase());
  }
  isImageFile(fileName: string): boolean {
    const imageExtensions = ['png', 'jpg', 'jpeg'];
    const fileExtension = this.getFileExtension(fileName);
    return imageExtensions.includes(fileExtension.toLowerCase());
  }
  

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }

  showDownloadOptions(event: Event, overlayPanel: OverlayPanel, file: any): void {
    overlayPanel.toggle(event);
    this.fileId = file.fileId
    this.fileName = file.fileName
  }


  downloadFile(fileId: number) {
    this.dbService.downloadFile(fileId).subscribe(blob => {
      // Create a Blob object from the response
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = this.fileName //download file name
      document.body.appendChild(link);
      link.click();

      // Clean up resources
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      this.dbService.showSuccess('File downloaded successfully')
    });
  }
}

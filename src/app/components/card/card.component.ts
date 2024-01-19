import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { knowledgeBase } from 'src/app/services/db.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() data!: knowledgeBase;
  constructor(private sanitizer: DomSanitizer) { }

  showDetails: boolean = false;
  
  ngOnInit(): void {
    console.log('data', this.data);

  }
  getSanitizedHTML(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.data?.answer);
  }
  toggleDetails() {
    this.showDetails = !this.showDetails
  }
 

  // formatAnswer(answer: string): string {
  //   // Use a regular expression to find URLs in the answer
  //   const urlRegex = /(https?:\/\/[^\s]+)/g;
  //   const formattedAnswer = answer.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

  //   return formattedAnswer;
  // }
}

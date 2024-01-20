import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { knowledgeBase } from 'src/app/services/db.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() data: knowledgeBase = {
    id: 0,
    question: '',
    answer: '',
    description: ''
  };
  @Input() dataById: knowledgeBase= {
    id: 0,
    question: '',
    answer: '',
    description: ''
  };
  queryById:boolean = false;
  show:boolean=false;
  constructor(private sanitizer: DomSanitizer) { }

  showDetails: boolean = false;
  
  ngOnInit(): void {
     console.log('data', this.data);
     console.log('data By Id', this.dataById);

  }
  getSanitizedHTML(): SafeHtml {
    this.queryById = false
    const data =  this.sanitizer.bypassSecurityTrustHtml(this.data?.answer);
    if(data != undefined){
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
 

  // formatAnswer(answer: string): string {
  //   // Use a regular expression to find URLs in the answer
  //   const urlRegex = /(https?:\/\/[^\s]+)/g;
  //   const formattedAnswer = answer.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

  //   return formattedAnswer;
  // }
}

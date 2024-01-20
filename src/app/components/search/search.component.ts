import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { DbService, knowledgeBase } from 'src/app/services/db.service';
import { MessageService } from 'primeng/api';
import { DirectLineService } from 'src/app/services/direct-line.service';
// @ts-ignore
import submitSendBox from './actions/submitSendBox';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  // messages: any[] = [];
  // newMessage: string = '';


  private searchTerms = new Subject<string>();
  searchQuery!: string
  typedValue!: string

  queries!: knowledgeBase[];

  selectedQuery!: any;

  filteredQueries: knowledgeBase[] = [];
  result: knowledgeBase[] = []
  resultById: knowledgeBase = {
    id: 0,
    question: '',
    answer: '',
    description: ''
  };

  showCloseIcon: boolean = false;

  faqs: knowledgeBase[] = []
  constructor(private dbService: DbService, private directLineService: DirectLineService, private messageService: MessageService) { }

  ngOnInit() {

    // this.directLineService.sendMessageToBot('hi').subscribe(
    //   (res: any) => {
    //     console.log('msg from BOT', res);
    //   },
    //   (err) => {
    //     console.log('error from BOT', err);
    //   }
    // )
    this.dbService.getQueries().subscribe((queries) => {
      this.queries = queries;
      console.log('all queries from db', this.queries);

      this.queries.forEach(query => {
        if (query.id > 2 && query.id < 7) {
          this.faqs.push(query)
        }
      });
      console.log('faqs', this.faqs);
    });


  }

  // Send a message to the bot
  // sendMessage() {
  //   if (this.newMessage.trim() !== '') {
  //     this.directLineService.sendMessage(this.newMessage);
  //     this.newMessage = '';
  //   }
  // }

  updateTypedValue(event: any) {
    // this.typedValue = value;
    this.typedValue = event.target.value
    this.showCloseIcon = true

  }

  // showWarn(message: string) {
  //   this.messageService.add({ severity: 'warn', summary: 'Warn', detail: message });
  // }
  filterData(event?: AutoCompleteCompleteEvent) {
    let filtered: knowledgeBase[] = [];
    let query = event?.query.toLowerCase(); // convert query to lowercase for case-insensitive matching

    for (let i = 0; i < (this.queries as knowledgeBase[]).length; i++) {
      let result = (this.queries as knowledgeBase[])[i];

      // Check if the query is present anywhere in the question string
      if (result.question.toLowerCase().includes(query!)) {
        filtered.push(result);
      }
    }

    this.filteredQueries = filtered;

    //console.log('filtered queries', this.filteredQueries);
  }

  // The method to handle user input      =========> (completeMethod)="handleUserInput($event.query)"  in HTML
  //  handleUserInput(query: string) {
  //   // Push the search query into the observable stream
  //   this.searchTerms.next(query);
  // }

  search(selectedQuery?: any) {
    this.resultById = {
      id: 0,
      question: '',
      answer: '',
      description: ''
    }

    console.log('type value in search', this.typedValue);

    if ((this.typedValue === '' || this.typedValue == undefined) && (selectedQuery == null || selectedQuery == undefined || selectedQuery == '')) {
     this.dbService.showWarn('Please enter something to search');
      console.log('warning user does not entered any value');

      return;
    }
    this.result = []
    if (selectedQuery != null && selectedQuery != undefined && selectedQuery != '') {
      console.log('user selected query', selectedQuery);
      this.searchQuery = selectedQuery.question
      this.filteredQueries.filter(ans => {
        if (selectedQuery?.id) {
          if (ans.id == selectedQuery?.id) {
            this.result.push(ans);
            console.log('id', selectedQuery?.id);
            console.log('result from id', this.result);

          }
        }

      })
    }
    else {
      this.searchQuery = this.typedValue
      console.log('user not selected any query');
      // this.updateSelectedQuery(this.typedValue)
      console.log('modified selected query', this.selectedQuery);

      this.result = this.filteredQueries;
      console.log('result ', this.result);

    }

    if (this.result.length == 0) {
     this.dbService.showWarn('No matching query found. Please search and select relevent query')
    }
  }
  searchById(id: number) {
    this.result = []
    console.log('id:', id);
    this.dbService.getQueryById(id).subscribe(
      (res: knowledgeBase) => {
        this.resultById = res;
        this.searchQuery = res.question
        console.log('query by id:', this.resultById);

      },
      (err) => {
        console.log('error query by id', err);
      }
    )

  }
  updateSelectedQuery(value: any) {
    this.selectedQuery = value;
    //this.selectedQuery = { question: value };
  }

  clearSearchInput() {
    this.selectedQuery = '';  // Clear the selectedQuery value
    this.filterData();  // Call filterData with an empty query to refresh suggestions
    this.showCloseIcon = false;
  }

}

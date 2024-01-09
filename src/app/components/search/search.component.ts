import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { DbService, knowledgeBase } from 'src/app/services/db.service';
import { MessageService } from 'primeng/api';
import { DirectLineService } from 'src/app/services/direct-line.service';
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

  messages: any[] = [];
  newMessage: string = '';


  private searchTerms = new Subject<string>();
  searchQuery!: string
  typedValue!: string

  queries!: knowledgeBase[];

  selectedQuery!: any;

  filteredQueries: knowledgeBase[] = [];
  result: knowledgeBase[] = []

  constructor(private dbService: DbService,private directLineService: DirectLineService, private messageService: MessageService) { }

  ngOnInit() {

    // Receive messages from the bot
    this.directLineService.receiveMessage((message) => {
      this.messages.push(message);
    });

    this.dbService.getQueries().subscribe((queries) => {
      this.queries = queries;
      console.log('all queries', this.queries);

    });

    // this.dbService.getData().subscribe(
    //   (response) => {
    //     console.log('GET Request Response:', response);
    //   },
    //   (error) => {
    //     console.error('GET Request Error:', error);
    //   }
    // );

    // const postData = { /* your data for POST request */ };
    // this.dbService.postData(postData).subscribe(
    //   (response) => {
    //     console.log('POST Request Response:', response);
    //   },
    //   (error) => {
    //     console.warn('POST Request Error:', error);
    //   }
    // );
    //for delay filtering

    // this.searchTerms.pipe(debounceTime(1000)).subscribe((query) => {
    //   // Call your filterData method with the debounced query
    //   this.filterData({ query: query } as AutoCompleteCompleteEvent);
    // });
  }

  // Send a message to the bot
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.directLineService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  updateTypedValue(event: any) {
    // this.typedValue = value;
    this.typedValue = event.target.value


  }

  showWarn(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: message });
  }
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
    console.log('type value in search', this.typedValue);

    if ((this.typedValue === '' || this.typedValue == undefined) && (selectedQuery == null || selectedQuery == undefined || selectedQuery == '')) {
      this.showWarn('Please enter something to search');
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
      this.showWarn('No matching query found. Please select relevent query')
    }
  }

  updateSelectedQuery(value: any) {
    this.selectedQuery = value;
    //this.selectedQuery = { question: value };
  }

  clearSearchInput() {
    this.selectedQuery = '';  // Clear the selectedQuery value
    this.filterData();  // Call filterData with an empty query to refresh suggestions
  }

}

import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DbService, knowledgeBase } from 'src/app/services/db.service';
import { MessageService } from 'primeng/api';
import { DirectLineService } from 'src/app/services/direct-line.service';

import { query } from '@angular/animations';
import { KnowledgeBaseDto } from 'src/app/Models/knowledgeBaseDto.interface';

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

  knowledgeBaseAndFilesById: KnowledgeBaseDto ={
    id: 0,
    question: '',
    answer: '',
    description: '',
    fileTables: []
  }
  showCloseIcon: boolean = false;

  faqs: knowledgeBase[] = []
  constructor(private dbService: DbService) { }

  ngOnInit() {

   
    this.dbService.getQueries().subscribe((queries) => {
      this.queries = queries;
      console.log('all queries from db', this.queries);

      this.queries.forEach(query => {
        if(query.id == 34){
          this.faqs.push(query);
        }
        if (query.id > 2 && query.id < 10) {
          this.faqs.push(query)
        }
      });

     
      console.log('faqs', this.faqs);
    });


  }



  updateTypedValue(event: any) {
    this.typedValue = event.target.value
    this.showCloseIcon = true

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

  }

  

  search(selectedQuery?: any) {
    //assign initial values
    this.resultById = {
      id: 0,
      question: '',
      answer: '',
      description: ''
    }
    this.knowledgeBaseAndFilesById = {
      id:0,
      question:'',
      answer:'',
      description:'',
      fileTables:[]
    }
    console.log('type value in search', this.typedValue);

    //handle not typing any value
    if ((this.typedValue === '' || this.typedValue == undefined) && (selectedQuery == null || selectedQuery == undefined || selectedQuery == '')) {
     this.dbService.showWarn('Please enter something to search');
      console.log('warning user does not entered any value');

      return;
    }

    //empty previous seach queries
    this.result = []

    //fetch details of selected query from suggestion
    if (selectedQuery != null && selectedQuery != undefined && selectedQuery != '') {
      console.log('user selected query', selectedQuery);
      this.searchQuery = selectedQuery.question
      this.searchById(selectedQuery)
      return;
     
    }
    //handle not selected suggestions
    else {
      this.searchQuery = this.typedValue     
      this.result = this.filteredQueries;
    }

    //show warning if none of the queries matched
    if (this.result.length == 0) {
     this.dbService.showWarn('No matching query found. Please search and select relevent query')
    }
  }

  //fetch details by queryId | files also fetched from files table
  searchById(query:knowledgeBase) {
    this.result = []
    this.selectedQuery = query
    this.showCloseIcon = true
    console.log('id:', query.id);
    this.dbService.getQueryAndFilesById(query.id).subscribe(
      (res: any) => {
        this.knowledgeBaseAndFilesById = res;
        console.log('knowledgeBaseAndFilesById',this.knowledgeBaseAndFilesById)

        // this.resultById = res;
       
        // console.log('query by id:', this.resultById);

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

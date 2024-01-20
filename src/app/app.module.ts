import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { ButtonModule } from 'primeng/button';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import {  FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from './components/card/card.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DirectLineService } from './services/direct-line.service';
import { HeaderComponent } from './components/header/header.component';
import { ToolbarModule } from 'primeng/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PostQueryComponent } from './components/post-query/post-query.component';
@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    CardComponent,
    HeaderComponent,
    PostQueryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    HttpClientModule,
    AutoCompleteModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastModule,
    TooltipModule,
    AccordionModule,
    AvatarModule,
    BadgeModule,
    ToolbarModule,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule
    
  ],
  providers: [MessageService,DirectLineService],
  bootstrap: [AppComponent]
})
export class AppModule { }

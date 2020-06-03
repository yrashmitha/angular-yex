import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FooterComponent } from './navigation/footer/footer.component';
import {HomepageComponent} from "./homepage/homepage.component";
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PapersComponent } from './dashboard/papers/papers.component';
import { SidenavComponent } from './dashboard/sidenav/sidenav.component';
import { AccountComponent } from './dashboard/account/account.component';
import { UploadingComponent } from './dashboard/uploading/uploading.component';
import { SignupComponent } from './signup/signup.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth.service";
import {TokenInterceptorService} from "./services/token-interceptor.service";
import { UpdateComponent } from './dashboard/update/update.component';
import {NgxSpinnerModule} from "ngx-spinner";
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatChipsModule} from "@angular/material/chips";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import { SearchComponent } from './homepage/search/search.component';
import {AlertModule} from "ngx-alerts";
import { ResultsComponent } from './results/results.component';
import {MatTooltipModule} from "@angular/material/tooltip";
// import {AlertModule} from "ngx-alerts";




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    LoginComponent,
    DashboardComponent,
    PapersComponent,
    SidenavComponent,
    AccountComponent,
    UploadingComponent,
    SignupComponent,
    UpdateComponent,
    SearchComponent,
    ResultsComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSidenavModule,
    MatChipsModule,
    NgxDropzoneModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatExpansionModule,
    NgxSpinnerModule,
    NgProgressModule,
    NgProgressHttpModule,
    MatProgressBarModule,
    MatTooltipModule,
    AlertModule.forRoot({maxMessages: 5, timeout: 5000, position: 'right'})


  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents:[LoginComponent,UpdateComponent],
  providers: [{
provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

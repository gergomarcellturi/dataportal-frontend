import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {provideAuth, getAuth} from '@angular/fire/auth';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './components/page/login/login.component';
import {HeaderComponent} from './components/page/header/header.component';
import {HomeComponent} from './components/page/home/home.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./interceptor/auth-interceptor.interceptor";
import {DpButtonComponent} from './components/element/dp-button/dp-button.component';
import {MyDataComponent} from './components/page/my-data/my-data.component';
import {DpInputDirective} from './directives/dp-input.directive';
import {DpInputComponent} from './components/element/dp-input/dp-input.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataEditComponent} from './components/page/data-edit/data-edit.component';
import {DataNewComponent} from './components/page/data-new/data-new.component';
import {FadeOutDirective} from './directives/fade-out.directive';
import {DpDividerComponent} from './components/element/dp-divider/dp-divider.component';
import {DpFileComponent} from './components/element/dp-file/dp-file.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {MatChipsModule} from "@angular/material/chips";
import {DataViewComponent} from './components/page/data-view/data-view.component';
import {ExploreComponent} from './components/page/explore/explore.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {DpPreviewCardComponent} from './components/element/dp-preview-card/dp-preview-card.component';
import {ConfirmationDialogComponent} from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {SafeHtmlPipe} from "./pipes/safe-html.pipe";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { ProfileComponent } from './components/page/profile/profile.component';
import {MatTabsModule} from "@angular/material/tabs";
import { DpProfileComponent } from './components/element/dp-profile/dp-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    DpButtonComponent,
    MyDataComponent,
    DpInputDirective,
    DpInputComponent,
    DataEditComponent,
    DataNewComponent,
    FadeOutDirective,
    DpDividerComponent,
    DpFileComponent,
    DataViewComponent,
    ExploreComponent,
    DpPreviewCardComponent,
    ConfirmationDialogComponent,
    SafeHtmlPipe,
    ProfileComponent,
    DpProfileComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    CKEditorModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatTabsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

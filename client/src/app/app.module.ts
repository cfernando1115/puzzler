import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './home/register/register.component';
import { HomeComponent } from './home/home.component';
import { GameListComponent } from './home/game-list/game-list.component';
import { AdminComponent } from './admin/admin.component';
import { ExpandedDirective } from './_directives/expanded.directive';
import { ShowDirective } from './_directives/show.directive';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { AddGameComponent } from './admin/add-game/add-game.component';
import { GameComponent } from './game/game.component';
import { HangmanComponent } from './game/hangman/hangman.component';
import { DisabledDirective } from './_directives/disabled.directive';
import { RoleDirective } from './_directives/role.directive';
import { AdminGamesComponent } from './admin/admin-games/admin-games.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { UserDetailComponent } from './admin/admin-users/user-detail/user-detail.component';
import { PlayerComponent } from './player/player.component';
import { GameDetailComponent } from './player/game-detail/game-detail.component';
import { PhotoComponent } from './player/photo/photo.component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    HomeComponent,
    GameListComponent,
    AdminComponent,
    ExpandedDirective,
    ShowDirective,
    AddGameComponent,
    GameComponent,
    HangmanComponent,
    DisabledDirective,
    RoleDirective,
    AdminGamesComponent,
    AdminUsersComponent,
    UserDetailComponent,
    PlayerComponent,
    GameDetailComponent,
    PhotoComponent,
  ],
  imports: [
    BsDropdownModule.forRoot(),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
    FileUploadModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

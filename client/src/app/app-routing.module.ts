import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGamesComponent } from './admin/admin-games/admin-games.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminComponent } from './admin/admin.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { AdminGuard } from './_guards/admin.guard';
import { RouteGuard } from './_guards/route.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [RouteGuard],
    children: [
      {
        path: 'admin', component: AdminComponent, canActivate: [AdminGuard], children:
        [
          { path: 'games', component: AdminGamesComponent, canActivate: [AdminGuard] },
          { path: 'users', component: AdminUsersComponent, canActivate: [AdminGuard] },
        ]
      },
      { path: 'game', component: GameComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

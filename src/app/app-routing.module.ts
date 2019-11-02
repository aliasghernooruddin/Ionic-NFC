import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './bgt/login/login.module#LoginPageModule' },
  { path: 'home', canActivate: [AuthGuard], loadChildren: './bgt/home/home.module#HomePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

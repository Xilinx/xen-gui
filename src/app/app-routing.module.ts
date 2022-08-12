import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'mainapp', pathMatch: 'prefix' },
  {
    path: 'mainapp',
    loadChildren: './components/mainapp/mainapp.module#MainappModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

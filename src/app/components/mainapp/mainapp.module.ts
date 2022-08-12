import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationComponent } from './notification/notification.component';
import { MainappComponent } from './mainapp.component';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsModule } from '../widgets/widgets.module';

const route: Routes = [
  {
    path: '',
    component: MainappComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'notification',
        component: NotificationComponent
      }
    ]
  }
];

@NgModule({
  declarations: [DashboardComponent, NotificationComponent, MainappComponent],
  imports: [CommonModule, RouterModule.forChild(route), WidgetsModule],
  exports: [RouterModule, WidgetsModule]
})
export class MainappModule {}

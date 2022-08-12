import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationComponent } from './notification/notification.component';
import { MainappComponent } from './mainapp.component';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsModule } from '../widgets/widgets.module';
import { BootConfigurationComponent } from './boot-configuration/boot-configuration.component';

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
      },
      {
        path: 'boot-configuration',
        component: BootConfigurationComponent
      }
    ]
  }
];

@NgModule({
  declarations: [DashboardComponent, NotificationComponent, MainappComponent, BootConfigurationComponent],
  imports: [CommonModule, RouterModule.forChild(route), WidgetsModule],
  exports: [RouterModule, WidgetsModule]
})
export class MainappModule {}

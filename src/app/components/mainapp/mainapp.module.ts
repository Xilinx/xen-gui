import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainappComponent } from './mainapp.component';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsModule } from '../widgets/widgets.module';
import { BootConfigurationComponent } from './boot-configuration/boot-configuration.component';
import { ReadDeviceTreeComponent } from './read-device-tree/read-device-tree.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { DomainsComponent } from './domains/domains.component';

const route: Routes = [
  {
    path: '',
    component: MainappComponent,
    children: [
      { path: '', redirectTo: 'read-device-tree', pathMatch: 'prefix' },
      {
        path: 'read-device-tree',
        component: ReadDeviceTreeComponent
      },
      {
        path: 'boot-configuration',
        component: BootConfigurationComponent
      },
      {
        path: 'domains',
        component: DomainsComponent
      },
    ]
  }
];

@NgModule({
  declarations: [MainappComponent, BootConfigurationComponent, ReadDeviceTreeComponent, DomainsComponent],
  imports: [CommonModule, RouterModule.forChild(route), WidgetsModule, NgxSliderModule, FormsModule],
  exports: [RouterModule, WidgetsModule]
})
export class MainappModule {}

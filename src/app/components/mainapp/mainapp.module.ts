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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DomainsModalComponent } from './modals/domains-modal/domains-modal.component';
import { DomainDetailsComponent } from './domain-details/domain-details.component';
import { DeviceTypeFilterPipe } from '../../filters/device-type-filter.pipe';
import { DeviceNameFilterPipe } from '../../filters/device-name-filter.pipe';
import { OrderColorPipe } from '../../filters/order-color.pipe';
import { NumberToBytesPipe } from '../../filters/number-to-bytes.pipe';
import { ModalDeviceTreeErrorComponent } from './modals/modal-device-tree-error/modal-device-tree-error.component';
import { ModalDeleteDomainComponent } from './modals/modal-delete-domain/modal-delete-domain.component';
import { ModalEnableManualCacheColoringComponent } from './modals/modal-enable-manual-cache-coloring/modal-enable-manual-cache-coloring.component';
import { ImagebuilderPreviewComponent } from './imagebuilder-preview/imagebuilder-preview.component';

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
        path: 'domain/:name',
        component: DomainDetailsComponent
      },
      {
        path: 'domains',
        component: DomainsComponent
      },
      {
        path: 'imagebuilder-preview',
        component: ImagebuilderPreviewComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    MainappComponent, 
    BootConfigurationComponent, 
    ReadDeviceTreeComponent, 
    DomainsComponent, 
    DomainsModalComponent, 
    DomainDetailsComponent, 
    DeviceTypeFilterPipe, 
    DeviceNameFilterPipe, 
    OrderColorPipe,
    NumberToBytesPipe,
    ModalDeviceTreeErrorComponent,
    ModalDeleteDomainComponent,
    ModalEnableManualCacheColoringComponent,
    ImagebuilderPreviewComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(route), WidgetsModule, NgxSliderModule, FormsModule, NgbModule],
  exports: [RouterModule, WidgetsModule],
  entryComponents: [
    DomainsModalComponent,
    ModalDeviceTreeErrorComponent, 
    ModalDeleteDomainComponent, 
    ModalEnableManualCacheColoringComponent,
      
  ]
})
export class MainappModule {}

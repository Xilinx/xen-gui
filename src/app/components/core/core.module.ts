import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [TitlebarComponent, SidebarComponent],
  imports: [CommonModule],
  exports: [TitlebarComponent, SidebarComponent]
})
export class CoreModule {}

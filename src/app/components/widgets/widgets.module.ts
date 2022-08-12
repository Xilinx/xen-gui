import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderComponent } from './content-header/content-header.component';
import { InfoboxComponent } from './infobox/infobox.component';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  declarations: [ContentHeaderComponent, InfoboxComponent, ProgressComponent],
  imports: [CommonModule],
  exports: [InfoboxComponent, ContentHeaderComponent, ProgressComponent]
})
export class WidgetsModule {}

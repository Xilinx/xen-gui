import { Component, OnInit } from '@angular/core';
import { ImagebuilderFileManagementService } from '../../../services/imagebuilder-file-management.service';

@Component({
  selector: 'app-imagebuilder-preview',
  templateUrl: './imagebuilder-preview.component.html',
  styleUrls: ['./imagebuilder-preview.component.scss']
})
export class ImagebuilderPreviewComponent implements OnInit {

  public imageBuilderStr: string = "";

  constructor(
    private imagebuilder: ImagebuilderFileManagementService
  ) { }

  ngOnInit() {
    this.imageBuilderStr = this.imagebuilder.constructFileString().replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

}

import { Component, OnInit } from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { FileService } from '../../../shared/service/file.service';
import { Store } from '@ngrx/store';
import { selectFileData } from '../../../shared/store/file/file.reducers';
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {PdfViewerModule} from "ng2-pdf-viewer";

@Component({
  selector: 'app-web-view',
  standalone: true,
  imports: [
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
  ],
  templateUrl: './web-view.component.html',
  styleUrl: './web-view.component.scss',
})
export class WebViewComponent implements OnInit {
  blob!: Blob;
  fileUrl!: SafeResourceUrl;
  isLoaded: boolean = false;

  constructor(
    private fileService: FileService,
    private store: Store,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {

/*

    this.store.select(selectFileData).subscribe(file => {
    });
*/

    this.fileService.fetchFile(1).subscribe(blob => {
      this.blob = blob;

      console.log(blob)
      this.fileUrl = this.fileService.getFileUrl(blob);
      console.log(this.fileUrl);
      this.isLoaded = true;
    })


    // Using a test file

/*
    const testFileUrl = './assets/testfiles/testfile.pdf';
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(testFileUrl);
    console.log(this.fileUrl);
    */
  }

}

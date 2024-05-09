import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileService } from '../../../shared/service/file.service';
import { selectFileData } from '../../../shared/store/file/file.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-web-view',
  standalone: true,
  imports: [],
  templateUrl: './web-view.component.html',
  styleUrl: './web-view.component.scss',
})
export class WebViewComponent implements OnInit {
  file!: File;
  fileUrl!: SafeResourceUrl;

  constructor(
    private fileService: FileService,
    private store: Store,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    /*
    this.store.select(selectFileData).subscribe(file => {
      this.file = file.at(0)!
    })
    this.fileUrl = this.fileService.getFileUrl(this.file);
    */
    const testFileUrl = 'assets/testfiles/testfile.pdf';
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(testFileUrl);
  }
}

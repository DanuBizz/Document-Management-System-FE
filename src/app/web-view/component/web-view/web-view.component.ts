import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FileService } from '../../../shared/service/file.service';
import { Store } from '@ngrx/store';
import { selectFileData } from '../../../shared/store/file/file.reducers';

@Component({
  selector: 'app-web-view',
  standalone: true,
  imports: [],
  templateUrl: './web-view.component.html',
  styleUrl: './web-view.component.scss',
})
export class WebViewComponent implements OnInit {
  file!: Blob;
  fileUrl!: SafeResourceUrl;

  constructor(
    private fileService: FileService,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.select(selectFileData).subscribe(file => {
      this.file = file!;
      this.fileUrl = this.fileService.getFileUrl(this.file);
    });

    // Using a test file
    /*
    const testFileUrl = 'assets/testfiles/testfile.pdf';
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(testFileUrl);
*/
  }
}

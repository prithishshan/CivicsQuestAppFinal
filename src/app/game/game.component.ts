import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  moreInfoData: any = {exists: false};
  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private cdr:ChangeDetectorRef) { }

  ngOnInit() {
    setInterval(() => this.pollData(), 1000)
    this.cdr.detach();
    this.cdr.detectChanges();
  }

  pollData = () => {
    this.http.get("https://civicsquestapi.azurewebsites.net/more_info").subscribe(
      (result:any) => {
        if (result.title) {
          if (this.moreInfoData.id != result.id) {
            if (result.isCase) {
              this.moreInfoData.isCase = result.isCase;
              this.moreInfoData.id = result.id;
              this.moreInfoData.pdfLink = result.pdfLink;
              this.moreInfoData.title = " the Supreme Court Ruling on " + result.title + " (" + result.year + ")" + " that Inspired this Senario";
              this.moreInfoData.exists = true;
              this.cdr.detectChanges();
            } else {
              this.moreInfoData.title = result.title;
              this.moreInfoData.description = result.description;
              this.moreInfoData.exists = true;
              this.cdr.detectChanges();
            }
          } 
        }
      }
    );
  }

  getUrl():SafeResourceUrl | null{
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.moreInfoData.pdfLink);
  }
}

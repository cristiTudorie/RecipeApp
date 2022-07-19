import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingSerivce } from './logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private loggingService: LoggingSerivce) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.loggingService.printLog('Hello fom AppComponent ngOnInit');
  }
}

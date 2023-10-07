import { Component, OnInit } from '@angular/core';
import { AlertService } from './shared/services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'journoBlogg';

  constructor(public alertService: AlertService){}

  ngOnInit(){
    
  }
}

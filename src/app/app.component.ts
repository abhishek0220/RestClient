import { Component } from '@angular/core';
import {ApiService} from './service/api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RestClient';
  res:any;
  constructor(private apiService: ApiService) {}

  ngOnInit() {}
  getCall(uri, type){
    console.log(uri, type);
    this.apiService.getReq(uri).subscribe((data) => {
     this.res = JSON.stringify(data) ;
     console.log(data)
    })    

  }
}

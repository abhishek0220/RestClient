import {Component } from '@angular/core';
import {ApiService} from './service/api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'RestClient';
  res:any;
  header:any = [['Content-Type','application/json']];
  headerName : string;
  reqType = "GET";
  constructor(private apiService: ApiService) {}

  ngOnInit() {}
  async callReq(uri, data){
    var type = this.reqType; 
    console.log(uri, type, data);
    if(type == "GET"){
      this.apiService.getReq(uri).subscribe((data) => {
        this.res = JSON.stringify(data) ;
        console.log(data)
       })  
    }
    else if(type=="POST"){
      var headers  = {};
      for(var i=0; i<this.header.length; i++){
        headers[this.header[i][0]] = this.header[i][1];
      }
      console.log(headers);
      this.apiService.postReq(uri, data, headers ).subscribe((data) => {
        this.res = JSON.stringify(data) ;
        console.log(data)
       })  
    }
      
  }
  deleteHeader(id:number){
    this.header.splice(id,1);
    console.log("deleted")
  }
  addHeader(name, value){
    if(name.length * value.length == 0) return;
    this.header.push([name,value]);
    console.log("added")
  }
}

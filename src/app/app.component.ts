import {Component } from '@angular/core';
import {ApiService} from './service/api.service';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'RestClient';
  res:any;
  res_beautified : any;
  res_type ={
    lineNumbers: true,
    theme: 'material',
    mode: 'application/json',
    lineWrapping : true,
    smartIndent : true,
    readonly : true
  };
  body_type ={
    lineNumbers: true,
    theme: 'duotone-light',
    mode: 'application/json',
    lineWrapping : true,
    smartIndent : true
  };
  header:any = [['Content-Type','application/json']];
  //headerName : string;
  reqType = "GET";
  isCORS = false;
  body_dat : any;

  headerName = new FormControl();
  headerNameOptions: string[] = [];
  headerNamefilteredOptions: Observable<string[]>;

  headerValue = new FormControl();
  headerValueOptions: string[] = [];
  headerValuefilteredOptions: Observable<string[]>;

  headerVals = {
    'Content-Type' : ['application/x-www-form-urlencoded', 'application/json', 'application/javascript', 'application/xml',
                    'text/html','text/plain','text/json'],
    'Accept' : ['application/json', 'application/xml'],
    'Accept-Language' : ['fr','de-DE','en-US','en-CA'],
    'Access-Control-Request-Method': ['GET','DELETE','PUT','POST'],
    'Access-Control-Request-Headers': ['Content-Length','Content-Type'],
    'Accept-Encoding': ['gzip','deflate','compress','br','indentity','*'],
    'Allow': ['GET','DELETE','PUT','POST'],
    'Authorization':[],
    'Cache-Control' : ['no-cache'],
    'Clear-Site-Data': ['"storage"','"cookies"','"cache"','"executionContexts"','"*"'],
    'Cookie': [],
    'Connection' : ['keep-alive', 'close'],
    'From': [],
    'If-Match': ['*'],
    'Save-Data':['On'],
    'Transfer-Encoding':['chunked','gzip','deflate','compress','indentity']
  }

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    for(var i in this.headerVals){
      this.headerNameOptions.push(i);
    }
    this.headerNamefilteredOptions = this.headerName.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          this._refre(value);
          return this._filter(value, this.headerNameOptions)
        })
    );
    this.headerValuefilteredOptions = this.headerValue.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.headerValueOptions))
    );
  }
  _refre(dat : string){
    this.headerValueOptions = this.headerVals[dat] || [];
    this.headerValuefilteredOptions = of(this._filter('', this.headerValueOptions));
  }
  private _filter(value: string, arr : string[] ): string[] {
    const filterValue = value.toLowerCase();
    return arr.filter(option => option.toLowerCase().includes(filterValue));
  }
  async callReq(uri){
    var data = this.body_dat
    console.log(data)
    this.res = "";
    this.res_beautified = "";
    var type = this.reqType; 
    console.log(uri, type, data, this.isCORS);
    var headers  = {};
    for(var i=0; i<this.header.length; i++){
      headers[this.header[i][0]] = this.header[i][1];
    }
    if(this.isCORS){
      this.apiService.coverAPI(uri,type, data, headers).subscribe((data) =>{
        var type = "plain";
        for(var eachheader in data['headers']){
          if(eachheader.toUpperCase() == "CONTENT-TYPE"){
            type = data['headers'][eachheader].split(";")[0]
            break;
          }
        }
        this.display(atob(data['body']), type.toLowerCase())
      })
    }
    else if(type == "GET"){
      this.apiService.getReq(uri, headers).subscribe( (data) => {
        var dat_type = data.headers.get('content-type').split(";")[0] || "text/plain"
        dat_type = dat_type.toLowerCase();
        if(dat_type == "application/json")
          this.display(JSON.stringify(data.body),dat_type);
        else
          this.display(data.body.toString(), dat_type)
       },
       err =>{
        console.log(err)
        this.res = err.error;
       })  
    }
    else if(type=="POST"){
      this.apiService.postReq(uri, data, headers ).subscribe((data) => {
        var dat_type = data.headers.get('content-type').split(";")[0] || "text/plain"
        dat_type = dat_type.toLowerCase();
        if(dat_type == "application/json")
          this.display(JSON.stringify(data.body),dat_type);
        else
          this.display(data.body.toString(), dat_type)
       },
       err =>{
        console.log(err)
        this.res = err.error;
      })  
    } 
  }
  display(data : string, dat_type : string){
    this.res = data;
    this.res_type.mode = dat_type;
    console.log(dat_type)
    if(dat_type == "application/json"){
      var tmp = JSON.parse(data)
      this.res_beautified = JSON.stringify(tmp, null, 4);
    }
    else{
      this.res_beautified = data;
    }
  }
  deleteHeader(id:number){
    this.header.splice(id,1);
    console.log("deleted")
  }
  addHeader(){
    var name = this.headerName.value;
    var value = this.headerValue.value;
    if(name.length * value.length == 0) return;
    this.header.push([name,value]);
    console.log("added")
  }
}

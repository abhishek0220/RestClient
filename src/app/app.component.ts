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
  header:any = [['Content-Type','application/json']];
  //headerName : string;
  reqType = "GET";

  headerName = new FormControl();
  headerNameOptions: string[] = [];
  headerNamefilteredOptions: Observable<string[]>;

  headerValue = new FormControl();
  headerValueOptions: string[] = [];
  headerValuefilteredOptions: Observable<string[]>;

  headerVals = {
    'Content-Type' : ['application/x-www-form-urlencoded', 'application/json', 'application/javascript', 'application/xml'],
    'Accept' : ['application/json', 'application/xml']
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
  addHeader(){
    var name = this.headerName.value;
    var value = this.headerValue.value;
    if(name.length * value.length == 0) return;
    this.header.push([name,value]);
    console.log("added")
  }
}

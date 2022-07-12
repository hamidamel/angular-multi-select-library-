import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IMultiSelectModel, ListItem } from 'projects/ui-lib/src/public-api';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'demo';
  selectedItems: Array<ListItem> = [];
  selectedItem: Array<ListItem> = [];
  items: Array<ListItem> =[];
  filteredItems: Array<ListItem> =[];

  fieldOption: IMultiSelectModel = {singleSelection: true, idField: 'id', textField:'name', emptyListMessage: 'Not Data', loading: false};
  multiFieldOption: IMultiSelectModel = {singleSelection: false, idField: 'id', textField:'name', emptyListMessage: 'Not Data', loading: false};

  constructor(private http: HttpClient){
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
    console.log('selectedItem', this.selectedItems);
  }

  ngOnInit(): void {

    this.http.get<ListItem[]>('https://api.coinpaprika.com/v1/coins').pipe(tap(result=> result.sort((a,b)=> {
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    }))).subscribe(items=>{
      this.items =this.filteredItems = items.slice(0,200);
    },(e)=>{
      console.log(e);
    });
  }

  filterItems(ev: any){
    this.filteredItems = this.items.filter((v)=> v.name.startsWith(ev));
  }

}

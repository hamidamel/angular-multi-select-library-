import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IMultiSelectModel, ListItem } from 'projects/ui-lib/src/public-api';

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
  multiFieldOption: IMultiSelectModel = {singleSelection: true, idField: 'id', textField:'name', emptyListMessage: 'Not Data', loading: false};

  constructor(private http: HttpClient){
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
    console.log('selectedItem', this.selectedItems);
  }

  ngOnInit(): void {

    this.http.get<ListItem[]>('https://api.coinpaprika.com/v1/coins').subscribe(items=>{
      this.items =this.filteredItems = items;
    },(e)=>{
      console.log(e);
    });
  }

  filterItems(ev: any){
    this.filteredItems = this.items.filter((v)=> v.name.startsWith(ev));
  }

}

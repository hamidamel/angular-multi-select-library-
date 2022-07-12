import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { IMultiSelectModel, ListItem } from '../../public-api';


@Component({
  selector: 'lib-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]

})
export class MultiSelectComponent implements ControlValueAccessor, OnDestroy {
  public selectedItems: Array<any> = [];
  private _items: Array<any> = [];
  private _filteredItems: Array<any> = [];
  public get filteredItems(): Array<any> {
    return this._filteredItems;
  }
  public set filteredItems(value: Array<any>) {
    this._filteredItems = value;
  }
  public open: boolean = false;
  public selectAll$ = new BehaviorSubject(false);

  @Input()
  public placeholder: string = '';

  public get items(): Array<ListItem> {
    return this._items;
  }
  filter: ListItem = new ListItem(this.items);
  private _options: IMultiSelectModel = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    emptyListMessage: 'No Data',
    loadingMessage: 'Loading Data',
    loading: false,
    defaultSortFunction: (a:any,b:any)=> {
      if(a < b) { return -1; }
      if(a > b) { return 1; }
      return 0;
    }
  };
  public get options(): IMultiSelectModel {
    return this._options;
  }
  @Input()
  public set options(value: IMultiSelectModel) {
    //its like overridding default options
    this._options = {...this._options, ...value };
  }
  @Input()
  public set items(value: Array<any>) {
    if (!value) {
      this._items = [];
    } else {
      this._items = value.map((item) =>
        new ListItem({
          id: item[this.options.idField],
          text: item[this.options.textField],
        })
      );
    }
  }

  @Output("onFilterChange")
  onFilterChange: EventEmitter<ListItem> = new EventEmitter<any>();
  @Output("onDropDownClose")
  onDropDownClose: EventEmitter<ListItem> = new EventEmitter<any>();


  private onTouched: () => void = ()=>{};
  private onChange: (_: any)=> void = ()=>{};

  constructor(private cdr: ChangeDetectorRef) {
    this.selectAll$.subscribe(value=>{
      if (value) {
        this.selectedItems = this.items.slice();
      } else {
        this.selectedItems = [];
      }
      this.onChange(this.emittedValue(this.selectedItems));
    });
  }

  ngOnDestroy(): void {
    this.selectAll$.unsubscribe();
  }

  clickOutside() {
    this.closeDropdown();
  }

  isSelected(clickedItem: any) {
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem[this.options.idField] === item[this.options.idField]) {
        found = true;
      }
    });
    return found;
  }

  toggleDropdown($event: any) {
    $event.preventDefault();
    this.open = true;
  }

  closeDropdown() {
    this.open = false;
    this.filter.name = "";
    
    this.onDropDownClose.emit();
  }

  onItemClick($event: any, item: ListItem) {
    const found = this.isSelected(item);
    if (!found) {
      this.addSelected(item);
    } else {
      this.removeSelected(item);
    }
   
  }

  addSelected(item: ListItem) {

    if (this.options.singleSelection) {
      this.selectedItems = [];
      this.selectedItems.push(item);
    } else {
      this.selectedItems.push(item);
    }

    // for move item to the top of the list
    this.items.sort((a,b)=>{ return a.id === item.id ? -1 : b.id === item.id ? 1 : 0; });

    this.onChange(this.emittedValue(this.selectedItems));
  }

  
  toggleSelectAll() {
    this.selectAll$.next(!this.selectAll$.value);
  }

  removeSelected(itemSel: any) {
    if (this.options.defaultSortFunction){
      this.items.sort(this.options.defaultSortFunction);
    }
    this.selectedItems.forEach(item => {
      if (itemSel[this.options.idField] === item[this.options.idField]) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this.onChange(this.emittedValue(this.selectedItems));
  }

  emittedValue(val: Array<ListItem>): any {
    const selected: Array<ListItem> = [];

    val.map(item => {
      selected.push(item);
    });

    return selected;
  }

  writeValue(obj: any): void {
    if (obj !== undefined && obj !== null && obj.length > 0) {
      const _data = obj.map((item: any) =>
        typeof item === "string" || typeof item === "number"
          ? new ListItem(item)
          : new ListItem({
            id: item[this.options.idField],
            text: item[this.options.textField],
          })
      );
      this.selectedItems = _data;
      this.items = _data;
    }else{
      this.selectedItems = [];
    }
    this.onChange(obj);
    this.cdr.markForCheck();
  }

  onFilterTextChange($event: any) {
    this.onFilterChange.emit($event);
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

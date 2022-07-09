import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
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
export class MultiSelectComponent implements ControlValueAccessor {

  constructor(private cdr: ChangeDetectorRef) { }
  public selectedItems: Array<ListItem> = [];
  private _items: Array<ListItem> = [];
  public open: boolean = false;
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
    allowSearchFilter: false,
    limitSelection: -1,
    clearSearchFilter: true,
    searchPlaceholderText: "Search",
    noDataAvailablePlaceholderText: "No data available",
    noFilteredDataAvailablePlaceholderText: "No filtered data available",
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
    allowRemoteDataSearch: false
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
  public set items(value: Array<ListItem>) {
    if (!value) {
      this._items = [];
    } else {
      this._items = value.map((item) =>
        new ListItem({
          id: item.id,
          text: item.name,
        })
      );
    }
  }

  @Output("onFilterChange")
  onFilterChange: EventEmitter<ListItem> = new EventEmitter<any>();
  @Output("onDropDownClose")
  onDropDownClose: EventEmitter<ListItem> = new EventEmitter<any>();
  @Output("onSelect")
  onSelect: EventEmitter<ListItem> = new EventEmitter<any>();
  @Output("onDeSelect")
  onDeSelect: EventEmitter<ListItem> = new EventEmitter<any>();

  private onTouched: () => void = ()=>{};
  private onChange: (_: any)=> void = ()=>{};
  
  clickOutside() {
    this.closeDropdown();
  }

  isSelected(clickedItem: ListItem) {
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem.id === item.id) {
        found = true;
      }
    });
    return found;
  }

  toggleDropdown($event: any) {
    $event.preventDefault();
    this.open = !this.open;
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
    if (this._options.singleSelection && this._options.closeDropDownOnSelection) {
      this.closeDropdown();
    }
  }

  addSelected(item: ListItem) {
    if (this._options.singleSelection) {
      this.selectedItems = [];
      this.selectedItems.push(item);
    } else {
      this.selectedItems.push(item);
    }
    this.onChange(this.emittedValue(this.selectedItems));
    this.onSelect.emit(this.emittedValue([item]));
  }

  removeSelected(itemSel: ListItem) {
    this.selectedItems.forEach(item => {
      if (itemSel.id === item.id) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this.onChange(this.emittedValue(this.selectedItems));
    this.onDeSelect.emit(this.emittedValue([itemSel]));
  }

  emittedValue(val: Array<ListItem>): any {
    const selected: Array<ListItem> = [];

    val.map(item => {
      selected.push(item);
    });

    return selected;
  }

  writeValue(obj: any): void {
    console.log(this._items);
    if (obj !== undefined && obj !== null && obj.length > 0) {
      const _data = obj.map((item: any) =>
        typeof item === "string" || typeof item === "number"
          ? new ListItem(item)
          : new ListItem({
            id: item.id,
            text: item.text,
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

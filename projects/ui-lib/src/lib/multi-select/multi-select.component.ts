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
  public selectedItems: Array<any> = [];
  private _items: Array<any> = [];
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
    emptyListMessage: 'No Data',
    loadingMessage: 'Loading Data',
    loading: false,
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
  @Output("onSelect")
  onSelect: EventEmitter<ListItem> = new EventEmitter<any>();
  @Output("onDeSelect")
  onDeSelect: EventEmitter<ListItem> = new EventEmitter<any>();

  private onTouched: () => void = ()=>{};
  private onChange: (_: any)=> void = ()=>{};
  
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
    if (this._options.singleSelection) {
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

  removeSelected(itemSel: any) {
    this.selectedItems.forEach(item => {
      if (itemSel[this.options.idField] === item[this.options.idField]) {
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

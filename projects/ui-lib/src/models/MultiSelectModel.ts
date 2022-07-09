export interface IMultiSelectModel {
    singleSelection?: boolean;
    idField?: string;
    textField?: string;
    disabledField?: string;
    enableCheckAll?: boolean;
    selectAllText?: string;
    unSelectAllText?: string;
    allowSearchFilter?: boolean;
    clearSearchFilter?: boolean;
    maxHeight?: number;
    itemsShowLimit?: number;
    limitSelection?: number;
    searchPlaceholderText?: string;
    noDataAvailablePlaceholderText?: string;
    noFilteredDataAvailablePlaceholderText?: string;
    closeDropDownOnSelection?: boolean;
    showSelectedItemsAtTop?: boolean;
    defaultOpen?: boolean;
    allowRemoteDataSearch?: boolean;
  }

  export class ListItem {
    id: String;
    name: String;
  
    public constructor(source: any) {
      if (typeof source === 'object') {
        this.id = source.id;
        this.name = source.text;
      }else{
        this.id = this.name = source;
      }
    }
  }
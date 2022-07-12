export interface IMultiSelectModel {
    singleSelection?: boolean;
    idField: string;
    textField: string;
    emptyListMessage?: string;
    loadingMessage?: string;
    loading?: boolean;
  }

  export class ListItem {
    id: String;
    name: String;
    selected: boolean = false;

    public constructor(source: any) {
      if (typeof source === 'object') {
        this.id = source.id;
        this.name = source.text;
        this.selected = false;
      }else{
        this.id = this.name = source;
      }
    }
  }
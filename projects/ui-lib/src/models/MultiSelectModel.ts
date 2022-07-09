export interface IMultiSelectModel {
    singleSelection?: boolean;
    idField?: string;
    textField?: string;
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
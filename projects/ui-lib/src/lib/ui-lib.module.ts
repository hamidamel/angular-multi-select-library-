import { NgModule } from '@angular/core';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { UiLibComponent } from './ui-lib.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { BrowserModule } from '@angular/platform-browser';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UiLibComponent,
    MultiSelectComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    ScrollingModule,
    FormsModule
  ],
  exports: [
    UiLibComponent,
    MultiSelectComponent
  ]
})
export class UiLibModule { }

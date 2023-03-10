import { NgModule } from '@angular/core';
import {AppComponent} from "./app.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AddressController} from "./address.controller";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {DATA_PROVIDER, SearchModule} from "@glasp/multi-search";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    SearchModule
  ],
  providers: [{
    provide: DATA_PROVIDER,
    useClass: AddressController}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

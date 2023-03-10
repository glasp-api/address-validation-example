import {AfterViewInit, Component, Inject, OnDestroy} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {AddressController, ICountry, IStatus} from "./address.controller";
import {Subscription} from "rxjs";
import {DATA_PROVIDER} from "@glasp/multi-search";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  valueSubscription!: Subscription;

  hasValidAddress: boolean = false;
  hasSubmittedAddress: boolean = false;
  warning: string = "";

  form = this.initGroup();

  countries = new Map<string, string>([
    ["Italy", "IT"],
    ["Switzerland", "CH"]
  ]);

  constructor(@Inject(DATA_PROVIDER) addressController: AddressController, private fb: FormBuilder) {
    const parentThis = this;
    addressController.iCountry =  new class implements ICountry {
      getCountry(): string {
        return parentThis.countries.get(parentThis.form.get('countrySelect')?.value!)!;
      }
    };
    addressController.iStatus = new class implements IStatus {
      setStatus(status: boolean): void {
        parentThis.hasValidAddress = status;
        parentThis.hasSubmittedAddress = false;
        parentThis.warning = "";
      }
    }
  }

  ngAfterViewInit(): void {
    this.valueSubscription = this.form.valueChanges.subscribe(() => this.form.invalid ? null : this.warning = "");
  }

  ngOnDestroy(): void {
    this.valueSubscription.unsubscribe();
  }

  submit(): void {
    if (this.form.invalid){
      setTimeout(() => this.form.markAllAsTouched());
      this.warning = "Please enter missing values.";
    } else if (!this.hasValidAddress){
      this.hasSubmittedAddress = true;
      this.warning = "Address is invalid, please check!";
    } else {
      //code to continue with valid address data goes here
      console.log(this.form.get("streetInput")?.value + "," + this.form.get('zipInput')?.value + ","
        + this.form.get('cityInput')?.value + "," + this.form.get('countrySelect')?.value)
    }
  }

  reset(): void {
    this.form.reset({countrySelect: "Italy"});
    this.warning = "";
    this.hasSubmittedAddress = false;
    this.hasValidAddress = false;
    setTimeout(() => this.form.markAsUntouched());
  }

  initGroup(): FormGroup {
    return  this.fb.group({
      firstNameInput: ['', {validators: [Validators.required, Validators.minLength(3)]}],
      surnameInput: ['', {validators: [Validators.required, Validators.minLength(2)]}],
      streetInput: ['', {validators: Validators.required}],
      numberInput: ['', {validators: Validators.required}],
      zipInput: ['', {validators: Validators.required}],
      cityInput: ['', {validators: Validators.required}],
      countrySelect: ['Italy', {validators: Validators.required}]
    })
  }
}

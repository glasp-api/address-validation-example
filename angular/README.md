# Address Validation Angular Example
## Install angular material

First, we run `ng add @angular/material` and `npm i @glasp/multi-search` to add the necessary dependencies to the project.
Angular material requires a theme which we add in the `styles.css` file.

```typescript
@import "../node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css";
```

## Search Entity For Address Input Fields
We define an entity where the properties connect the input fields, in this case an AddressEntity for the street name, the zip code and the city.

```typescript
export class Address {
  street!: string;
  zip!: string;
  city!: string;
  country!: string;

  constructor(street: string, zip: string, city: string, country: string) {
    this.street = street;
    this.zip = zip;
    this.city = city;
    this.country = country;
  }
}
```

## Provide Search Service
In the Search Service we call the Spring Boot backend which we have implemented in https://github.com/glasp-api/address-validation-example/tree/master/spring-boot.

```typescript
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class SearchService {

    constructor(private http: HttpClient) {
    }

    search(address: Address): Observable<Address[]> {
        return this.http.post<Address[]>("http://localhost:8080/app/search", address, httpOptions);
    }
}
```

## Implement & Provide IController Interface
In the IController implementation we provide the search results with the `provideSearchResults(params?: Address): Observable<Address[]>` method. We create a new instance of the AddressEntity as
the country is not managed inside the MultiSearchModule. We pull the country from the Country Select Field in the UI through the ICountry Interface which we specify in the AppComponent.ts.

```typescript
provideSearchResults(params?: Address): Observable<Address[]> {
    let address = new Address(params!.street, params!.zip, params!.city, this.iCountry!.getCountry());
    return this.searchService.search(address);
}
...
export interface ICountry {
  getCountry(): string;
}
```

With the `suggestionTrigger(input: Address): boolean` we define that the suggestions are shown and the `provideSearchResults(params? Address): Observable<Address>[]` is triggered, when
the user has inputted more than 3 characters for the street name and the zip code.

```typescript
suggestionTrigger(input: Address): boolean {
    return input.street.length > 3 && input.zip.length > 3;
}
```

The `setCurrentValidation(status: boolean): void` is a callback method from the MultiSearchModule which shows whether all current inputs of the AddressEntity are currently valid. Through the
IStatus interface, we forward the status to the `AppComponent.ts` to trigger different visual effects on the UI.

```typescript
setCurrentValidation(status: boolean): void {
    this.iStatus?.setStatus(status);
}
...
export interface  IStatus {
  setStatus(status: boolean): void;
}
```

In the `app.module.ts` file, we provide our IController implementation to the MultiSearch Module with the InjectionToken `DATA_PROVIDER`.

```typescript
import {NgModule} from "@angular/core";

@NgModule({
    ...
    providers: [{
        provide: DATA_PROVIDER,
        useClass: AddressController}
    ]
    ...
})
```

## Display Form Suggestions
   In order to trigger the address search suggestions, we configure the input fields by
- Adding the `matInput` attribute
- Defining the input field as form control
- Adding the corresponding property name of the AddressEntity as `aria-label`
- Adding an identifier to the `[search]` attribute. For convenience, we call the identifier the same as the corresponding attribute of the AddressEntity

```html
<mat-form-field ...>
  ...
  <input type="text"
         matInput
         aria-label="zip"
         formControlName="zipInput"
         [search]="zip">
  ...
</mat-form-field>
```

The suggestion themselves are displayed in the search tags below the input field. In the search tags we name the identifier the same as the `[search]` attribute value of the input field and set `"search"` as value. As
content of the search tags we provide an `ng-template` and reference the corresponding property of the AddressEntity inside.

```html
<mat-form-field ...>
  ...
  <search #zip="search">
    <ng-template let-address>{{address.zip}}</ng-template>
  </search>
</mat-form-field>
```

## Component class
In the `AppComponent` class we inject our previously defined `AddressController` and set the `ICountry` interface of the controller in the constructor. As country value in the `ICountry` interface we pull the country from the select field of the UI.

```typescript
constructor(@Inject(DATA_PROVIDER) addressController: AddressController, private fb: FormBuilder){
    const parentThis = this;
    addressController.iCountry = new class implements ICountry {
        getCountry(): string {
            return parentThis.countries.get(parentThis.form.get('countrySelect')?.value!)!;
        }
    };
    ...
}
```

### Initialize Form Fields
With the injected `FormBuilder` in the constructor, we initialize the control elements of our form.

```typescript
constructor(@Inject(DATA_PROVIDER) addressController: AddressController, private fb: FormBuilder) {
    ...
}

initGroup(): FormGroup
{
    return this.fb.group({
        firstNameInput: ['', {validators: [Validators.required, Validators.minLength(3)]}],
        surnameInput: ['', {validators: [Validators.required, Validators.minLength(2)]}],
        ...
    })
}
```

Info: In production, we would set the initial value of the country select field by pulling it from the browser or via the IP address of the website user.

### Handle Checked Results
In the constructor of the `AppComponent` class, we, also, set the `IStatus` interface. Here, we update a local variable to indicate whether the current user input is valid.

```typescript
constructor(@Inject(DATA_PROVIDER) addressController: AddressController, private fb: FormBuilder) {
  ...
  addressController.iStatus = new class implements IStatus {
    setStatus(status: boolean): void {
      parentThis.hasValidAddress = status;
      ...
    }
  }
}
```

From the user Interface, we call the `submit` method where we check the current status. In case the input is valid, we continue with the order process and the correct address details.

```typescript
if (this.hasValidAddress()) {
  //code to continue with valid address data goes here
  console.log(this.form.get("streetInput")?.value + "," + this.form.get('zipInput')?.value + ","
    + this.form.get('cityInput')?.value + "," + this.form.get('countrySelect')?.value)
}
```

### Handle Errors
With the `required` form validators, we do basic checks whether all mandatory values have been inputted into the form fields. When we submit and that's not the case we set a warning text at the bottom of the component.

```typescript
if (this.form.invalid){
  setTimeout(() => this.form.markAllAsTouched());
  this.warning = "Please enter missing values.";
} 
```

We subscribe to the value changes for all the input fields and when the form becomes valid again, we clear the warning text again.

```typescript
ngAfterViewInit(): void {
  this.valueSubscription = this.form.valueChanges.subscribe(() => this.form.invalid ? null : this.warning = "");
}
```

On top, we have the error handling for invalid addresses. For those errors, we set the local boolean value `hasSubmittedAddress` to true and set a warning text, when no valid address is submitted.

```typescript
if (!this.hasValidAddress){
  this.hasSubmittedAddress = true;
  this.warning = "Address is invalid, please check!";
}
```

The boolean values activate the error / valid css class for the address input fields.

```html
<mat-form-field class="zip" appearance="fill" [ngClass]="{'valid': hasValidAddress, 'error': hasSubmittedAddress}">
```

And in the `IStatus` interface we clear the warning text and deactivate the error css class, once something changes in the address input fields.

```typescript
constructor(@Inject(DATA_PROVIDER) addressController: AddressController, private fb: FormBuilder) {
  const parentThis = this;
  ...
  addressController.iStatus = new class implements IStatus {
    setStatus(status: boolean): void {
      ...
      parentThis.hasSubmittedAddress = false;
      parentThis.warning = "";
    }
  }
}
```

## Additional infos

Please check out https://github.com/glasp-api/address-validation-example for an overview on the complete idea of the E2E address validation with GLASP.

The Spring Boot backend which this Angular UI requires is explained at https://github.com/glasp-api/address-validation-example/tree/master/spring-boot.

This Angular example is using a MultiSearch component to link the address input fields. For the details of this component, please have a look at https://github.com/glasp-api/angular-components.

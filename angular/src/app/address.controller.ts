import {Address} from "./address";
import {Injectable} from "@angular/core";
import {SearchService} from "./search.service";
import {Observable} from "rxjs";
import {IController} from "@glasp/multi-search";

@Injectable()
export class AddressController implements IController<Address> {
  iCountry: ICountry | null = null;
  iStatus: IStatus | null = null;

  constructor(private searchService: SearchService) {
  }

  provideSearchResults(params?: Address): Observable<Address[]> {
    let address = new Address(params!.street, params!.zip, params!.city, this.iCountry!.getCountry());
    return this.searchService.search(address);
  }

  suggestionTrigger(input: Address): boolean {
    return input.street.length > 3 && input.zip.length > 3;
  }

  setCurrentValidation(status: boolean): void {
    this.iStatus?.setStatus(status);
  }
}

export interface ICountry {
  getCountry(): string;
}

export interface  IStatus {
  setStatus(status: boolean): void;
}

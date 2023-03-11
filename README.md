# Address Validation Example


With this example, we would like to show how it is possible to use the GLASP API in a shop frontend to improve the data quality for E2E supply chain processes. In today's supply chains most of the parcel carriers in Europe need to map the customer address to a regional hub and from this hub we then have the final mile to the customer. This means you would like to avoid disruptions in the supply chain because the address cannot be mapped or the address is wrongly mapped, avoiding additional effort for your supply chain partners and customer dissatisfaction due to delivery delays. 

The underlying idea is that when the combination of country, city, zip code and street is correct, then our data quality is good enough to reliable map the correct destination hub for different carriers. Yet, we can leave the customer enough freedom to add additional non-validated information, e.g. house numbers or street additions, where we assume potential errors or deviations from our database can be understood with local knowledge much better once the parcel is in the correct street.

## System Setup
GLASP provides access to an address database through a REST API, where the client can search for the closest matches of addresses. The central idea of the closest match search is that the combination of zip code and street name is sufficient to uniquely identify any address. 

In our example, the GLASP user is calling the REST API from a Spring Boot server, which holds the user specific access credentials for the GLASP API and specifies the configurations for the search. The Spring Boot server exposes a REST API which the customer calls from the shop frontend with the requested address data.

As example frontend we have chosen an Angular application which shadows the search suggestions which are related below the street, zip and city input fields and which indicates through a green color when the customer's inputs are valid.

## Further Information

For more information on address validations with GLASP and how to get your free access credentials to the GLASP REST API, please visit our website at https://www.glasp.eu.

For details on the Spring Boot backend, have a look at the Spring Boot example at https://github.com/glasp-api/address-validation-example/tree/master/spring-boot.

Please visit https://github.com/glasp-api/address-validation-example/tree/master/angular for the shop frontend example with Angular. 

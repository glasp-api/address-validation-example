# Spring Boot Address Validation Example
This example is a Spring Boot backend which provides a REST API for validating addresses via the GLASP API.

## Installation
The Spring Boot Maven dependency is the wrapper for accessing the GLASP API.
```html
<dependency>
    <groupId>eu.glasp</groupId>
    <artifactId>address-validation</artifactId>
    <version>1.0</version>
</dependency>
```

## Configuration
In the configuration, a `ValidationService` bean is provided.

```java
@Bean
public ValidationService provideValidationService(){
    return new ValidationServiceBuilder()
        .configureUser([YOUR_GLASP_USERNAME])
        .configurePassword([YOUR_GLASP_PASSWORD])
        .configureTimeout(1500, TimeUnit.MILLISECONDS)
        .build();
}
```

With the `ValidationServiceBuilder` you can specify your GLASP credentials. Please visit https://www.glasp.eu for more details on how to get your free credentials.
The `ValidationServiceBuilder` lets you specify a timeout for the maximum time you would like to wait for the response from the GLASP servers.

## Searching for addresses
We inject the `ValidationService` in our controller class and with the `ValidationService` you can send search requests to the GLASP API.

```java
try {
    List<Address> addresses = this.validationService.search(address); 
} catch(ApiException exception){
    ...
}
```

For more details on the search request and the exceptions, which the API can throw, please have a look at our API documentation at https://glasp.eu/documentation.

## Further Information

For more information on address validations with GLASP, you can check out our overview for the E2E example at [to be added] and our website at https://www.glasp.eu.
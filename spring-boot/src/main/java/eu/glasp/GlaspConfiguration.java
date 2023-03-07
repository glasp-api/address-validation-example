package eu.glasp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class GlaspConfiguration {
    @Bean
    public ValidationService provideValidationService(){
        return new ValidationServiceBuilder()
                .configureUser("[YOUR_GLASP_USERNAME]")
                .configurePassword("[YOUR_GLASP_PASSWORD]")
                .configureTimeout(1500, TimeUnit.MILLISECONDS)
                .build();
    }
}

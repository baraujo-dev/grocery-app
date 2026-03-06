package io.github.baraujo.grocery.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI groceryOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Grocery App API")
                        .description("Backend API for authentication, lists, and items.")
                        .version("v1")
                        .contact(new Contact()
                                .name("Grocery App Team")
                                .email("bruno.teixeira.araujo@gmail.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")));
    }
}

package com.linkme.backend.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI linkmeOpenAPI() {
        return new OpenAPI().info(new Info().title("LinkME API").version("0.0.1").description("LinkME backend APIs"));
    }
}

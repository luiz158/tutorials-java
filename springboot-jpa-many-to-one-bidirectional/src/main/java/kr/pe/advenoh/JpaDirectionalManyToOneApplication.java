package kr.pe.advenoh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class JpaDirectionalManyToOneApplication {

    public static void main(String[] args) {
        SpringApplication.run(JpaDirectionalManyToOneApplication.class, args);
    }

}

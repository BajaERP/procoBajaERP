FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copia primeiro os arquivos de build para aproveitar o cache das dependências.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x ./mvnw \
    && ./mvnw -B dependency:go-offline

COPY src/ src/

# Os testes devem ser executados pelo CI ou separadamente do build da imagem.
RUN ./mvnw -B package -DskipTests \
    && cp target/backend-*.jar /app/app.jar

FROM eclipse-temurin:21-jdk AS development

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x ./mvnw \
    && ./mvnw -B dependency:go-offline

COPY src/ src/

EXPOSE 8080

CMD ["./mvnw", "-B", "spring-boot:run"]

FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

RUN groupadd --system spring \
    && useradd --system --gid spring spring

COPY --from=builder --chown=spring:spring /app/app.jar ./app.jar

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

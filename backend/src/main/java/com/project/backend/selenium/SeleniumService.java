package com.project.backend.selenium;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Service;

/**
 * Serviço base que gerencia o ciclo de vida do WebDriver.
 * Todos os outros serviços de automação estendem ou usam este.
 */
@Service
public class SeleniumService {

    /**
     * Cria um novo WebDriver configurado.
     * Cada automação cria e fecha seu próprio driver (thread-safe).
     */
    public WebDriver criarDriver() {

        ChromeOptions options = new ChromeOptions();

        // Roda sem abrir janela visual no servidor
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");

        // Ignora erros de certificado SSL (útil em sistemas gov)
        options.addArguments("--ignore-certificate-errors");
        options.addArguments("--allow-running-insecure-content");

        // User-agent de browser normal para evitar bloqueios
        options.addArguments(
            "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/120.0.0.0 Safari/537.36"
        );

        return new ChromeDriver(options);
    }

    /**
     * Fecha o driver com segurança.
     */
    public void fecharDriver(WebDriver driver) {
        if (driver != null) {
            try {
                driver.quit();
            } catch (Exception ignored) {}
        }
    }
}
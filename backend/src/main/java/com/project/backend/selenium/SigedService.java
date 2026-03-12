package com.project.backend.selenium;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Automação do sistema SIGED.
 * Realiza login e anexa documentos automaticamente.
 */
@Service
public class SigedService {

    private final SeleniumService selenium;

    // Configure no application.properties:
    // siged.url=https://siged.exemplo.gov.br
    // siged.usuario=seu_usuario
    // siged.senha=sua_senha
    @Value("${siged.url:https://siged.exemplo.gov.br}")
    private String url;

    @Value("${siged.usuario:usuario}")
    private String usuario;

    @Value("${siged.senha:senha}")
    private String senha;

    public SigedService(SeleniumService selenium) {
        this.selenium = selenium;
    }

    /**
     * Anexa um documento no SIGED dado o número do processo.
     */
    public AutomacaoResult anexarDocumento(String numeroProcesso, String caminhoArquivo) {

        WebDriver driver = selenium.criarDriver();

        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));

            // ── 1. Abrir sistema ──────────────────────────────────────
            driver.get(url);

            // ── 2. Login ──────────────────────────────────────────────
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.id("username")   // ← ajuste o seletor conforme o SIGED real
            )).sendKeys(usuario);

            driver.findElement(By.id("password")).sendKeys(senha);
            driver.findElement(By.id("btnLogin")).click();

            // ── 3. Aguardar dashboard carregar ────────────────────────
            wait.until(ExpectedConditions.urlContains("dashboard"));

            // ── 4. Buscar processo ────────────────────────────────────
            WebElement campoBusca = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("campoBusca"))
            );
            campoBusca.clear();
            campoBusca.sendKeys(numeroProcesso);
            driver.findElement(By.id("btnBuscar")).click();

            // ── 5. Abrir processo ─────────────────────────────────────
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".resultado-processo")
            )).click();

            // ── 6. Anexar arquivo ─────────────────────────────────────
            WebElement inputArquivo = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.id("inputAnexo"))
            );
            inputArquivo.sendKeys(caminhoArquivo);
            driver.findElement(By.id("btnAnexar")).click();

            // ── 7. Confirmar ──────────────────────────────────────────
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".mensagem-sucesso")
            ));

            return AutomacaoResult.ok("Documento anexado no SIGED com sucesso!");

        } catch (Exception e) {
            return AutomacaoResult.erro(
                "Erro ao anexar no SIGED",
                e.getMessage()
            );
        } finally {
            selenium.fecharDriver(driver);
        }
    }
}
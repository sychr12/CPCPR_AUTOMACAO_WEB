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
 * Automação do sistema SEFA.
 * Realiza login e anexa documentos automaticamente.
 */
@Service
public class SefaService {

    private final SeleniumService selenium;

    // Configure no application.properties:
    // sefa.url=https://sefa.exemplo.gov.br
    // sefa.usuario=seu_usuario
    // sefa.senha=sua_senha
    @Value("${sefa.url:https://sefa.exemplo.gov.br}")
    private String url;

    @Value("${sefa.usuario:usuario}")
    private String usuario;

    @Value("${sefa.senha:senha}")
    private String senha;

    public SefaService(SeleniumService selenium) {
        this.selenium = selenium;
    }

    /**
     * Anexa um documento na SEFA dado o CPF do produtor.
     */
    public AutomacaoResult anexarDocumento(String cpf, String caminhoArquivo) {

        WebDriver driver = selenium.criarDriver();

        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));

            // ── 1. Abrir sistema ──────────────────────────────────────
            driver.get(url);

            // ── 2. Login ──────────────────────────────────────────────
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.name("usuario")  // ← ajuste o seletor conforme a SEFA real
            )).sendKeys(usuario);

            driver.findElement(By.name("senha")).sendKeys(senha);
            driver.findElement(By.cssSelector("button[type='submit']")).click();

            // ── 3. Aguardar home carregar ─────────────────────────────
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".menu-principal")
            ));

            // ── 4. Navegar para consulta de produtor ──────────────────
            driver.findElement(By.linkText("Produtor Rural")).click();
            driver.findElement(By.linkText("Consultar")).click();

            // ── 5. Buscar por CPF ─────────────────────────────────────
            WebElement campoCpf = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("cpf"))
            );
            campoCpf.clear();
            campoCpf.sendKeys(cpf);
            driver.findElement(By.id("btnConsultar")).click();

            // ── 6. Abrir registro ─────────────────────────────────────
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".linha-resultado")
            )).click();

            // ── 7. Ir para aba de documentos ──────────────────────────
            driver.findElement(By.id("abaDocumentos")).click();

            // ── 8. Fazer upload ───────────────────────────────────────
            WebElement inputArquivo = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.id("uploadDocumento"))
            );
            inputArquivo.sendKeys(caminhoArquivo);
            driver.findElement(By.id("btnSalvarDocumento")).click();

            // ── 9. Confirmar sucesso ──────────────────────────────────
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".alert-success")
            ));

            return AutomacaoResult.ok("Documento anexado na SEFA com sucesso!");

        } catch (Exception e) {
            return AutomacaoResult.erro(
                "Erro ao anexar na SEFA",
                e.getMessage()
            );
        } finally {
            selenium.fecharDriver(driver);
        }
    }
}
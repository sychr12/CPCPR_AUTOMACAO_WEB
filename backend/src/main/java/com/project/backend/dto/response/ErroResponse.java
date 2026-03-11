package com.project.backend.dto.response;

import java.time.LocalDateTime;

public class ErroResponse {
    private final int status;
    private final String mensagem;
    private final LocalDateTime timestamp;

    public ErroResponse(int status, String mensagem) {
        this.status = status;
        this.mensagem = mensagem;
        this.timestamp = LocalDateTime.now();
    }

    public int getStatus() { return status; }
    public String getMensagem() { return mensagem; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
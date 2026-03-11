package com.project.backend.dto.response;

import java.util.List;

public class PageResponse<T> {
    private List<T> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private int pageSize;

    public PageResponse() {}
    public PageResponse(List<T> content, int totalPages, long totalElements, int currentPage, int pageSize) {
        this.content = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }

    public List<T> getContent() { return content; }
    public int getTotalPages() { return totalPages; }
    public long getTotalElements() { return totalElements; }
    public int getCurrentPage() { return currentPage; }
    public int getPageSize() { return pageSize; }
}
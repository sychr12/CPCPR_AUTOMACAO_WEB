package com.project.backend.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class MunicipioService {

    private static final Map<String, String> MUNICIPIOS = new LinkedHashMap<>();

    static {
        MUNICIPIOS.put("ALV", "Alvarães");
        MUNICIPIOS.put("AMT", "Amaturá");
        MUNICIPIOS.put("ANA", "Anamã");
        MUNICIPIOS.put("ANO", "Anori");
        MUNICIPIOS.put("APU", "Apuí");
        MUNICIPIOS.put("ATN", "Atalaia do Norte");
        MUNICIPIOS.put("ATZ", "Autazes");
        MUNICIPIOS.put("BAZ", "Barcelos");
        MUNICIPIOS.put("BAR", "Barreirinha");
        MUNICIPIOS.put("BJC", "Benjamin Constant");
        MUNICIPIOS.put("BER", "Beruri");
        MUNICIPIOS.put("BVR", "Boa Vista do Ramos");
        MUNICIPIOS.put("BOA", "Boca do Acre");
        MUNICIPIOS.put("BBA", "Borba");
        MUNICIPIOS.put("CAP", "Caapiranga");
        MUNICIPIOS.put("CAN", "Canutama");
        MUNICIPIOS.put("CAF", "Carauari");
        MUNICIPIOS.put("CAR", "Careiro");
        MUNICIPIOS.put("CAZ", "Careiro da Várzea");
        MUNICIPIOS.put("CIZ", "Coari");
        MUNICIPIOS.put("COD", "Codajás");
        MUNICIPIOS.put("ERN", "Eirunepé");
        MUNICIPIOS.put("ENV", "Envira");
        MUNICIPIOS.put("FBA", "Fonte Boa");
        MUNICIPIOS.put("GAJ", "Guajará");
        MUNICIPIOS.put("HIA", "Humaitá");
        MUNICIPIOS.put("IPX", "Ipixuna");
        MUNICIPIOS.put("IRB", "Iranduba");
        MUNICIPIOS.put("ITA", "Itamarati");
        MUNICIPIOS.put("ITR", "Itacoatiara");
        MUNICIPIOS.put("ITG", "Itapiranga");
        MUNICIPIOS.put("JPR", "Japurá");
        MUNICIPIOS.put("JUR", "Juruá");
        MUNICIPIOS.put("JUT", "Jutaí");
        MUNICIPIOS.put("LBR", "Lábrea");
        MUNICIPIOS.put("MPU", "Manacapuru");
        MUNICIPIOS.put("MQR", "Manaquiri");
        MUNICIPIOS.put("MAO", "Manaus");
        MUNICIPIOS.put("MNX", "Manicoré");
        MUNICIPIOS.put("MRA", "Maraã");
        MUNICIPIOS.put("MBZ", "Maués");
        MUNICIPIOS.put("NMD", "Nhamundá");
        MUNICIPIOS.put("NOV", "Nova Olinda do Norte");
        MUNICIPIOS.put("PRF", "Presidente Figueiredo");
        MUNICIPIOS.put("RPG", "Rio Preto da Eva");
        MUNICIPIOS.put("SGN", "São Gabriel da Cachoeira");
        MUNICIPIOS.put("STR", "Santa Isabel do Rio Negro");
        MUNICIPIOS.put("SVS", "São Paulo de Olivença");
        MUNICIPIOS.put("SVG", "Santo Antônio do Içá");
        MUNICIPIOS.put("TFR", "Tefé");
        MUNICIPIOS.put("TNF", "Tonantins");
        MUNICIPIOS.put("URS", "Urucará");
        MUNICIPIOS.put("URU", "Urucurituba");
    }

    /** Retorna todos como List<Map> — compatível com ResponseEntity<List<Map<String,String>>> */
    public List<Map<String, String>> getTodos() {
        return MUNICIPIOS.entrySet().stream()
                .map(e -> Map.of("codigo", e.getKey(), "nome", e.getValue()))
                .collect(Collectors.toList());
    }

    public List<Map<String, String>> buscar(String query) {
        String q = (query == null) ? "" : query.toLowerCase().trim();
        return MUNICIPIOS.entrySet().stream()
                .filter(e -> e.getKey().toLowerCase().contains(q)
                          || e.getValue().toLowerCase().contains(q))
                .map(e -> Map.of("codigo", e.getKey(), "nome", e.getValue()))
                .collect(Collectors.toList());
    }
}
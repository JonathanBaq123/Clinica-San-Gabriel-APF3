package com.clinica.sangabriel.controller;

import jakarta.validation.Valid;
import com.clinica.sangabriel.model.Atencion;
import com.clinica.sangabriel.service.AtencionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/atenciones")
public class AtencionController {

    @Autowired
    private AtencionService atencionService;

    @GetMapping
    public ResponseEntity<List<Atencion>> listar() {
        return ResponseEntity.ok(atencionService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<Atencion> crear(@Valid @RequestBody Atencion atencion) {
        return new ResponseEntity<>(atencionService.registrar(atencion), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Atencion> actualizar(@PathVariable Integer id, @Valid @RequestBody Atencion datos) {
        return ResponseEntity.ok(atencionService.actualizar(id, datos));
    }
}

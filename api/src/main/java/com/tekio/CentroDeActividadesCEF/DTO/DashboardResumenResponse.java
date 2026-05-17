package com.tekio.CentroDeActividadesCEF.DTO;

public class DashboardResumenResponse {

    private long sociosActivos;
    private long actividades;
    private long inscripciones;
    private long actividadesCompletas;

    public DashboardResumenResponse(
            long sociosActivos,
            long actividades,
            long inscripciones,
            long actividadesCompletas) {
        this.sociosActivos = sociosActivos;
        this.actividades = actividades;
        this.inscripciones = inscripciones;
        this.actividadesCompletas = actividadesCompletas;
    }

    public long getSociosActivos() {
        return sociosActivos;
    }

    public long getActividades() {
        return actividades;
    }

    public long getInscripciones() {
        return inscripciones;
    }

    public long getActividadesCompletas() {
        return actividadesCompletas;
    }
}
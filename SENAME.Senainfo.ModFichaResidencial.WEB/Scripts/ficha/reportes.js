﻿var IdUsuarioActualizacion;
var reportesData;


$(document).ready(function () {
    CargaInicial();
    
    });

function CargaInicial() {
    IdUsuarioActualizacion = $("#idusuario_conect").val();
    CargaDatosReportes();
    CargaDatosInstitucionesUsuario();

    $(document).on('click', '#btnGenerarReporte', function () {
        if ($("#cmbReporte").val() != 0)
         GenerarReporte();
    });

    /* Spring 4.2 - 20191118 - gcastro */
    $(document).on('click', '#btnLimpiar', function () {
            LimpiarFormularioReportes();
    });

    $("#cmbReporte")
        .change(function () {
            
            var infoReporte = reportesData.find(sel => sel.CodReporte == $(this).val().toString());
            var infoRequerida = $("#infoRequerida");

            if (infoReporte != null) {
                switch (infoReporte.RequiereCodProyecto) {
                    case "S":
                        infoRequerida.text('Este Reporte requiere que selecciones una Institución y Proyecto.').change();
                        break;
                    case "N":
                        infoRequerida.text('Este Reporte no requiere parametros adicionales.').change();
                        break;
                    default:
                        infoRequerida.text('El Tiempo de Carga de la información dependerá de la cantidad de registros.').change();
                        break;
                }
            }
            else
                infoRequerida.text('El Tiempo de Carga de la información dependerá de la cantidad de registros.').change();

        });

}

///////////////////
//FUNCIONES MISCELANEAS
function InicializaCombo(cmb) {
    $(cmb).html("");
}

//INICIALIZACIÓN DE ELEMENTOS DE PAGINA
//FUNCIONES DE INICIALIZACIÓN COMBOS

function CargaDatosInstitucionesUsuario() {
    
    $.ajax({
        type: "POST",
        url: "FichaResidencial.aspx/ObtenerInstitucionesUsuario",
        data: "{'IdUsuario': '" + IdUsuarioActualizacion + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            // Ajax OK !                   
        },
        error: function (r) {
            DesplegarExcepcionCriticaApp(r.responseText);
        }
    }).then(function (r) {
       
        var institucion = $("#cmbInstitucion");
        InicializaCombo("#cmbInstitucion");
        institucion.append("<option value='0'>Seleccionar una Institución</option>");

        var proyecto = $("#cmbProyecto");
        InicializaCombo("#cmbProyecto");
        proyecto.append("<option value='0'>Seleccionar un Proyecto</option>");

        if (r.d[0] != null)
        if ((r.d[0].error) == "") {
            if (r.d != "") {
                
                $.each(r.d,
                    function () {
                        institucion.append("<option value='" + this.CodInstitucion + "'>" + this.NombreInstitucion + "</option>");
                    }
                );
                document.getElementById("cmbInstitucion").disabled = false;
                if (r.d.length == 1) {
                    
                    $("#cmbInstitucion").prop('selectedIndex', 1);
                    CargaProyectosInstitucion($("#cmbInstitucion").val());
                }
            }
        }
        else {
            document.getElementById("cmbInstitucion").selectedIndex = 0;
            document.getElementById("cmbInstitucion").disabled = true;

            DesplegarExcepcionCriticaApp(r.d[0].error);
        }
    });
}
function CargaProyectosInstitucion(codigoInstitucion) {
    //alert(codigoInstitucion + " - " + IdUsuarioActualizacion);
    document.getElementById("cmbProyecto").disabled = true;
    $.ajax({
        type: "POST",
        url: "FichaResidencialObservaciones.aspx/ObtenerProyectosXInstitucionYUsuario",
        data: "{'IdUsuario':'" + IdUsuarioActualizacion + "','codigoInstitucion':'" + codigoInstitucion + "' }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            // Ajax OK !                   
        },
        error: function (r) {
            DesplegarExcepcionCriticaApp(r.responseText);
        }
    }).then(function (r) {
        var proyecto = $("#cmbProyecto");
        InicializaCombo("#cmbProyecto");
        proyecto.append("<option value='0'>Seleccionar</option>");

        if (r.d[0] != null)
        if (r.d != "") {
            $.each(r.d,
                function () {
                    $("#cmbProyecto").append("<option value='" + this.CodProyecto + "'>" + this.NombreProyecto + "</option>");
                }
            );
            document.getElementById("cmbProyecto").disabled = false;
        }
    });
}

function CargaDatosReportes() {
    

    $.ajax({
        type: "POST",
        url: "FichaResidencialReportes.aspx/ListarReportes",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            // Ajax OK !                   
        },
        error: function (r) {
            DesplegarExcepcionCriticaApp(r.responseText);
        }
    }).then(function (r) {
        //alert("What!!!");
        var reporte = $("#cmbReporte");
        InicializaCombo("#cmbReporte");
        reporte.append("<option value='0'>Selecciona un Reporte</option>");
        
        if (r.d[0] != null)
        if ((r.d[0].error) == "") {
            if (r.d != "") {
                reportesData = r.d;
                
                $.each(r.d,
                    function () {
                            reporte.append("<option value='" + this.CodReporte + "'>" + this.Descripcion + "</option>");
                    }
                );
                
            }
        }
        else {
            document.getElementById("cmbReporte").selectedIndex = 0;
            document.getElementById("cmbReporte").disabled = true;

            DesplegarExcepcionCriticaApp(r.d[0].error);
        }
    });
}

function GenerarReporte() {

    var idusuario = IdUsuarioActualizacion;
    var codproyecto = $("#cmbProyecto").val();
    var codreporte = $("#cmbReporte").val();

    window.location = "FichaResidencialReporteHandler.ashx?idusuario=" + idusuario + "&codreporte=" + codreporte + "&codproyecto=" + codproyecto;

}

// gc09422
function LimpiarFormularioReportes() {
    document.getElementById("cmbInstitucion").selectedIndex = 0;          
    document.getElementById("cmbProyecto").selectedIndex = 0; 
    document.getElementById("cmbReporte").selectedIndex = 0; 
}

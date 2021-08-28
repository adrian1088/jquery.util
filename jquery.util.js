/* ========================================================================
 * Jquery: jquery.util.js v1.0.0 
 * ========================================================================
 * Copyright 2016-2017 Jose Maldonado.
 * ======================================================================== */

(function ($) {
    'use strict';

    if (!$.browser) {
        $.browser = {};
        $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
        $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    }

    //funcion de prueba
    $.fn.helloWorld = function (options) {
        //opciones por defecto
        var settings = $.extend({
            text: 'Hello, World!',
            color: null,
            fontStyle: null
        }, options);

        this.each(function () {
            $(this).text(settings.text);
        });
    }

    //para saber si existe elemento 
    $.fn.exists = function () { return this.length > 0; }

    //ontener nombre de las etiquetas html
    $.fn.tagName = function () {
        return this.prop("tagName").toLowerCase();
    };

    //validador de formularios
    $.fn.validateForm = function (options) {
        // Opciones por defectos
        var settings = $.extend({
            attr: "name",
            nameField: "label"
        }, options);

        //Variables
        var self = this,
        guadar = true,
			_this = "",
			id = "",
			val = "",
			attr = "",
			dataVal = "",
			dataSize = 0,
			label = "",
			msg = "",
            type = "";

        self.find(':input:not(button)').each(function () {//[type="hidden"]            
            _this = this;
            id = _this.id;
            val = _this.value;
            attr = _this.getAttribute(settings.attr);
            dataVal = _this.getAttribute("data-valid");
            dataVal = dataVal == null ? "" : dataVal;
            dataSize = _this.getAttribute("data-size");

            if (settings.nameField == "data-field") {
                label = _this.getAttribute("data-field");
            } else if (settings.nameField == "placeholder") {
                label = _this.getAttribute("placeholder");
            } else if (settings.nameField == "label") {
                label = $("label[for='" + this.id + "']").text();
            }

            type = _this.getAttribute('type');

            if (this.id != "" && (dataVal != undefined || dataVal != "" || dataVal != null)) {
                switch ($(this).tagName()) {
                    case 'input':
                        if (type == "text") {                            
                            if (val.length <= 0 && dataVal.indexOf("_R") > -1) {
                                guadar = false;                               
                                msg = "El campo " + label + " es obligatorio...!";
                                //alert(msg);                               
                                modalGenerico('#mdlGenerico', "Mensaje de error", msg);
                                this.focus();
                                return false
                            }
                        }
                        break;
                    case 'select':
                        if (this.value == 0 && dataVal.indexOf("_R") > -1) {
                            guadar = false;                            
                            msg = "Debe seleccionar una opción del campo " + label + "..!";
                            //alert(msg);                           
                            modalGenerico('#mdlGenerico', "Mensaje de error", msg);
                            this.focus();
                            return false
                        }
                        break;
                    default:
                        ""
                        break;
                }
            }
            /*else if (dataVal.indexOf("_T") > -1 && val.length > 0) {
                    if (validarAreaCode(val) == false) {
                        guadar = false;
                        this.focus();
                        msg = "El campo " + label + " es telefonico debe completar Ej. (809) 123-4567...!";
                        swal("Error", msg, "error")
                        return false
                    }
                }*/
            //else if (val.length > 0) {
            //    if (val.length < dataSize && dataSize != undefined) {
            //        guadar = false;
            //        this.focus();
            //        msg = "El campo " + label + " esta incompleto...!";
            //        swal("Error", msg, "error")
            //        return false
            //    }
            //}				
        });
        return guadar
    }

    //funcion para obtener los las claves => valores de los controles de un formulario o div
    $.fn.getFieldForm = function (options) {
        // Opciones por defectos
        var settings = $.extend({
            attr: "name"
        }, options);

        var self = this,
         item = {},
         tagName = $(this).tagName(),
         idControl = "",
         name = "",
         value = "";

        this.each(function () {
            //if (tagName != "form") {
            //    console.error("Error: El elemento seleccionado no es una etiqueta <form></form>");
            //    return false;				
            //}

            idControl = this.id;

            //$("#" + id + " :input")
            self.find(" :input").not("button").each(function () {
                name = this.getAttribute(settings.attr);
                value = $(this).val();
                item[name] = value;
            });
        });

        return item;
    }

    //funcion para llenar los campos de un form o div genericamente
    $.fn.setDataLabel = function (data, options) {
        // Opciones por defectos
        var settings = $.extend({
            attr: "name",
            tag: "label"
        }, options);

        var self = this;
        var tag = "";
        var id = "";

        return this.each(function () {
            id = this.id;
            alert("hola")

        });
    }

    //
    $.fn.getCombox = function (options) {
        //opciones por defecto
        var settings = $.extend({
            url: '',
            attr: 'id',
            attrElement:''
        }, options);

        var m = {}
        var dataValid = "";
        var name = "";
        var element = "";

        return this.each(function () {
            name = $(this).attr(settings.attr);

            if (settings.attrElement == "") {
                if (settings.attr == "name") {
                    element = "[name=" + name + "]"
                } else {
                    element = "#"+this.id
                }
            } else {
                element = settings.attrElement;
            }

            dataValid = this.getAttribute("data-valid") ? this.getAttribute("data-valid") : "";

            if (dataValid.indexOf("_NO") < 0 ) {
                $.ajax({
                    type: 'POST',
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    url: settings.url,
                    data: "{'combo':'" + name + "'}"
                })
                   .done(function (data) {
                       m = JSON.parse(data.d);
                       if (m[0].Error == 0) {
                           $(element).empty();
                           $.each(m, function (i, v) {
                               if (m[i].Id != undefined && m[i].Name != undefined) {
                                   $(element).append($('<option></option>').val(m[i].Id).html(m[i].Name));
                               }
                           });
                       }
                   });
            }
        });
    }

    //funcion para limpiar campo de un formulario
    $.fn.clearForm = function (options) {
        //opciones por defecto
        var settings = $.extend({
            attr: "id"
        }, options);

        var idForm = "";
        var field = "";
        var oForm = {};
        var tagName = "";
        var type = "";

        idForm = this.id;

        this.find(":input").each(function () {
            tagName = $(this).tagName()
            type = this.type
            field = this.name;

            $(".clear").empty();
            console.log("Type: " + type + " id: " + field)
            switch (tagName) {
                case 'input':

                    if (type == "text") {
                        this.value = "";

                        //if (datatype != undefined) {
                        //    if (datatype.indexOf('_N') >= 0) {
                        //        this.value = 0;
                        //    }
                        //}
                    }
                    //else if (this.type == "checkbox") {
                    //    $(this).attr("checked", false);
                    //    $("#" + $(this).data("option") + "").text('Seleccione');
                    //}
                    break;
                case 'select':
                    $(this).prop('selectedIndex', 0);
                    break;
            }
        });
    }
    
    //funcion para subir archivos por ajax
    $.fn.fileupload = function (url, opt) {
        //Main Authors: Omar De la Rosa And Jose Maldonado!!!
        //Date: 17/3/2015

        /*
        Ours variables...
        */
        var $this = this, //this...
        $fobject = this.find("input[type='file']"), //input type file that contains the files...       
       
        min = 0, //for configurations...
        now = 0, //current [index] file
        
        current = 0, //current index of the file to be processed
        url = url || "", //where we goin to send the file? ahhhhh url......
        imgToUpload = {}, //collection of images to be processed
        Api = {}; //for now it is just for delete a image from de collection.....

        var myUpload = "";

        //Make the API
        //Api.remove = function (index) {
        //    if (index)
        //        delete imgToUpload[index];
        //}

        //if (url == undefined) { //if we do not pass the url then this return the API..
        //    return Api;
        //}

        //Overloads/Functions
        var opt = opt || {};
        opt.success = opt.success || function () { }
        opt.error = opt.error || function () { }
        opt.complete = opt.complete || function () { }
        opt.beforeUpload = opt.beforeUpload || function () { }
        //Overloads/vars
        opt.interval = opt.interval || 500;
        opt.cancellable = opt.cancellable || false; //not used for now...
        opt.noElement = opt.noElement; //|| 0;
        console.log('Hola: '+opt.objElement.id)

        var max = document.getElementById(opt.objElement.id).files.length; //total files
        var files = document.getElementById(opt.objElement.id).files; //files...
        //Set the xhrhttp to AJAX and the form data
        var xhrhttp = new XMLHttpRequest();
        var fData = new FormData();

        //$fobject.change(function () {
        //    for (i = 0; i < $object[0].files.length; i++) {
        //        imgToUpload[i] = $object[0].files[i];
        //    }
        //})

        //Main Function
        var upload = function () {

            xhrhttp.onreadystatechange = function () {
                if (xhrhttp.readyState == 4 && xhrhttp.status == 200) {                   

                    opt.success(files[current].name, xhrhttp.responseText, now);

                } else if (xhrhttp.status != 200 && xhrhttp.readyState != 1) {
                    opt.error(files[current].name, xhrhttp.responseText, now);

                    if (opt.cancellable) {
                        clearInterval(myUpload); //No more uploads
                        opt.complete(xhrhttp.responseText);
                    }
                }
            } //onreadystatechange

            fData.append(files[current].name, files[current]);
            xhrhttp.open("POST", url, false);
            xhrhttp.setRequestHeader("Cache-Control", "no-cache");
            xhrhttp.send(fData);
            //Clean Vars
            fData = null;
            xhrhttp = null;
            ////Update Vars
            fData = new FormData();
            xhrhttp = new XMLHttpRequest();
            current = current + 1;

            if (current >= max) {
                clearInterval(myUpload)
                opt.complete(xhrhttp.responseText);
            }
        }

        //Call Function
        myUpload = setInterval(upload, parseInt(opt.interval));

        return this;
    }

}(jQuery));
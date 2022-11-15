addEventListener('DOMContentLoaded', iniciarPagina);
function iniciarPagina(){
    let contenedor_ajax = document.querySelector("#use-ajax");
    //Dentro de esta función debe ir todo el código JS para que se ejecute luego de que se haya cargado el DOM
    async function cargar_contenido(id_pagina){
        contenedor_ajax.innerHTML = "<h1>Loading...</h1>"
        try{
            let response = await fetch(`${window.location.origin}/${id_pagina}.html`);
            if(response.ok){
                let contenido = await response.text();
                push(id_pagina);
                contenedor_ajax.innerHTML = contenido;
                leer_btns_links(id_pagina);
            }
            else{
                contenedor_ajax.innerHTML = "<h1>Error, failed URL!</h1>";
            }
        }
        catch(error){
            contenedor_ajax.innerHTML = "<h1>Error, conection failed!</h1>"+error;
        }
    }
    function push(id_pagina){
        document.title = id_pagina; //cambia el titulo de la pagina
        window.history.pushState({id_pagina},`${id_pagina}`, `/${id_pagina}`);
    }
    window.addEventListener('load', function(e){//al cargarse la ventana se invoca a la funcion pasandole como parametro el id de la primer pagina 
        cargar_contenido("Apocalipsis");
        document.querySelectorAll('.menu')
            .forEach(link=>link.addEventListener('click', function(e){
                let id_page = link.getAttribute('id');
                cargar_contenido(id_page);
            }))
    });
    function leer_btns_links(id_pagina){
        if(id_pagina==="ZombieTest"){
            let botonComprobar = document.querySelector('#btnComprobarCaptcha'); 
            botonComprobar.addEventListener("click", validarCaptcha);
            generaCaptcha();
        }else if(id_pagina==="Supervivencia"){
            mostrar_tabla();
        }
        let links_redireccion = document.querySelectorAll(".redireccionar");
        links_redireccion.forEach(link_r=>link_r.addEventListener('click',function(e){
            e.preventDefault();
            let id = this.getAttribute("id");
            cargar_contenido(id);
        }));
        let links_desplegar = document.querySelectorAll(".desplegarNoticia");
        links_desplegar.forEach(link=>link.addEventListener('click',function(e){
            let href = this.getAttribute("href");
            desplegar_noticia(href);
        }));
        let btns_cerrar_nota = document.querySelectorAll(".btnCerrarNoticia");
        btns_cerrar_nota.forEach(button=>button.addEventListener('click', function(e){
            cerrarNoticia(button);
        }));
    }
    //para desplegar el menu y las noticias
    let boton_menu = document.querySelector('.logoMenu');
    let menu_desplegable = document.querySelector('.nav_oculto');
    boton_menu.addEventListener('click', desplegarMenu);
    //Desplegar menu
    function desplegarMenu(){
        menu_desplegable.classList.toggle("nav_oculto");
    }
    //Desplegar Noticias
    function desplegar_noticia(href_noticia){
        let noticias_ocultas = document.querySelectorAll(".oculto");
        noticias_ocultas.forEach(noticia=>{
            let id_noticia = `#${noticia.getAttribute("id")}`;
            if(id_noticia===href_noticia)
                noticia.classList.toggle('oculto');
        });
    }
    //Cerrar Noticias
    function cerrarNoticia(button_cerrar){
        let noticia = button_cerrar.parentElement;
        noticia.classList.toggle('oculto');
    }
    //Captcha
    const MAX = 5;
    let intento = 0;
    let textoCaptcha=""; 
    //la funcion generaCaptcha genera un captcha al azar a partir del array, lo almacena en nuevoCaptcha y lo imprime
    function generaCaptcha(){ 
        let nuevoCaptcha = document.querySelector('#captcha'); //label donde se genera nuevo captcha
        let array = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0'];
        textoCaptcha="";
        let index = 0;
        for(let i=0; i < 8; i++){
            index = Math.floor(Math.random()*array.length); 
            textoCaptcha += array[index];  
        }
        nuevoCaptcha.innerHTML = textoCaptcha; 
    }
    //la funcion validarCaptcha comprueba que si el texto no coincide con el captcha te vuelva a reiniciar todo
    function validarCaptcha(){
        let captcha=false;
        let ingresoTexto = document.querySelector('#ingresoCaptcha');
        let verificaCaptcha = document.querySelector('#textoVerificaCaptcha');
        let textoIngresado = ingresoTexto.value;
        if (textoIngresado!== textoCaptcha){ //entra al if si el texto no coincide con el captcha
            if (intento< MAX){  //en caso de que no se hayan acabado los intentos
                let intentosRestantes=(MAX - intento); 
                intento++; 
                verificaCaptcha.innerHTML = "Captcha ingresado de manera incorrecta. Restan " + intentosRestantes + " intentos.";
                generaCaptcha(); 
                ingresoTexto.value = "";       
            }else{
                verificaCaptcha.innerHTML = "Se acabaron los intentos.";   
            }
        }else{
            captcha=true; //si es correcto captcha se vuelve true para que pueda ver el resultado del formulario.
            verificaCaptcha.innerHTML = "Captcha correcto";
            verificarFormulario(captcha); //si el captcha es correcto llamo a verificar formulario, sino no. 
        }
    }
    /*FORMULARIO*/
    function verificarFormulario(captcha){
        if(captcha){  //si el captcha es correcto ingresa al formulario AutoTest (formData)
            let formTest = document.querySelector('#formularioTest');
            let datos_FormTest = new FormData(formTest); //obtengo los datos del formulario
            formTest.addEventListener('submit', function(e){
                e.preventDefault();
                evaluarRespuestas(datos_FormTest, formTest);
            });
        }        
    } 
    function evaluarRespuestas(datos_FormTest, formTest){
        let respuestasValidas = 0;
        let respuestaTest;
        for (let i=1; i<formTest.length-1; i++){
            respuestaTest = datos_FormTest.get("selectPregunta"+i);
            if(respuestaTest === 'si'){
                respuestasValidas++;
            }
        }
        mostrarDatosTest(datos_FormTest, respuestasValidas);
    }
    function mostrarDatosTest(datos_FormTest,respuestas_si){
        //obtengo los datos ingresados en el form segun name de cada input
        let nombreApellido = datos_FormTest.get('nombreApellido');
        let texto_bienvenida = document.querySelector('#textoBienvenida');
        let resultadoTest = document.querySelector('#textoResultadoTest');
        texto_bienvenida.innerHTML = "Bienvenido: "+nombreApellido;
        if(respuestas_si >= 5){
            resultadoTest.innerHTML = "TEST ZOMBIE, POSITIVO. Lo siento, ya te has contagiado el virus. Por el momento no hay cura, la mejor opción es aislarte. Deberás buscar un refugio y asi poder salvar a tus seres queridos.";
        }else{
            resultadoTest.innerHTML = "TEST ZOMBIE, NEGATIVO.";
        }
    }




    //TABLA
    const url = ('https://636d66ac91576e19e327a516.mockapi.io/api/v1/Zonas');
    
    let id_zona;
    let ids = [];
    async function obtenerDatos(){
        try{
            let response = await fetch(url);
            if(response.ok){
                let json = await response.json();
                return json;
            }
            else{
                console.log(error);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    function mostrar_head_tabla(){
        const head_tabla = `<tr><th>ZONA</th><th>UBICACIÓN</th><th>SEGURIDAD</th><th>COORDENADA</th><th>DEL</th><th>MOD</th></tr>`;
        const head = document.querySelector("#thead_tabla");
        head.innerHTML = head_tabla;
    }
    async function mostrar_tabla(){
        mostrar_head_tabla();
        const img_delete = `<img src="../Images/borrar.png">`;
        const img_editar = `<img src="../Images/editar.png">`;
        let datosZonas = document.querySelector("#tbody_tabla");
        let mostrar_zona="";
        ids = [];
        try{
            let Zonas = await obtenerDatos();
            if(Zonas.length>0){
                await Zonas.forEach(Zona=>{
                    id_zona = Zona.id;
                    ids.push(id_zona);
                    let zona = Zona.zona;
                    let ubicacion = Zona.ubicacion;
                    let seguridad = Zona.seguridad;
                    let coordenadas = Zona.coordenadas;
                    if(seguridad==="true" || seguridad===true)
                        seguridad = "Roja";
                    else    
                        seguridad = "Segura";
                    mostrar_zona+= `<tr id="tr${id_zona}"><td>${zona}</td><td>${ubicacion}</td><td>${seguridad}</td><td>${coordenadas}</td><td><button class="btn_delete" value="${id_zona}">${img_delete}</button></td><td><button class="btn_editar" value="${id_zona}">${img_editar}</button></td></tr>`;
                    datosZonas.innerHTML = mostrar_zona;
                });
                console.log("ultimo id almacenado "+id_zona);
                resaltar_zonas_rojas(Zonas);
            }else{
                datosZonas.innerHTML ="";
            }
        } 
        catch(error){
            console.log(error);
        }
        escuchar_btns_formulario();
    }
    function resaltar_zonas_rojas(Zonas){ 
        Zonas.forEach(Zona=>{
            if(Zona.seguridad==="true" || Zona.seguridad===true){
                let zona_roja = document.querySelector(`#tr${Zona.id}`);
                zona_roja.classList.toggle('Zona_roja');
            }
        })
        escuchar_btns_filas();
    }
    function escuchar_btns_filas(){
        let btns_del = document.querySelectorAll('.btn_delete');
        let btns_mod = document.querySelectorAll('.btn_editar');
        btns_del.forEach(btn=>{btn.addEventListener('click', function(){
            borrar_zona(btn.value);
            })
        });
        btns_mod.forEach(btn=>{btn.addEventListener('click', function(){
            precarcar_edicion(btn.value);
            })
        });
    }
    function escuchar_btns_formulario(){
        //lee desde el DOM
        let btn_vaciar_tabla = document.querySelector("#btnVaciarTabla");
        let btn_x3 = document.querySelector('#btn_x3');
        let btn_borrar_ultimo = document.querySelector("#btnBorrarUltimo");
        let btn_enviar_tabla = document.querySelector('#btnEnviarTabla');
        //addEventListener
        btn_x3.addEventListener('click', Agregarx3);
        btn_vaciar_tabla.addEventListener('click', function(){vaciarTabla()});
        btn_borrar_ultimo.addEventListener('click',function(){borrar_zona(id_zona)});
        btn_enviar_tabla.addEventListener('click',function(){
            let jsonInput = leer_inputs();
            postTabla(jsonInput);//crea uno nuevo entonces hace POST a diferencia del modificar que hace PUT
        });
    }
    function leer_inputs(){
        let zonaInput = document.querySelector('#inputZona').value;
        let ubicacionInput = document.querySelector('#inputUbicacion').value;
        let seguridadInput = document.querySelector('#inputSeguridad').value;
        let coordInput = document.querySelector('#inputCoordenada').value;
        let jsonInput = {
            "zona" : zonaInput,
            "ubicacion": ubicacionInput,
            "seguridad": seguridadInput,
            "coordenadas": coordInput
        }
        return (jsonInput);
    }
    function vaciarTabla(){
        ids.forEach(async id=>{
            let response = await fetch(`${url}/${id}`,{
                "method":"DELETE"
            });
            console.log(response.status);
        })
        let datosZonas = document.querySelector("#tbody_tabla");
        datosZonas.innerHTML = "";
    }
    async function borrar_zona(id_zona){
        let id_borrar = id_zona;
        try{
            let response = await fetch(`${url}/${id_borrar}`,{
                "method":"DELETE"
            });
            if(response.status ===200){
                mostrar_tabla();
            }
            else{
                console.log(response.status);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    async function Agregarx3(){ //función que agrega 3 filas de la tabla de manera aleatoria
        let index=0;
        try{
            if(ids.length>0){
                for(let i=0; i<3; i++){
                    index = Math.floor(Math.random()*ids.length);
                    let id = ids[index];
                    let jsonNuevo = await fetch(`${url}/${id}`);
                    if(jsonNuevo.ok){
                        let NuevaZona = await jsonNuevo.json();
                        postTabla(NuevaZona); 
                    }
                    else{
                        console.log(NuevaZona.status)
                    }
                }
            }else{
                postNuevox3();
            }
        }catch(error){
            console.log(error);
        }
    }
    async function postNuevox3(){ //solo ingresa en caso de que la tabla este vacia
        try{
            for(let i = 0; i<3; i++){
                let response = await fetch(url,{
                    "method":"POST",
                    "headers":{'Content-Type': 'application/json'},
                    "body": `{
                        "zona":"95",
                        "ubicacion":"Argentina",
                        "seguridad": true,
                        "coordenadas": "South"
                    }`
                });
                if(response.status === 201){
                    console.log("Zona agregada");
                    mostrar_tabla();
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }
    async function precarcar_edicion(id_editar){
        let zonaInput = document.querySelector('#inputZona');
        let ubicacionInput = document.querySelector('#inputUbicacion');
        let seguridadInput = document.querySelector('#inputSeguridad');
        let coordInput = document.querySelector('#inputCoordenada');
        let btn_mod_fila = document.querySelector("#btnModificarTabla");
        try{
            let response = await fetch(`${url}/${id_editar}`);
            if(response.ok){
                let fila_zona = await response.json();
                zonaInput.value = fila_zona.zona;
                ubicacionInput.value= fila_zona.ubicacion;
                seguridadInput.value= fila_zona.seguridad;
                coordInput.value = fila_zona.coordenadas;  
                btn_mod_fila.addEventListener('click', function(e){
                    e.preventDefault();
                    let zona_editar = {
                        "zona" : zonaInput.value,
                        "ubicacion" : ubicacionInput.value,
                        "seguridad": seguridadInput.value,
                        "coordenadas": coordInput.value
                    }
                    putTabla(zona_editar, id_editar)});
            }
            else{
                console.log(response.status);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    function putTabla(zona_nueva,id_editar){  //hace un post con los datos ingresados del formulario
        let response = fetch(`${url}/${id_editar}`,{
                "method":"PUT",
                "headers":{'Content-Type': 'application/json'},
                "body": JSON.stringify(zona_nueva)
        }).then(function(e){
            console.log(e, response);
            mostrar_tabla();
        })
    } 
    async function postTabla(zona_cargar){  //hace un post con los datos ingresados del formulario
        try{
            let response = await fetch(url,{
            "method":"POST",
            "headers":{'Content-Type': 'application/json'},
            "body": JSON.stringify(zona_cargar)
            })
            if(response.ok){
                mostrar_tabla();
            }
        }
        catch(error){
            console.log(error);
        }
    }  
}
    
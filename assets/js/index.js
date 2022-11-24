async function obtenerDatosDiaActual (){
    const res = await fetch("https://mindicador.cl/api");
    const data = await res.json(); 
    
    return data;

  
}  

async function obtenerDatosHistorico(moneda, fecha){
    
    const res = await fetch ('https://mindicador.cl/api/'+moneda +'/'+fecha);
    const data = await res.json(); 
    
    return data;
}



async function construyeSelect(){
    const data = await obtenerDatosDiaActual();
    console.log(1);
    const monedas = (Object.keys(data)); //se piden las propiedades de un objeto.
    console.log(monedas);
    let html='<select name="moneda" id="moneda">';
    for (const codigo_moneda of monedas) {
        console.log("x");
        const moneda = data[codigo_moneda];
        console.log(moneda.unidad_medida);
        if(moneda.unidad_medida == 'Pesos') {
            console.log(moneda.nombre);       
            html+= `<option value="${moneda.codigo}-${moneda.valor}">${moneda.nombre}</option>`; 
        }
    }
    html += '</select>'

    const selector = document.querySelector('#selector');
    selector.innerHTML = html;
}



// grafico

function dibujaGrafico(fechas, valores){
    const ctx = document.querySelector('#miGrafico');
    
    const data = {
        labels: fechas,
        datasets: [{
        label: 'Historico',
        data: valores,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};

new Chart(ctx, {
    type: 'line',
    data: data,
});

}
const botonCalcular = document.querySelector('#calcular');

botonCalcular.addEventListener('click', async function(){
    const valor = document.querySelector('#valor').value;
    tasaYMoneda = document.querySelector('#moneda').value.split('-');
    
    const valorConvertido = valor / tasaYMoneda[1];
    const spanResultado = document.querySelector ('#resultado');
    spanResultado.innerHTML = valorConvertido.toFixed(3);
  
    const codigoMoneda = tasaYMoneda[0];
    const fechaActual = new Date();
    let fechas=[];
    let valores =[];

    let ultimoValor = 0;
    for(i = 10;i > 0;i--){
        const dia = fechaActual.getDate()-i;
        const mes = fechaActual.getMonth()+1;
        const aso = fechaActual.getFullYear();

        const fechaConsulta = `${dia}-${mes}-${aso}`;

        const dataHistorica = await obtenerDatosHistorico(codigoMoneda,fechaConsulta);
        
        fechas.push(fechaConsulta);
        console.log(dataHistorica);
        if(dataHistorica.serie.length > 0){
            valores.push(dataHistorica.serie[0].valor);
            ultimoValor = dataHistorica.serie[0].valor;
        } else {
            valores.push(ultimoValor);
        }
    }

    dibujaGrafico(fechas, valores);
});

construyeSelect();
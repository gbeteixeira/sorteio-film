//quando o btn de sortear for clicado 
$("#sortear").click(function (e) {

    e.preventDefault();

    //limpa resultados anteriores
    $('#imgFilme').addClass('oculto'); //oculta a img do filme
    $('#Title').addClass('oculto'); //oculta o titulo do filme

    //valores inseridos no text area
    let valSorteio =  $('#filmes').val();

    //verifica se a variavel valSorteio não está vazia
    if(valSorteio == '') {

        //notifica no front
        notificar('danger', '<strong>Erro!</strong> Você precisa digitar algo para enviar...');
        return;
        
    }

    //habilita o spinner de carregamento 
    $('#carregando').removeClass('oculto');


    //chama a função de sorteio após 200 milessegundos
    setTimeout(function() { getSorteio(valSorteio); }, 200);


});

//realiza o sorteio
function getSorteio(valSorteio) {

    //lista dos dados um embaixo do outro
    let list = valSorteio.split('\n');

    //limpando a lista dos valores, retirando valores em branco
    list = cleanArray(list);

    //realiza o sorteio
    let valSelecionado = list[Math.floor(Math.random() * list.length)];

    //chama a funcao que retorna os dados do filme
    getFilm(valSelecionado);

}

//function busca a thumb do filme na api
function getFilm(filme) {

    //faz consulta a api publica do OMDBAPI, utilizando ajax
    $.ajax({
        type: "GET",
        url: "http://www.omdbapi.com/?t=" + encodeURIComponent(filme) +'&apikey=',
        dataType: 'json',
        beforeSend: function(response) {  

           //notifica no front
           //notificar('warning', '<strong>Aguarde!</strong> Estamos realizando o sorteio...');

        },
        success: function(response) {

            //notifica no front
            notificar('success', '<strong>Sucesso!</strong>');

            if (response['Response'] != "False") {

                //passa os dados para o front-end
                $("#imgFilme").attr("src", response['Poster']); //img do filme
                $("#Title").text(response['Title']);

                //oculta spinner de carregamento
                $('#carregando').addClass('oculto');

                //remove a class qq oculta 
                $('#result').removeClass('oculto'); 
                $('#imgFilme').removeClass('oculto'); 
                $('#Title').removeClass('oculto');

                return;

            } else {

                //oculta spinner de carregamento
                $('#carregando').addClass('oculto');

                //apenas imprime o valor sorteado
                $('#imgFilme').addClass('oculto'); //oculta a img do filme

                //imprime valor sorteado
                $('#Title').removeClass('oculto'); //remove class oculta
                $("#Title").text(filme);

                return;

            }

        },
        error: function (error) {

            console.log(error.responseText);

        }

    });

}

//funcao de notificar
function notificar(situacao, mensagem) {

    //notificação 
	let notify = $.notify('<strong>Aguarde...</strong>', {
	    type: 'warning',
	    allow_dismiss: true
    });

    //notifica
    notify.update('type', situacao);
    notify.update('message', mensagem);


}

//função que remove dados em branco de um array
function cleanArray(actual) {

    let newArray = new Array();
      
      for (var i = 0; i < actual.length; i++) {

        if (actual[i]) {

              newArray.push(actual[i]);

        }

      }
      //retorna sem os valores em branco
      return newArray;
}

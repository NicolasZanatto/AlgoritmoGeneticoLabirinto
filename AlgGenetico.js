var AlgoritmoGenetico = function(){
	
	//Coordenadas
	//00 - leste
	//01 - norte
	//10 - oeste
	//11 - sul

	var solucao = {A: [0,0,0,0,0,1,0,1,0,1,0,0], 
				   B: [0,1,0,1,0,1,0,0,0,0,0,0]};
   	var taxaCrossover = parseFloat($('#taxaCrossover').val())
   	var elitismo = $('#elitismo').is(":checked");
   	var tamPop = $('#tamanhoPopulacao').val();
   	var numMaxGeracoes = $('#numeroGeracoes').val();
	var numGenes = solucao.A.length;
	console.log(solucao);

	var populacao = new Populacao(tamPop,numGenes, true);
	var temSolucao = false;
	var geracao = 0;
	var listaMelhoresIndividuos = [];

	while(!temSolucao && geracao < numMaxGeracoes){		
		geracao++;
		
		//cria nova populacao
        populacao = NovaGeracao(populacao, tamPop, numGenes, elitismo, taxaCrossover);
        listaMelhoresIndividuos.push(populacao.Individuos[0]);
        if(AchouSolucao(populacao.Individuos[0]))
        	temSolucao = true;
	}

	console.log(listaMelhoresIndividuos);
	MostrarCaminhoIndividuoNaTela(listaMelhoresIndividuos);
};


var Populacao = function(tamPop, numGenes, criarIndividuos){
	this.Individuos = [];

	if(criarIndividuos){
		for(var i=0; i<tamPop; i++) {
			this.Individuos.push(new Individuo(numGenes, null));
		}
	}
};

//Indivíduos
var Individuo = function(numGenes, genes){
	this.genes = [];
	if(genes == null){
		for(var i=0; i<numGenes; i++) {
			this.genes.push(Math.round(Math.random()));
		}
	}
	else{
		this.genes = genes;
		var taxaMutacao = parseFloat($('#taxaMutacao').val());
		if (Math.random() <= taxaMutacao) {
			var posicao = Math.floor(Math.random() * genes.length);
			this.genes[posicao] = trocaDigito(this.genes[posicao], 1);
		}
	}

	this.aptidao = CalcularAptidao(this.genes);
}

function AchouSolucao(individuo){
	return individuo.aptidao == 0;
}

function trocaDigito(v, digits) {
    return ~v & (Math.pow(2, digits) - 1);
}

function NovaGeracao(populacao, tamPop, numGenes, elitismo, taxaCrossover){
	//nova população do mesmo tamanho da antiga
	var novaPopulacao = new Populacao(tamPop, numGenes, false);

	//se tiver elitismo, mantém o melhor indivíduo da geração atual
	if(elitismo)
		novaPopulacao.Individuos.push(populacao.Individuos[0]);

	//insere novos indivíduos na nova população, até atingir o tamanho máximo
	while(novaPopulacao.Individuos.length < tamPop){
		//seleciona os 2 pais por torneio
		var pais = SelecaoTorneio(populacao, tamPop, numGenes);
		var filhos = []; 

		//verifica a taxa de crossover, se sim realiza o crossover, se não, mantém os pais selecionados para a próxima geração
		if(Math.random() <= taxaCrossover)
			filhos = CrossOver(pais);
		else
			filhos.push(pais[0], pais[1]);

		//adiciona os filhos na nova geração
		novaPopulacao.Individuos.push(filhos[0],filhos[1]);
	}

	//ordena a nova população
	novaPopulacao.Individuos = OrdenarIndividuos(novaPopulacao.Individuos);
	return novaPopulacao;
}

function SelecaoTorneio(populacao, tamPop, numGenes){
	var populacaoIntermediaria = new Populacao(3,numGenes, false);
	//seleciona 3 indivíduos aleatóriamente na população
	populacaoIntermediaria.Individuos.push(populacao.Individuos[Math.floor(Math.random() * tamPop)]);
	populacaoIntermediaria.Individuos.push(populacao.Individuos[Math.floor(Math.random() * tamPop)]);
	populacaoIntermediaria.Individuos.push(populacao.Individuos[Math.floor(Math.random() * tamPop)]);

	populacaoIntermediaria.Individuos = OrdenarIndividuos(populacaoIntermediaria.Individuos)

	return populacaoIntermediaria.Individuos.slice(0,2);
}

function CrossOver(Individuos){
	//passar por parametro futuramente
	var pontoDeCorte =5;

	var genePai1 = Individuos[0].genes; 
	var genePai2 = Individuos[1].genes;

	var filhos = [];
	
	var geneFilho1 = genePai1.slice(0,pontoDeCorte).concat(genePai2.slice(pontoDeCorte));
	
	var geneFilho2 = genePai2.slice(0,pontoDeCorte).concat(genePai1.slice(pontoDeCorte));

	filhos.push(new Individuo(0, geneFilho1), new Individuo(0, geneFilho2));

	return filhos;
}

function OrdenarIndividuos(individuos){
	return individuos.sort(function(a, b){return a.aptidao - b.aptidao});
}

function CalcularAptidao(genes){
	var posicaoInicial = 1;
	var posicaoFinal = 16
	var aptidao = 0;

	for(var i=0;i<genes.length;i+=2){
		var coordenada = genes.slice(i,i+2);

		if(SaiuDoMapa(posicaoInicial, coordenada)){
			aptidao+=50;
			return aptidao;
		}
		if(AtravessouParede(posicaoInicial, coordenada)){
			aptidao+= 20
		}

		posicaoInicial = MudarPosicaoMapa(posicaoInicial, coordenada);
	}
	if(posicaoInicial != posicaoFinal)
		aptidao+=10;

	return aptidao;

}

function SaiuDoMapa(posicaoMapa,coordenada){

	if([1,2,3,4].includes(posicaoMapa) && CoordenadaSul(coordenada))
		return true;
	if([1,5,9,13].includes(posicaoMapa) && CoordenadaOeste(coordenada))
		return true;
	if([13,14,15,16].includes(posicaoMapa) && CoordenadaNorte(coordenada))
		return true;
	if([4,8,12].includes(posicaoMapa) && CoordenadaLeste(coordenada))
		return true;
}

function AtravessouParede(posicaoMapa,coordenada){

	if([6,12,14].includes(posicaoMapa) && CoordenadaSul(coordenada))
		return true;
	if([7,8,11].includes(posicaoMapa) && CoordenadaOeste(coordenada))
		return true;
	if([2,8,10].includes(posicaoMapa) && CoordenadaNorte(coordenada))
		return true;
	if([6,10].includes(posicaoMapa) && CoordenadaLeste(coordenada))
		return true;
}

function MudarPosicaoMapa(posicaoMapa,coordenada){

	if(CoordenadaSul(coordenada))
		return posicaoMapa - 4;
	if(CoordenadaOeste(coordenada))
		return posicaoMapa - 1;
	if(CoordenadaNorte(coordenada))
		return posicaoMapa + 4;
	if(CoordenadaLeste(coordenada))
		return posicaoMapa + 1;
}

function CoordenadaSul(coordenada){
	var sul = [1,1];
	return coordenada[0] == sul[0] && coordenada[1] == sul[1];
}
function CoordenadaOeste(coordenada){
	var oeste = [1,0];
	return coordenada[0] == oeste[0] && coordenada[1] == oeste[1];
}
function CoordenadaNorte(coordenada){
	var norte = [0,1];
	return coordenada[0] == norte[0] && coordenada[1] == norte[1];
}
function CoordenadaLeste(coordenada){
	var leste = [0,0];
	return coordenada[0] == leste[0] && coordenada[1] == leste[1];
}

function MostrarCaminhoIndividuoNaTela(individuos){
	var posicaoMapa = 1;	
	
    for (var i =0; i < individuos.length; i++) {
  		for (var j=0;j<individuos[i].genes.length;j+=2) {

	    	delayed(100, function (i, j) {
		      	return function () {
		        	var coordenada = individuos[i].genes.slice(j,j+2);
					posicaoMapa = MudarPosicaoMapa(posicaoMapa, coordenada);
					MarcarDadosMapa(posicaoMapa, i, individuos[i]);
					if(j == 10){
						posicaoMapa = 1;
					}
		      	};
	    	}(i, j));
	  	}
	}

	LimparMapa();
}

function MarcarDadosMapa(posicaoMapa, geracao, individuo){
	LimparMapa();
	$(`#C${posicaoMapa}`).addClass('celula-verde');

	$('#geracao').text(geracao);
	$('#aptidao').text(individuo.aptidao);

}

function LimparMapa(){
	$("#mapa h1").removeClass("celula-verde");
	$('#C1').addClass('celula-verde');
}

var delayed = (function () {
  var queue = [];

  function processQueue() {
    if (queue.length > 0) {
      setTimeout(function () {
        queue.shift().cb();
        processQueue();
      }, queue[0].delay);
    }
  }

  return function delayed(delay, cb) {
    queue.push({ delay: delay, cb: cb });

    if (queue.length === 1) {
      processQueue();
    }
  };
}());	

var Main = function(){
	$("#iniciar").on( "click", AlgoritmoGenetico);
}();

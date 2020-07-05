var AlgoritmoGenetico = function(){
	
	//Coordenadas
	//00 - leste
	//01 - norte
	//10 - oeste
	//11 - sul

	var solucao = {A: [0,0,0,0,0,1,0,1,0,1,0,0], 
				   B: [0,1,0,1,0,1,0,0,0,0,0,0]};
   	var taxaCrossover = 0.6;
   	var taxaMutacao = 0.3;
   	var elitismo = true;
   	var tamPop = 100;
   	var numMaxGeracoes = 10000;
	var numGenes = solucao.A.length;
	console.log(solucao);

	var populacao = new Populacao(tamPop,numGenes, true);
	var temSolucao = false;
	var geracao = 0;

	while(!temSolucao && geracao < numMaxGeracoes){		
		geracao++;
		
		//cria nova populacao
        populacao = NovaGeracao(populacao, tamPop, numGenes, elitismo, taxaCrossover);
        console.log(`Geração ${geracao} aptidao ${populacao.Individuos[0].aptidao} Melhor: ${populacao.Individuos[0].genes}`); 
	}

};


var Populacao = function(tamPop, numGenes, criarIndividuos){
	this.Individuos = [];

	if(criarIndividuos){
		for(var i=0; i<tamPop; i++) {
			this.Individuos.push(new Individuo(numGenes));
		}
	}
};

//Indivíduos
var Individuo = function(numGenes){
	this.genes = [];

	for(var i=0; i<numGenes; i++) {
		this.genes.push(Math.round(Math.random()));
	}

	this.aptidao = CalcularAptidao(this.genes);
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

function CrossOver(  individuos1 ,  individuos2 ){
	//passar por parametro futuramente
	var pontoDeCorte =3;

	var genePai1 = individuos1.genes;
	var genePai2 = individuos2.genes;

	var filhos = new Individuo();

	var geneFilho1=[];
	var geneFilho2=[];
	
	geneFilho1 = genePai1.slice(0,pontoDeCorte).concat(genePai2.slice(pontoDeCorte));
	
	geneFilho2 = genePai2.slice(0,pontoDeCorte).concat(genePai1.slice(pontoDeCorte));

	filhos[0] = Individuo(geneFilho1);
	filhos[1] = Individuo(geneFilho2);

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

var Main = function(){
	AlgoritmoGenetico();
}();

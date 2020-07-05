var AlgoritmoGenetico = function(){
	
	//Coordenadas
	//00 - leste
	//01 - norte
	//10 - oeste
	//11 - sul
   	var taxaCrossover = 0.6;
   	var taxaMutacao = 0.3;
   	var elitismo = true;
   	var tamPop = 100;
   	var numMaxGeracoes = 10000;
	var numGenes = solucao.A.length;
	console.log(solucao);

	var populacao = new Populacao(tamPop, true);
	var temSolucao = false;
	var geracao = 0;

	while(!temSolucao && geracao < numMaxGeracoes){		
		geracao++;
		//TODO: resto
	}

};


var Populacao = function(tamPop, criarIndividuos){
	this.Individuos = [];

	if(criarIndividuos){
		for(var i=0; i<tamPop; i++) {
			individuos.push(new Individuo());
		}
	}
};
//Indivíduos
var Individuo = function(){
	this.genes = [];
	this.aptidao = 0;

	for(var i=0; i<numGenes; i++) {
		genes.push(Math.round(Math.random()));
	}
}

function NovaGeracao(populacao){
	//nova população do mesmo tamanho da antiga
	var novaPopulacao = new Populacao(tamPop, false);

	//se tiver elitismo, mantém o melhor indivíduo da geração atual
	if(elitismo)
		novaPopulacao.Individuos.push(Populacao.individuos[0]);

	//insere novos indivíduos na nova população, até atingir o tamanho máximo
	while(novaPopulacao.length < tamPop){
		//seleciona os 2 pais por torneio
		var pais = SelecaoTorneio(populacao); 
	}
}

function SelecaoTorneio(populacao){
	var populacaoIntermediaria = new Populacao(3, false);
}

function crossOver(  individuos1 ,  individuos2 ){
	//passar por parametro futuramente
	var pontoDeCorte =3;

	var genePai1 = individuos1.genes;
	var genePai2 = individuos2.genes;

	var geneFilho1=[];
	var geneFilho2=[];
	
	geneFilho1 = genePai1.slice(0,pontoDeCorte).concat(genePai2.slice(pontoDeCorte));
	
	geneFilho2 = genePai2.slice(0,pontoDeCorte).concat(genePai1.slice(pontoDeCorte));

}



var Main = function(){
	AlgoritmoGenetico();
}();

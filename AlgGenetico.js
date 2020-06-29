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

	var populacao = new Populacao(numGenes, tamPop);
	var temSolucao = false;
	var geracao = 0;

	while(!temSolucao && geracao < numMaxGeracoes){		
		geracao++;
		//TODO: resto
	}

};


var Populacao = function(numGenes, tamPop){
	return {};
};

var Individuo = function(){
	return {};
};



var Main = function(){
	AlgoritmoGenetico();
}();

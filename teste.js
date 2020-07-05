pontoDeCorte = 5;
var genePai2 =[];
var genePai1 =[];
var geneFilho1=[];
var geneFilho2=[];

for(var i=0; i<9; i++) {
    genePai1.push(Math.round(Math.random()));
    genePai2.push(Math.round(Math.random()));
}

console.log(genePai1 + " - Pai 1");
console.log(genePai2+ " - Pai 2")

geneFilho1 = genePai1.slice(0,pontoDeCorte).concat(genePai2.slice(pontoDeCorte));

geneFilho2 = genePai2.slice(0,pontoDeCorte).concat(genePai1.slice(pontoDeCorte));


console.log(geneFilho1+" - f1");
console.log(geneFilho2+" - f2");
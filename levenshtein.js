

const ss = require('sentence-similarity');
const levenshtein = require('js-levenshtein');

const similarity = ss.sentenceSimilarity;
const similarityScore1 = ss.similarityScore;

let s1 = 'Baby Led Weaning';
let s2 = 'Baby-led Weaning';
s1 = 'Приглашаем в гости! - путеводители по городам России';
s2 = 'Путеводители по городам России. Приглашаем в гости!';
let s11 = s1.trim().replace(/[,;\-:]/gi, ' ');
let s22 = s2.trim().replace(/[,;\-:]/gi, ' ');
const levsentence = levenshtein(s1, s2);
console.log(`Levenshtein sentence ${levsentence}`);
console.log(`Lev sentence prob ${((s11.length - levsentence) / s11.length) * 100}`);

s11 = s1.trim().replace(/[,;]/gi, ' ').match(/\S+/g);
s22 = s2.trim().replace(/[,;]/gi, ' ').match(/\S+/g);
const winkOpts = { f: similarityScore1.dl, options: { threshold: 0.7 } };
let simObj;
console.log(JSON.stringify(simObj = similarity(s11, s22, winkOpts)));
console.log(`Match probability ${simObj.score * simObj.order * simObj.size * 100}`);

const st1 = 'http://medpred.ru/forum/index.php/board,22.0.html';
const st2 = 'https://medpred.ru/forum/index.php?board=21.0';
const leven = levenshtein(st1, st2);

const st21 = '905';
const st22 = '503';
const leven2 = levenshtein(st21, st22);

console.log(`Levenshtein ${leven}`);
console.log(`Lev prob ${(st1.length - leven) / (st1.length * 100)}`);

console.log(`Levenshtein number ${leven2}`);
console.log(`Lev prob number ${(st21.length - leven2) / (st21.length * 100)}`);

let url1 = 'https://www.babycenter.fr/g50002285/iplv-aplv-et-autres--groupe-de-soutien';
url1 = 'http://bbs.qyer.com/forum-108-1.html';
const urlPart1 = url1.replace('http://', '').replace('https://', '').match(/[/?#]{1}.+/)[0];
let url2 = 'https://www.babycenter.fr/g50002285/recettes-iplv-et-autres-intolérances';
url2 = 'http://bbs.qyer.com/forum-188-1.html';
const urlPart2 = url2.replace('http://', '').replace('https://', '').match(/[/?#]{1}.+/)[0];

const distance = levenshtein(urlPart1, urlPart2);
let urlLength = 0;
if (urlPart1.length > urlPart2.length) {
	urlLength = urlPart1.length;
} else {
	urlLength = urlPart2.length;
}
const linkProbability = Math.floor((urlLength - distance) / (urlLength * 100));
console.log(`Distance ${distance}`);
console.log(`Url Length ${urlLength}`);
console.log(`Shorter url length ${urlPart1.length}`);
console.log(`Link 1 ${urlPart1}`);
console.log(`Link 2 ${urlPart2}`);
console.log(`Probability ${linkProbability}`);
console.log('djkfh fhfkj fdhfkdjh sdhksddskjf kshfs f'.match(/\S+/g));

function isEven(document) {
    let document2 = document.toString();
    let n1;
    
    if (!/^\d+$/.test(document2)) {
        n1 = document2.charCodeAt(document2.length - 1) + 
             document2.charCodeAt(document2.length - 2) + 
             document2.charCodeAt(document2.length - 3);
    } else {
        n1 = document % 1000;
    }
    
    let n2 = Math.floor(n1 / 100) + Math.floor((n1 % 100) / 10) + (n1 % 10);
    
    return n2 % 2 === 0 ? 'Eres par': 'Eres impar';
}

console.log(isEven(1000874557))
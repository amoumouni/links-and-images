function  capitalize(str) {
   let uppercaseFirst = str[0].toUpperCase();
    let rest = str.slice(1);
   let result = uppercaseFirst + rest;
return result
}

//test example
console.log(capitalize("ari")) // should print Ari
function addOrSubtract(integer) {
if (integer < 10) {
    return integer + 7
}   else if (integer >= 10) {
    return integer - 3;
}
}
 
    //test examples
console.log(addOrSubtract(9));   // should print 16
console.log(addOrSubtract(10));  // should print 7
console.log(addOrSubtract(11));  // should print 8

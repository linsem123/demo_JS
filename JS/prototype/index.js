function　Book(id, name, price){
    this.id  = id;
    this.name = name;
    this.price = price;
}

console.log(Book.prototype.constructor  === Book);

const book = new Book(1,'js',22);
console.log(book.__proto__ === Book.prototype);
console.log(book.__proto__ .constructor=== Book);
console.log('*'.repeat(10));
console.log(book instanceof Book);// 左边是右边的实例吗？
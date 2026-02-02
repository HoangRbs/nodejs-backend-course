


const some_product = {
    a: 1,
    b: 1,
    c: {
        c1: 1,
        c2: 1
    }
}

db.collection.updateOne({
    b: 2,
    c: {
        c1: 2,
    }
})



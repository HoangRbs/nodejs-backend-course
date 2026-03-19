const { response } = require("express")

// ['a', 'b'] = {a:1, b:1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el => [el, 1])))
}

// ['a', 'b'] = {a:0, b:0}
const noGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el => [el, 0])))
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] == null) {
            delete obj[key]
        }
    })
    
    // the above function edit the original object, faster speed than creating 
    // so no need to reassign updatePayload = ... (used in product.service.js)
    // because we're editing that original object
}


// use this in product.service.js when we want to update a product with nested object
// goal:
/*
    From 
    {
        key1: 'hehe',
        key2: 'hihi',
        key3: {
            key1: 'hoho',
            key2: 'huhu'
        }
        key4: 'clgt'
    }

    To 
    {
        key1: 'hehe',
        key2: 'hihi',
        "key3.key1": 'hoho',
        "key3.key2": 'huhu',
        key4: 'clgt'
    }
*/

const nestedObjectParser = (obj) => {
    const Result = {}
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && !isEmpty(obj[key])) {
            const responseObj = nestedObjectParser(obj[key]);
            Object.keys(responseObj).forEach(responseKey => {
                Result[`${key}.${responseKey}`] = responseObj[responseKey]
            })
        } else {
            Result[key] = obj[key]
        }
    })

    return Result;
}

/* Note: Always ensure the value is not null before checking, 
as Object.keys(null) will throw an error.*/
const isEmpty = (obj) => Object.keys(obj).length === 0;




module.exports = {
    getSelectData,
    noGetSelectData,
    removeUndefinedObject,
    nestedObjectParser
}
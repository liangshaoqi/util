/**
 * 数组中相同部分,留下不同部分
 * @param {*} arr1  
 * @param {*} arr2 
 */
let getArrDifference = (arr1, arr2) => {
    return arr1.concat(arr2).filter((item, index, arr) => {
        return arr.indexOf(item) === arr.lastIndexOf(item)
    })
}
export {getArrDifference}
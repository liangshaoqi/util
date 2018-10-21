class Util{
    constructor(){

    }
    /**
     * 数组中相同部分,留下不同部分
     * @param {*} arr1  
     * @param {*} arr2 
     */
    getArrDifference(arr1, arr2){
        return arr1.concat(arr2).filter((item, index, arr) => {
            return arr.indexOf(item) === arr.lastIndexOf(item)
        })
    }
    /**
     * @param arr1,数组
     * @param arr2,数组
     */
    getArrEqual(arr1, arr2) {
        
    }
}
export default new Util()



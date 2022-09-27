import {Component} from "react";

class StaticConstants extends Component{
    static loadHomePage = false
    static nonServingDaysData = []
    static configInfo = []

}

export function getFilteredVariants(variants) {

    let l1 = [];
    let l2 = [];
    let i1 = 0;
    let j1 = 0;
    for (let i = 0; i < variants.length; i++) {
        let s = variants[i]
        if (s.availabilityCount <= 0) {
            l2[j1] = s
            j1++
        }else {
            l1[i1] = s
            i1++
        }
    }

    l1.push(...l2)

    if (i1 > 0){
        return (l1);
    }else {
        return variants;
    }

}

export function getMinOrderValue() {
    let cf = StaticConstants.configInfo
    if (cf!==null && cf.length>0){
        for (let i=0;i<cf.length;i++){
            let p = cf[i]
            if (p.metaType==="MIN_ORDER_VALUE"){
                return Number(p.metaValue)
            }
        }
    }
}
// export function nonservingDates() {
//     let nsd = StaticConstants.nonServingDaysData
//     if (nsd!==null && nsd.length>0){
//         for (let i=0;i<nsd.length;i++){
//             let p = nsd[i]
//             // if (p.metaType==="MIN_ORDER_VALUE"){
//             //     return Number(p.metaValue)
//             // }
//             return console.log(p)
//         }
//     }
    
//  }
export default StaticConstants;

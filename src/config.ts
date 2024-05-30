import { buffer } from "rxjs"

const config = { 
    gridMaxOffsetPx: {
        left: 200,
        top: 200,
        right: 150,
        bottom: 50,
    },
    squareSizeRange: {
        min: 10,
        max: 100,
    },
    
    selectionStyle: {
        color: 0x90EE90, 
        alpha: 0.3,
    },

    timeouts: {
        autoSave: 1000,
        autoUpdate: 1000,
    },

    PDF: {
        pageSize: { width: 40, height: 55 },
        squareSize: 40,
        borderSize: 80,
    },

    history: {
        maxSize: 10,
    },

}
export { config }

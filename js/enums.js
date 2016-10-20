Function = {
    SIZE : 5,
    INDEX : [
        "CONSTANT",
        "EXPONENCIAL",
        "NORMAL",
        "TRIANGULAR",
        "UNIFORM"
    ],
    NUMBER : {
        CONSTANT : 0,
        EXPONENCIAL : 1,
        NORMAL : 2,
        TRIANGULAR : 3,
        UNIFORM : 4
    },
    NAME : {
        CONSTANT : "Constante",
        EXPONENCIAL : "Exponencial",
        NORMAL : "Normal",
        TRIANGULAR : "Triangular",
        UNIFORM : "Uniforme"
    },
    PARAMS : {
        CONSTANT : [],
        EXPONENCIAL : ["λ"],
        NORMAL : ["μ", "σ"],
        TRIANGULAR : ["a", "b", "c"],
        UNIFORM : ["a", "b"]
    }
};

Message = {
    SIZE : 2,
    INDEX : [
        "LOCAL",
        "REMOTE",
    ],
    NUMBER : {
        LOCAL : 0,
        REMOTE : 1
    }    
}

// Origem e destino das requisições
Direction = {
    SIZE : 4,
    INDEX : [
        "LL",
        "LR",
        "RL",
        "RR"
    ],
    NUMBER : {
        LL : 0,
        LR : 1,
        RL : 2,
        RR : 3
    },
    DESTINATION : {
        LL : Message.NUMBER.LOCAL,
        LR : Message.NUMBER.REMOTE,
        RL : Message.NUMBER.LOCAL,
        RR : Message.NUMBER.REMOTE
    }
};

Status = {
    SIZE : 3,
    INDEX : [
        "S",
        "F",
        "A"
    ],
    NUMBER : {
        SUCESS : 0, // Sucesso
        FAIL : 1, // Falha
        POSTPONE : 2 // Adiamento
    }
};
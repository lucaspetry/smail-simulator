/*========================================
 * Requires:  enums.js
 *=======================================*/

/**
 * Centro de recepção
 */
function ReceptionCenter() {
    "use strict";
    this.waitQueue = new Array();
    this.currentEvent;

    this.isBusy = function() {
        return this.currentEvent != undefined;
    }

    this.pushToWaitQueue = function(arrivalEvent) {
        this.waitQueue.push(arrivalEvent);
    }
}

/**
 * Centro de serviço
 */
function ServiceCenter(numberOfServers) {
    "use strict";
    this.numberOfServers = numberOfServers;
    this.availableServers = numberOfServers;
    this.waitQueue = new Array();

    this.isBusy = function() {
        return this.executionQueue.length == numberOfServers;
    }
    
    this.getNumberOfBusyServers = function() {
        return this.numberOfServers - this.availableServers;
    };
}

/**
 * Gerador de probabilidades (?)
 */
function ProbabilityGenerator() {
    this.trafficVolume = [/* LL, LR, RL, RR */];
    this.trafficRate;
    this.arrivalIntervalLocal = [/* Function.NUMBER, Param */];
    this.arrivalIntervalRemote = [/* Function.NUMBER, Param */];
    this.receptionTimes = [/* LL, LR, RL, RR */];
    this.serviceTimeFunctions;

    /**
     * Obter o tempo até a próxima chegada
     * @param origin origem da mensagem
     * @return
     */
    this.getTimeToNextArrival = function(origin) {
        if(origin == Message.NUMBER.LOCAL) {
            return getDistributionFunction(this.arrivalIntervalLocal[0])(this.arrivalIntervalLocal[1]);
        }

        return getDistributionFunction(this.arrivalIntervalRemote[0])(this.arrivalIntervalRemote[1]);
    };

    /**
     * Obter o tempo de serviço
     * @param direction direção da mensagem
     * @param status resultado do processamento da mensagem
     * @return
     */
    this.getServiceTime = function(direction, status) {
        var funcParams = this.serviceTimeFunctions[Direction.INDEX[direction]][status];
        var numParams = Function.PARAMS[Function.INDEX[funcParams[0]]].length;

        switch(numParams) {
            case 1:
                return getDistributionFunction(funcParams[0])(funcParams[1]);
            case 2:
                return getDistributionFunction(funcParams[0])(funcParams[1], funcParams[2]);
            case 3:
                return getDistributionFunction(funcParams[0])(funcParams[1], funcParams[2], funcParams[3]);
        }
    };
    
    /**
     * Obter o tempo de recepção
     * @param direction direção da mensagem
     * @return
     */
    this.getReceptionTime = function(direction) {
        return this.receptionTimes[direction];
    };

    /**
     * Obter a direção da mensagem
     * @param origin origem da mensagem
     * @return
     */
    this.getDirection = function(origin) {
        var r = Math.random();

        if(origin == Message.NUMBER.LOCAL) {
            if(r < this.trafficVolume[Direction.NUMBER.LL]/100) {
                return Direction.NUMBER.LL;
            }

            return Direction.NUMBER.LR;
        } else {
            if(r < this.trafficVolume[Direction.NUMBER.RL]/100) {
                return Direction.NUMBER.RL;
            }

            return Direction.NUMBER.RR;
        }
    };

    /**
     * Obter o status de acordo com a direção
     * @param direction direção da mensagem
     * @return
     */
    this.getStatus = function(direction) {
        var r = Math.random();
        if(r < this.trafficRate[direction][Status.NUMBER.SUCESS]/100){
            return Status.NUMBER.SUCESS;
        }
        
        if(r >= this.trafficRate[direction][Status.NUMBER.SUCESS]/100
           && r < (this.trafficRate[direction][Status.NUMBER.SUCESS]
                   + this.trafficRate[direction][Status.NUMBER.FAIL])/100){
            return Status.NUMBER.FAIL;
        }
        
        return Status.NUMBER.POSTPONE;
    };

}

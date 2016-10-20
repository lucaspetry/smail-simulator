/*========================================
 * Requires:  enums.js
 *=======================================*/

/**
 * Centro de recepção
 */
function ReceptionCenter() {
    "use strict";
    this.waitQueue = new Array();
    
    this.totalMessages = 0;
    this.numMessagesIn = 0;
    
    this.isBusy = function() {
        return this.waitQueue.length == 0;
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
    this.executionQueue = new Array();
    this.waitQueue = new Array();
    
    this.totalMessages = 0;
    this.numMessagesIn = 0;
    
    this.isBusy = function() {
        return this.executionQueue.length == numberOfServers;
    }
}

function ProbabilityGenerator() {
    
    this.trafficVolume;
    this.trafficRate;
    this.arrivalIntervalLocal = [/* Function.NUMBER, Param */];
    this.arrivalIntervalRemote = [/* Function.NUMBER, Param */];
    this.receptionTimes;
    this.serviceTimeFunctions;
    
  //Recption center
//  this.localProbabilityFunction;
//  this.remoteProbabilityFunction;
//  this.local2LocalReceptionTime;
//  this.local2RemoteReceptionTime;
//  this.remote2RemoteReceptionTime;
//  this.remote2LocalReceptionTime;
//  this.probabilityOfDestinyBeLocal;
//  this.probabilityOfDestinyBeRemote;
//
//  //Service center
//  this.probabilityOfSucces;
//  this.probabilityOfFail;
//  this.probabilityOfPostponed;
//  this.LLSProbabilityFunction;
//  this.LLFProbabilityFunction;
//  this.LLAProbabilityFunction;
//  this.LRSProbabilityFunction;
//  this.LRFProbabilityFunction;
//  this.LRAProbabilityFunction;
//  this.RLSProbabilityFunction;
//  this.RLFProbabilityFunction;
//  this.RLAProbabilityFunction;
//  this.RRSProbabilityFunction;
//  this.RRFProbabilityFunction;
//  this.RRAProbabilityFunction;

//  this.functionMap = new FastMap();
//
//  this.buildFunctionMap = function() {
//    this.functionMap.add("LL", this.local2LocalReceptionTime);
//    this.functionMap.add("LR", this.local2RemoteReceptionTime);
//    this.functionMap.add("RL", this.remote2LocalReceptionTime);
//    this.functionMap.add("RR", this.remote2RemoteReceptionTime);
//    this.functionMap.add("LLS", this.LLSProbabilityFunction);
//    this.functionMap.add("LLF", this.LLFProbabilityFunction);
//    this.functionMap.add("LLA", this.LLAProbabilityFunction);
//    this.functionMap.add("LRS", this.LRSProbabilityFunction);
//    this.functionMap.add("LRF", this.LRFProbabilityFunction);
//    this.functionMap.add("LRA", this.LRAProbabilityFunction);
//    this.functionMap.add("RLS", this.RLSProbabilityFunction);
//    this.functionMap.add("RLF", this.RLFProbabilityFunction);
//    this.functionMap.add("RLA", this.RLAProbabilityFunction);
//    this.functionMap.add("RRS", this.RRSProbabilityFunction);
//    this.functionMap.add("RRF", this.RRFProbabilityFunction);
//    this.functionMap.add("RRA", this.RRAProbabilityFunction);
//  };
//    
//  this.buildFunctionMap();

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
     * Obter o tempo de serviço
     * @param direction direção da mensagem
     * @param status resultado do processamento da mensagem
     * @return
     */
    this.getDestination = function(origin) {
        var r = Math.random();
        
        if(origin == Message.NUMBER.LOCAL) {
            if(r < this.trafficVolume[Direction.NUMBER.LL]/100) {
                return Message.NUMBER.LOCAL;
            }
            
            return Message.NUMBER.REMOTE;
        } else {
            if(r < this.trafficVolume[Direction.NUMBER.RL]/100) {
                return Message.NUMBER.LOCAL;
            }
            
            return Message.NUMBER.REMOTE;            
        }
    };

    /**
     * Obter o status de acordo com a direção
     * @param direction direção da mensagem
     * @return
     */
    this.getStatus = function(direction) {
        var r = Math.random();
        
        if(r < this.trafficRate[direction][Status.NUMBER.SUCESS]){
            return Status.NUMBER.SUCESS;
        }
        if(r > this.trafficRate[direction][Status.NUMBER.SUCESS]
           && r < this.trafficRate[direction][Status.NUMBER.FAIL]){
            return Status.NUMBER.FAIL;
        }
        return Status.NUMBER.POSTPONE;
    };

}

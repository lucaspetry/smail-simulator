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
    this.availableServers = numberOfServers;
    this.waitQueue = new Array();

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

  this.getTimeToExit = function(key) {
      return this.receptionTimes[key];
  };


  this.getStatus = function() {
      var r = Math.random();
      if(r >= 0 && r <= probabilityOfSucces){
        return "sucesso";
      }
      if(r > probabilityOfSucces && r <= probabilityOfFail){
        return "falha";
      }
      return "adiado";
  };
}

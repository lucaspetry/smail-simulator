/*========================================
 * Requires:  enums.js
 *=======================================*/

/**
 * Centro de recepção
 */
function ReceptionCenter() {
    "use strict";

    this.totalMessages = 0;
    this.numMessagesIn = 0;
    this.queue = new Array();
}

/**
 * Centro de serviço
 */
function ServiceCenter(numberOfServers) {
  "use strict";
    this.numberOfServers = numberOfServers;
    this.totalMessages = 0;
    this.numMessagesIn = 0;
    this.queue = new Array();
}

function ProbabilityGenerator() {
    
    this.trafficVolume;
    this.trafficRate;
    this.arrivalIntervalLocal;
    this.arrivalIntervalRemote;
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

  this.getTimeToNextArrival = function(origem) {
      if(origem == "local"){
        return this.localProbabilityFunction.get();
      }
      return this.remoteProbabilityFunction.get();
  };

  this.getTimeToExit = function(key) {
      return this.functionMap.get(key).get();
  };

  this.getDestiny = function() {
      var r = Math.random();
      if(r >= 0 && r <= probabilityOfDestinyBeLocal){
        return "local";
      }
      return "remote";
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

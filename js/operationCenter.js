/*========================================
 * Requires:  enums.js
 *=======================================*/

/**
 * Construtor de um centro de recepção
 */
function ReceptionCenter() {
    "use strict";
    this.totalMessages = 0;
    this.numMessagesIn = 0;
    this.queue = new Array();
}

/**
 * Construtor de um centro de serviço
 */
function ServiceCenter(numberOfServers) {
  "use strict";
    this.numberOfServers = numberOfServers;
    this.totalMessages = 0;
    this.numMessagesIn = 0;
    this.queue = new Array();
}

/**
 * Construtor de um servidor
 */
function Server() {
    "use strict";
}

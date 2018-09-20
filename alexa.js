var debug = false;
	
  module.exports = function(RED) {
    var AlexaCredentialsNode;

    AlexaCredentialsNode = function(config) {
      
      RED.nodes.createNode(this, config);
	  
	  var node = this;
      
	  if(debug) {node.warn(config);}
      
      this.cookie = config.cookie;
      this.email = config.email;
      this.password = config.password;
      this.alexaServiceHost = config.alexaServiceHost;
      this.acceptLanguage = config.acceptLanguage;
      this.amazonPage = config.amazonPage;
	  
    };
	
    RED.nodes.registerType("Alexa-credentials", AlexaCredentialsNode);
  };

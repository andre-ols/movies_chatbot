module.exports = function dialogFunction(responseDialog) {
    var parametersFallBack;
    if(responseDialog.outputContexts[0])
    parametersFallBack = responseDialog.outputContexts[0].parameters.fields;
    
    const { fields: parameters } = responseDialog.parameters;
    const { allRequiredParamsPresent } = responseDialog;

    return {
        parameters,
        allRequiredParamsPresent,
        parametersFallBack
    }
  };
  
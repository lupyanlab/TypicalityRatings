import { getTrials } from "./experiment.js";

$(document).ready(function(){
    let subjCode = $.urlParam('subjCode') || 'unknown';
    let assignmentId = undefined;
    let hitId = undefined;
    getTrials(subjCode, assignmentId, hitId);    
});

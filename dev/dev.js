import { getTrials } from "./experiment.js";

$(document).ready(function() {
  $("form").submit(function() {
      let subjCode = $("#subjCode").val().slice();
      let assignmentId = undefined;
      let hitId = undefined;
      $("form").remove();
      getTrials(subjCode, assignmentId, hitId);
  });
});

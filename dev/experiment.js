import demographicsQuestions from "./demographics.js";

const PORT = 7071;
const FULLSCREEN = false;

export function getTrials(workerId='NA', assignmentId='NA', hitId='NA') {
  
  $("#loading").html('Loading trials... please wait. </br> <img src="img/preloader.gif">')
  
  // This calls server to run python generate trials (judements.py) script
  // Then passes the generated trials to the experiment
  $.ajax({
      url: 'http://'+document.domain+':'+PORT+'/trials',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({workerId: workerId}),
      success: function (data) {
          console.log(data);
          $("#loading").remove();
  
          runExperiment(data.trials, workerId, assignmentId, hitId, PORT, FULLSCREEN);
      }
  })
}

function disableScrollOnSpacebarPress () {
  window.onkeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  };
}

// Function Call to Run the experiment
function runExperiment(trials, workerId, assignmentId, hitId, PORT, FULLSCREEN) {
  disableScrollOnSpacebarPress();

  let timeline = [];

  // Data that is collected for jsPsych
  let turkInfo = jsPsych.turk.turkInfo();
  let participantID = makeid() + "iTi" + makeid();

  jsPsych.data.addProperties({
    subject: participantID,
    condition: "explicit",
    group: "shuffled",
    assginementId: assignmentId,
    hitId: hitId
  });

  // sample function that might be used to check if a subject has given
  // consent to participate.
  var check_consent = function (elem) {
    if ($('#consent_checkbox').is(':checked')) {
        return true;
    }
    else {
        alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
        return false;
    }
    return false;
  };
  // declare the block.
  var consent = {
    type: 'external-html',
    url: "./consent.html",
    cont_btn: "start",
    check_fn: check_consent
  };

  timeline.push(consent);

  let continue_space =
    "<div class='right small'>Press SPACE to continue.</div>";

  let instructions = {
    type: "instructions",
    key_forward: 'space',
    key_backward: 'backspace',
    pages: [
      `<p>On each page you will see two pictures from the same category e.g., two cats. Your task is simply to decide which of the two pictures is the best example of your idea or image of what the category is. The categories you will see are <b>cats, dogs, birds, fish, cars, trains, planes and boats</b>.
      <p><b>Use the keys 1-5 to respond</b>. You will be asked to about 225 judgments. Estimated total time is 6-7 minutes. At the end, you will get a completion code. Please respond carefully. If you miss the attention checks, we may deny payment.
            </p> ${continue_space}`
    ]
  };

  timeline.push(instructions);

  // keeps track of current trial progression
  // and used for the progress bar
  let progress_number = 1;
  let images = [];
  let num_trials = trials.length;

  trials.forEach((trial, index) => {
    // In contrast to progress_number,
    // trial_number is used for recording
    // responses
    const trial_number = index + 1;

    images.push("images/" + trial.pic1 + ".png");
    images.push("images/" + trial.pic2 + ".png");

    // Empty Response Data to be sent to be collected
    let response = {
      workerId: workerId,
      assignmentId: assignmentId,
      hitId: hitId,
      seed: trial.seed,
      Category: trial.Category,
      Subcategory1: trial.Subcategory1,
      Subcategory2: trial.Subcategory2,
      firstStimPosition: trial.firstStimPosition,
      secondStimPosition: trial.secondStimPosition,
      pic1: trial.pic1,
      pic2: trial.pic2,
      expTimer: -1,
      response: -1,
      choice: 'error: no choice selected',
      trial_number: trial_number,
      rt: -1
    };

    let leftPic;
    let rightPic;
    if (trial.firstStimPosition === 'left') {
      leftPic = trial.pic1;
    } else if (trial.firstStimPosition === 'right') {
      rightPic = trial.pic1;
    }

    if (trial.secondStimPosition === 'left') {
      leftPic = trial.pic2;
    } else if (trial.secondStimPosition === 'right') {
      rightPic = trial.pic2;
    }

    let stimulus = `
        <h5 style="text-align:center;margin-bottom:20%;margin-top:0;">Trial ${trial_number} of ${num_trials}</h5>
        <div style="width:100%;">
            <div style="width:50%;text-align:center;float:left;">
                <img src="images/${leftPic}.png" alt="${leftPic}" height="200px" align="middle" style="max-width:400px;"/> 
            </div>
            <div style="width:50%;text-align:center;float:left;">
                <img src="images/${rightPic}.png" alt="${rightPic}" height="200px" align="middle" style="max-width:400px;width=50%;" />
            </div>
        </div>
    `;

    const choices = [
      "Left image much more typical", 
      "Left image slightly more typical", 
      "Both images equally typical", 
      "Right image slightly more typical", 
      "Right image much more typical",
    ];
    
    let circles = choices.map(choice => {
      return `
        <div class="choice">
          <div class="choice-circle empty-circle"></div>
          <div class="text">${choice}</div>
        </div>
        `;
    });

    let prompt = `
        <div class="bar">
            ${circles.join("")}
        </div>
    `;

    // Picture Trial
    let pictureTrial = {
      type: "html-keyboard-response",
      choices: choices.map((choice, index) => {
        return `${index + 1}`;
      }),

      stimulus: stimulus,

      prompt: function() {
        return prompt;
      },

      on_finish: function(data) {
        response.response = String.fromCharCode(data.key_press);
        response.choice = choices[Number(response.response)-1];
        response.rt = data.rt;
        response.expTimer = data.time_elapsed / 1000;

        // POST response data to server
        $.ajax({
          url: "http://" + document.domain + ":" + PORT + "/data",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(response),
          success: function() {
            console.log(response);
          }
        });
      }
    };
    timeline.push(pictureTrial);

    // let subject view their choice
    let breakTrial = {
      type: "html-keyboard-response",
      trial_duration: 500,
      response_ends_trial: false,

      stimulus: stimulus,

      prompt: function() {
        const circles = choices.map((choice, index) => {
          if (choice == response.choice) {
            return `
                  <div class="choice">
                    <div class="choice-circle filled-circle"></div>
                    <div class="text">${choice}</div>
                  </div>
                `;
          }
          return `
            <div class="choice">
              <div class="choice-circle empty-circle"></div>
              <div class="text">${choice}</div>
            </div>
            `;
        });

        const prompt = `
            <div class="bar">
                ${circles.join("")}
            </div>
        `;
        return prompt;
      },
      
      on_finish: function() {
        jsPsych.setProgressBar((progress_number - 1) / num_trials);
        progress_number++;
      },
    };
    timeline.push(breakTrial);
  });


  let questionsInstructions = {
    type: "instructions",
    key_forward: 'space',
    key_backward: 'backspace',
    pages: [
        `<p class="lead">We'll now ask you a few demographic questions and we'll be done!
          </p> ${continue_space}`,
    ]
  };

  timeline.push(questionsInstructions);

  let demographicsTrial = {
      type: 'surveyjs',
      questions: demographicsQuestions,
      on_finish: function (data) {
          let demographicsResponses = data.response;
          console.log(demographicsResponses);
          let demographics = Object.assign({ workerId }, demographicsResponses);
          // POST demographics data to server
          $.ajax({
              url: 'http://' + document.domain + ':' + PORT + '/demographics',
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(demographics),
              success: function () {
              }
          })

  let endmessage = `Thank you for participating! Your completion code is ${participantID}. Copy and paste this in 
        MTurk to get paid. 

        <p>The purpose of this HIT is to assess the extent to which different people agree what makes
        a particular dog, cat, or car typical.
        
        <p>
        If you have any questions or comments, please email hroebuck@wisc.edu.`;
          jsPsych.endExperiment(endmessage);
      }
  };
  timeline.push(demographicsTrial);

  let endmessage = `Thank you for participating! Your completion code is ${participantID}. Copy and paste this in 
        MTurk to get paid. 

        <p>The purpose of this HIT is to assess the extent to which different people agree what makes
        a particular dog, cat, or car typical.
        
        <p>
        If you have any questions or comments, please email hroebuck@wisc.edu.`;

    
  Promise.all(images.map((image, index) => {
    return loadImage(image)
    .catch((error) => {
      console.warn("Removing trial with image, " + image);

      // there are twice the number of images than trials
      // we set trial to null so we can cleanly remove
      // it later
      trials[index / 2] = null;
    });
  }))
  .then((images) => {
    trials = trials.filter((trial, index) => {
      return trial !== null;
    });
    startExperiment();
  })

  function startExperiment() {
    jsPsych.init({
      timeline: timeline,
      fullscreen: FULLSCREEN,
      show_progress_bar: true,
      auto_update_progress_bar: false
    });
  }
}

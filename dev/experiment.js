// Function Call to Run the experiment
function runExperiment(trials, subjCode, workerId, assignmentId, hitId) {
  let timeline = [];

  // Data that is collected for jsPsych
  let turkInfo = jsPsych.turk.turkInfo();
  let participantID = makeid() + "iTi" + makeid();

  jsPsych.data.addProperties({
    subject: participantID,
    condition: "explicit",
    group: "shuffled",
    workerId: workerId,
    assginementId: assignmentId,
    hitId: hitId
  });

  let welcome_block = {
    type: "text",
    cont_key: " ",
    text: `<h1>TypicalityRatings</h1>
        <p>Welcome to the experiment. Thank you for participating! Press SPACE to begin.</p>`
  };

  timeline.push(welcome_block);

  let continue_space =
    "<div class='right small'>(press SPACE to continue, or BACKSPACE to head back)</div>";

  let instructions = {
    type: "instructions",
    key_forward: " ",
    key_backward: 8,
    pages: [
      `<p>In this experiment, you will see two drawings and rate their typicality from 1 to 5.
            </p> ${continue_space}`,

      `<p>Use the 1-5 number keys to select your choice.
            </p> ${continue_space}`
    ]
  };

  timeline.push(instructions);

  let trial_number = 1;
  let images = [];
  let num_trials = trials.length;

  _.forEach(trials, trial => {
    images.push("images/" + trial.pic1 + ".png");
    images.push("images/" + trial.pic2 + ".png");

    // Empty Response Data to be sent to be collected
    let response = {
      subjCode: subjCode,
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
        <canvas width="800px" height="25px" id="bar"></canvas>
        <script>
            var barCanvas = document.getElementById('bar');
            var barCtx = barCanvas.getContext('2d');
            barCtx.roundRect(0, 0, barCanvas.width, barCanvas.height, 20).stroke();
            barCtx.roundRect(0, 0, barCanvas.width*${trial_number / num_trials}, barCanvas.height, 20).fill();
        </script>
        <h5 style="text-align:center;">Trial ${trial_number} of ${num_trials}</h5>
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
      "Right image more typical",
    ];
    
    let circlesSvgs = choices.map(choice => {
      return `
        <div class="choice">
          <svg viewBox="0 0 100 100">
              <circle class="empty-circle"/>
          </svg>
          <div>${choice}</div>
        </div>
        `;
    });

    let prompt = `
        <div class="bar">
            ${circlesSvgs.join("")}
        </div>
    `;

    // Picture Trial
    let pictureTrial = {
      type: "single-stim",
      is_html: true,
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
      type: "single-stim",
      is_html: true,
      timing_response: 1000,
      response_ends_trial: false,

      stimulus: stimulus,

      prompt: function() {
        const circlesSvgs = choices.map((choice, index) => {
          if (choice == response.choice) {
            return `
                  <div class="choice">
                    <svg viewBox="0 0 100 100">
                        <circle class="filled-circle"/>
                    </svg>
                    <div>${choice}</div>
                  </div>
                `;
          }
          return `
            <div class="choice">
              <svg viewBox="0 0 100 100">
                  <circle class="empty-circle"/>
              </svg>
              <div>${choice}</div>
            </div>
            `;
        });

        const prompt = `
            <div class="bar">
                ${circlesSvgs.join("")}
            </div>
        `;
        return prompt;
      }
    };
    timeline.push(breakTrial);

    trial_number++;
  });

  let endmessage = `Thank you for participating! Your completion code is ${participantID}. Copy and paste this in 
        MTurk to get paid. If you have any questions or comments, please email jsulik@wisc.edu.`;

    
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
      default_iti: 0,
      timeline: timeline,
      fullscreen: FULLSCREEN,
      show_progress_bar: true,
      on_finish: function(data) {
        jsPsych.endExperiment(endmessage);
      }
    });
  }
}

export default [
	{ type: "radiogroup", name: "gender", isRequired: true, title: "What is your gender?", choices: ["Male", "Female", "Other", "Prefer not to say"] },
	{ type: "radiogroup", name: "native", isRequired: true, title: "Are you a native English speaker", choices: ["Yes", "No"] },
	{ type: "text", name: "native language", visibleIf: "{native}='No'", title: "Please indicate your native language or languages:" },
	{ type: "text", name: "languages", title: "What other languages do you speak?" },
	{ type: "text", name: "age", title: "What is your age?", width: "auto" },
	{ type: "radiogroup", name: "degree", isRequired: true, title: "What is the highest degree or level of school you have completed. If currently enrolled, indicate highest degree received.", choices: ["Less than high school", "High school diploma", "Some college, no degree", "associates|Associate's degree", "bachelors|Bachelor's degree", "masters|Master's degree", "PhD, law, or medical degree", "Prefer not to say"] },
	{ type: "radiogroup", name: "cats_experience", isRequired: true, title: "How much do you know about cats<?", choices: ["(1) Less than an average person", "(2) About the same as average", "(3) More than average", "(4) Much more than average"] },
	{ type: "radiogroup", name: "dogs_experience", isRequired: true, title: "How much do you know about dogs<?", choices: ["(1) Less than an average person", "(2) About the same as average", "(3) More than average", "(4) Much more than average"] },
	{ type: "radiogroup", name: "birds_experience", isRequired: true, title: "How much do you know about birds<?", choices: ["(1) Less than an average person", "(2) About the same as average", "(3) More than average", "(4) Much more than average"] },
	{ type: "radiogroup", name: "fish_experience", isRequired: true, title: "How much do you know about fish<?", choices: ["(1) Less than an average person", "(2) About the same as average", "(3) More than average", "(4) Much more than average"] },
	{ type: "radiogroup", name: "cars_experience", isRequired: true, title: "How much do you know about cars<?", choices: ["(1) Less than an average person", "(2) About the same as average", "(3) More than average", "(4) Much more than average"] },
	{ type: "radiogroup", name: "trains_experience", isRequired: true, title: "How much do you know about trains<?", choices: ["(1) Less than an average person", "(2) About the same as average", "(3) More than average", "(4) Much more than average"] },
	{ type: "radiogroup", name: "planes_experience", isRequired: true, title: "How much do you know about planes<?", choices: ["(1) Less than an average person", "(2) About the same as average", "(3) More than average", "(4) Much more than average"] },
	{ type: "radiogroup", name: "boats_experience", isRequired: true, title: "How much do you know about boats<?", choices: ["(1) Less than an average person", "(2) About the same as average", "(3) More than average", "(4) Much more than average"] }
];
#!/usr/bin/env python
import random
from itertools import permutations, combinations_with_replacement, combinations
import pandas as pd
import sys

images = pd.read_csv('filesdoc1.csv')
question_ids = images.Question_ID.unique()

def createCombos(stims):
    stimCombos=[]
    for i in range(1):
        stimCombos= stimCombos + list(combinations(stims, 2))

    stimCombos = stimCombos 
    return stimCombos

positions = ['left','right']
positionPermutations = list(permutations(positions, 2))
ratioDiffSame = 2
separator = ","


def circularList(lst,seed):
	if not isinstance(lst,list):
		lst = range(lst)
	i = 0
	#random.seed(seed)
	random.shuffle(lst)
	while True:
		yield lst[i]
		if (i+1) % len(lst) ==0:
			random.shuffle(lst)
		i = (i + 1)%len(lst)


						
def generateTrials(runTimeVars,runTimeVarsOrder):
	testFile = open('trials/'+runTimeVars['workerId']+ '_trials.csv','w')
	print runTimeVarsOrder
	header = separator.join(runTimeVarsOrder) + separator + separator.join(("Category", "Subcategory1","Subcategory2","firstStimPosition", "secondStimPosition","pic1","pic2"))
	print >>testFile, header
	seed = int(runTimeVars['seed'])
	#random.seed(seed)
	trialList =[]
	positionList = circularList(positionPermutations,seed+1)
	
	
	subcategory = images[['Image', 'subcategory']]
	

	ID = images.ID.unique()	
	
	

	
# If I put this part in the loop below it will select more than one exemplar within a subID e.g., owl. This keeps it constant so the same 'owl' is compared with each other subID member.
	catag1 = random.choice(ID)
	images_with1 = list(images.loc[
		(images.ID == (catag1)) & (images.Question_ID == random.choice(question_ids)),
		'Image'])
	C2 = [x for x in ID if x not in catag1]
	catag2 = random.choice(C2)
	images_with2 = list(images.loc[
		(images.ID == (catag2)) & (images.Question_ID == random.choice(question_ids)),
		'Image'])
	C3 = [x for x in C2 if x not in catag2]
	catag3 = random.choice(C3)
	images_with3 = list(images.loc[
		(images.ID == (catag3)) & (images.Question_ID == random.choice(question_ids)),
		'Image'])
	C4 = [x for x in C3 if x not in catag3]
	catag4 = random.choice(C4)
	images_with4 = list(images.loc[
		(images.ID == (catag4)) & (images.Question_ID == random.choice(question_ids)),
		'Image'])
	C5 = [x for x in C4 if x not in catag4]
	catag5 = random.choice(C5)
	images_with5 = list(images.loc[
		(images.ID == (catag5)) & (images.Question_ID == random.choice(question_ids)),
		'Image'])
	C6 = [x for x in C5 if x not in catag5]
	catag6 = random.choice(C6)
	images_with6 = list(images.loc[
		(images.ID == (catag6)) & (images.Question_ID == random.choice(question_ids)),
		'Image'])
	C7 = [x for x in C6 if x not in catag6]
	catag7 = random.choice(C7)
	images_with7 = list(images.loc[
		(images.ID == (catag7)) & (images.Question_ID == random.choice(question_ids)),
		'Image'])
	C8 = [x for x in C7 if x not in catag7]
	catag8 = random.choice(C8)
	images_with8 = list(images.loc[
		(images.ID == (catag8)) & (images.Question_ID == random.choice(question_ids)),
		'Image'])





	stimList1 = createCombos(images_with1)
	stimList2 = createCombos(images_with2)
	stimList3 = createCombos(images_with3)
	stimList4 = createCombos(images_with4)
	stimList5 = createCombos(images_with5)
	stimList6 = createCombos(images_with6)
	stimList7 = createCombos(images_with7)
	stimList8 = createCombos(images_with8)
	

	
	for curIter in range(1):
					
				for curCombination in stimList1:
				   curIsSimult=1
				   pic1 = curCombination[0]
				   pic2 = curCombination[1]
				   curPosition = positionList.next() 
				   subC1 = images.loc[images['Image'] == pic1, 'subcategory'].iloc[0]
				   subC2 = images.loc[images['Image'] == pic2, 'subcategory'].iloc[0]
				   (firstStimPosition, secondStimPosition) = (curPosition[0],curPosition[1])
				   maincata = images.loc[images['Image'] == pic1, 'category'].iloc[0]
				   trialList.append(separator.join((str(maincata), str(subC1), str(subC2), firstStimPosition,secondStimPosition,pic1,pic2)))
				for curCombination in stimList2:
				   curIsSimult=1
				   pic1 = curCombination[0]
				   pic2 = curCombination[1]
				   curPosition = positionList.next() 
				   subC1 = images.loc[images['Image'] == pic1, 'subcategory'].iloc[0]
				   subC2 = images.loc[images['Image'] == pic2, 'subcategory'].iloc[0]
				   (firstStimPosition, secondStimPosition) = (curPosition[0],curPosition[1])
				   maincata = images.loc[images['Image'] == pic1, 'category'].iloc[0]
				   trialList.append(separator.join((str(maincata), str(subC1), str(subC2), firstStimPosition,secondStimPosition,pic1,pic2)))
				for curCombination in stimList3:
				   curIsSimult=1
				   pic1 = curCombination[0]
				   pic2 = curCombination[1]
				   curPosition = positionList.next() 
				   subC1 = images.loc[images['Image'] == pic1, 'subcategory'].iloc[0]
				   subC2 = images.loc[images['Image'] == pic2, 'subcategory'].iloc[0]
				   (firstStimPosition, secondStimPosition) = (curPosition[0],curPosition[1])
				   maincata = images.loc[images['Image'] == pic1, 'category'].iloc[0]
				   trialList.append(separator.join((str(maincata), str(subC1), str(subC2), firstStimPosition,secondStimPosition,pic1,pic2)))
				for curCombination in stimList4:
				   curIsSimult=1
				   pic1 = curCombination[0]
				   pic2 = curCombination[1]
				   curPosition = positionList.next() 
				   subC1 = images.loc[images['Image'] == pic1, 'subcategory'].iloc[0]
				   subC2 = images.loc[images['Image'] == pic2, 'subcategory'].iloc[0]
				   (firstStimPosition, secondStimPosition) = (curPosition[0],curPosition[1])
				   maincata = images.loc[images['Image'] == pic1, 'category'].iloc[0]
				   trialList.append(separator.join((str(maincata), str(subC1), str(subC2), firstStimPosition,secondStimPosition,pic1,pic2)))
				for curCombination in stimList5:
				   curIsSimult=1
				   pic1 = curCombination[0]
				   pic2 = curCombination[1]
				   curPosition = positionList.next() 
				   subC1 = images.loc[images['Image'] == pic1, 'subcategory'].iloc[0]
				   subC2 = images.loc[images['Image'] == pic2, 'subcategory'].iloc[0]
				   (firstStimPosition, secondStimPosition) = (curPosition[0],curPosition[1])
				   maincata = images.loc[images['Image'] == pic1, 'category'].iloc[0]
				   trialList.append(separator.join((str(maincata), str(subC1), str(subC2), firstStimPosition,secondStimPosition,pic1,pic2)))
				for curCombination in stimList6:
				   curIsSimult=1
				   pic1 = curCombination[0]
				   pic2 = curCombination[1]
				   curPosition = positionList.next() 
				   subC1 = images.loc[images['Image'] == pic1, 'subcategory'].iloc[0]
				   subC2 = images.loc[images['Image'] == pic2, 'subcategory'].iloc[0]
				   (firstStimPosition, secondStimPosition) = (curPosition[0],curPosition[1])
				   maincata = images.loc[images['Image'] == pic1, 'category'].iloc[0]
				   trialList.append(separator.join((str(maincata), str(subC1), str(subC2), firstStimPosition,secondStimPosition,pic1,pic2)))
				for curCombination in stimList7:
				   curIsSimult=1
				   pic1 = curCombination[0]
				   pic2 = curCombination[1]
				   curPosition = positionList.next() 
				   subC1 = images.loc[images['Image'] == pic1, 'subcategory'].iloc[0]
				   subC2 = images.loc[images['Image'] == pic2, 'subcategory'].iloc[0]
				   (firstStimPosition, secondStimPosition) = (curPosition[0],curPosition[1])
				   maincata = images.loc[images['Image'] == pic1, 'category'].iloc[0]
				   trialList.append(separator.join((str(maincata), str(subC1), str(subC2), firstStimPosition,secondStimPosition,pic1,pic2)))
				for curCombination in stimList8:
				   curIsSimult=1
				   pic1 = curCombination[0]
				   pic2 = curCombination[1]
				   curPosition = positionList.next() 
				   subC1 = images.loc[images['Image'] == pic1, 'subcategory'].iloc[0]
				   subC2 = images.loc[images['Image'] == pic2, 'subcategory'].iloc[0]
				   (firstStimPosition, secondStimPosition) = (curPosition[0],curPosition[1])
				   maincata = images.loc[images['Image'] == pic1, 'category'].iloc[0]
				   trialList.append(separator.join((str(maincata), str(subC1), str(subC2), firstStimPosition,secondStimPosition,pic1,pic2)))
	
	
	trialList = trialList[:224]
	
	random.shuffle(trialList)
	
	for curTrialList in trialList:
		trialData = separator.join([str(runTimeVars[curRuntimeVar]) for curRuntimeVar in runTimeVarsOrder])+separator+curTrialList
		print >>testFile, trialData
							
if __name__ == "__main__":
    trialList = generateTrials({'workerId':sys.argv[1], 'seed':19},['workerId', 'seed'])

	
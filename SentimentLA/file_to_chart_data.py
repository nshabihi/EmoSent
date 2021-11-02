import pandas as pd
import os
from datetime import datetime
from collections import defaultdict
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import nltk
#nltk.download('punkt')
from nltk import tokenize
import pandas as pd
from nltk import word_tokenize
from nltk.stem.snowball import SnowballStemmer
from tqdm import tqdm_notebook as tqdm
from tqdm import trange
import numpy as np
from django.conf import settings
import time

from SentimentLA.FileProcessing import checkFileType

def text_emotion(df, column):
    '''
    Takes a DataFrame and a specified column of text and adds 10 columns to the
    DataFrame for each of the 10 emotions in the NRC Emotion Lexicon, with each
    column containing the value of the text in that emotions
    INPUT: DataFrame, string
    OUTPUT: the original DataFrame with ten new columns
    '''

    new_df = df.copy()

    #filepath = ('C:/SampleDS/NRC_emotion_lexicon_list.txt')
    filepath = os.path.join(settings.MEDIA_ROOT, 'NRC_emotion_lexicon_list.txt')
    
    emolex_df = pd.read_csv(filepath,
                            names=["word", "emotion", "association"],
                            sep='\t')
    emolex_words = emolex_df.pivot(index='word',
                                   columns='emotion',
                                   values='association').reset_index()
    emotions = emolex_words.columns.drop('word')
    emo_df = pd.DataFrame(0, index=df.index, columns=emotions)

    stemmer = SnowballStemmer("english")

    
    group = ''
    student = ''
    print(len(list(new_df.iterrows())))
    print(tqdm(total=len(list(new_df.iterrows()))))
    with tqdm(total=len(list(new_df.iterrows()))) as pbar:
        for i, row in new_df.iterrows():
            pbar.update(1)
            if row['group'] != group:
                print(row['group'])
                group = row['group']
            if row['student'] != student:
                print('   ', row['student'])
                student = row['student']
                chap = row['student']
            document = word_tokenize(new_df.loc[i][column])
            for word in document:
                word = stemmer.stem(word.lower())
                emo_score = emolex_words[emolex_words.word == word]
                if not emo_score.empty:
                    for emotion in list(emotions):
                        emo_df.at[i, emotion] += emo_score[emotion]

    new_df = pd.concat([new_df, emo_df], axis=1)

    return new_df



def fileConvert_KFDataDetail(inputFile):
    # --------------xlsx file---------------
    try:
        if checkFileType(inputFile) == "xlsx":
            df = pd.read_excel("KF Sample.xlsx")

        # --------------csv file---------------
        elif checkFileType(inputFile) == "csv":
            df = pd.read_csv(inputFile)
        else:
            raise Exception("Invalid Data Type..")
    except IOError:
        print("Cannot find the file..")
        return None
    except Exception:
        print("Unknown error occurred..")
        return None

    numOfMsg = len(df["Title"])
    type = []
    discussionTopic = []
    author = []
    title = []
    body = []
    created = []
    scaffolds = []
    keywords = []
    views = []
    buildson = []
    editBy = []
    readBy = []
    group = []
    for i in range (numOfMsg):
        type.append(3)
        discussionTopic.append(None)
    for elem in df["Authors"]:
        author.append(elem)
    for elem in df["Title"]:
        title.append(elem)
    for elem in df["Body"]:
        body.append(elem)
    for elem in df["Created"]:
        created.append(elem)
    for elem in df["Scaffold(s)"]:
        scaffolds.append(elem)
    for elem in df["Keyword(s)"]:
        keywords.append(elem)
    for elem in df["Views"]:
        views.append(elem)
    for elem in df["Buildson"]:
        buildson.append(elem)
    for elem in df["Edit By"]:
        editBy.append(elem)
    for elem in df["Read By"]:
        readBy.append(elem)
    for elem in df["Group"]:
        group.append(elem)

    result = pd.DataFrame(
        {
            "Type": type,
            "DiscussionTopic" : discussionTopic,
            "Author" : author,
            "Title" : title,
            "Body" : body,
            "Created" : created,
            "Scaffolds" : scaffolds,
            "Keywords" : keywords,
            "Views" : views,
            "Buildson" : buildson,
            "Edit By" : editBy,
            "Read By" : readBy,
            "Group" : group

        }
    )
    return result


def fileConvert_KFDataSimple(inputFile):
    # --------------xlsx file---------------
    try:
        if checkFileType(inputFile) == "xlsx":
            df = pd.read_excel(inputFile)

        # --------------csv file---------------
        elif checkFileType(inputFile) == "csv":
            df = pd.read_csv(inputFile)
        else:
            raise Exception("Invalid Data Type..")
    except IOError:
        print("Cannot find the file..")
        return None
    except Exception:
        print("Unknown error occurred..")
        return None

    numOfMsg = len(df["Title"])
    type = []
    discussionTopic = []
    title = []
    author = []
    body = []
    created = []
    scaffolds = []
    keywords = []
    views = []
    buildson = []
    editBy = []
    readBy = []
    group = []
    for i in range (numOfMsg):
        type.append(2)
        discussionTopic.append(None)
        scaffolds.append(None)
        keywords.append(None)
        views.append(None)
        buildson.append(None)
        editBy.append(None)
        readBy.append(None)
        group.append(None)
    for elem in df["Title"]:
        title.append(elem)
    for elem in df["Authors"]:
        author.append(elem)
    for elem in df["Body"]:
        body.append(elem)
    for elem in df["Created"]:
        created.append(elem)

    result = pd.DataFrame(
        {
            "Type": type,
            "DiscussionTopic" : discussionTopic,
            "Author" : author,
            "Title" : title,
            "Body" : body,
            "Created" : created,
            "Scaffolds" : scaffolds,
            "Keywords" : keywords,
            "Views" : views,
            "Buildson" : buildson,
            "Edit By" : editBy,
            "Read By" : readBy,
            "Group" : group
        }
    )
    print("///////////////////////////////")
    print(result)
    return result

def date_normalization (str1):
    if str1[1] == "/":
        str1 = "0"+str1
    if(str1[4]) == "/":
        str1 = str1[0:3]+ "0" + str1[3:]
        
    str1 = str1[0:6] + str1[8:]
    return str1
    
def convert24(str1): 
      
    # Checking if last two elements of time 
    # is AM and first two elements are 12 
    if str1[-2:] == "AM" and str1[10:12] == "12": 
        return str1[0:10] + "00" + str1[12:-2] 
          
    # remove the AM     
    elif str1[-2:] == "AM": 
        return str1[:-2] 
      
    # Checking if last two elements of time 
    # is PM and first two elements are 12    
    elif str1[-2:] == "PM" and str1[10:12] == "12": 
        return str1[:-2] 
          
    else: 
          
        # add 12 to hours and remove PM 
        return str1[0:10] + str(int(str1[10:12]) + 12) + str1[12:-2] 
  
    
def text2time(date_time_str):
    
    date_time_obj = datetime.strptime(date_time_str, '%m/%d/%y, %H:%M:%S ')
    
    return date_time_obj


def str2list(str1):
    str1 = str1.replace(" ,", ",")
    str1 = str1.replace(", ", ",")
    list1 = str1.split(",")
    return list1



def df2dict(file, contentType):
    
    if contentType == "kf_simple":
        df_temp = fileConvert_KFDataSimple(file)
    else:
        df_temp = fileConvert_KFDataDetail(file)

    learning_class = defaultdict(dict)
    posts = defaultdict(dict)
    std_num = 0
    post = defaultdict(dict)
    group = "G1" 
    
    # set groups for kf_detailed and kf_simple
    if contentType == "kf_simple":
        groups = ["All Students"]
    else:
        groups = df_temp.loc[: , "Group"]

    group_set = set (groups)
    
    names = df_temp.loc[: , "Author"]
    names_set = set (names)

    items = []
    for i in range(len(df_temp)):
        items.append(i)
    remaining = []
    for i in range(len(df_temp)):
        remaining.append("i"+str(i))

    for group in group_set:
        for name in names_set:
            std_num += 1
            post_num = 0

            for i in items:
                if (("i"+str(i)) in remaining and name == (df_temp.loc[i, "Author"]) and ((group == "All Students") or (group == (df_temp.loc[i, "Group"])))):
                    post_num += 1
                    
                    #title
                    post[post_num]["title"] = (str(df_temp.loc[i, "Title"]))

                    #body
                    post[post_num]["body"] = (str(df_temp.loc[i, "Body"]))
                    
                    #created
                    date_time_str = str(df_temp.loc[i, "Created"])
                    date_time_str = date_normalization (date_time_str)
                    date_time_str = convert24(date_time_str)
                    date_time = text2time(date_time_str)
                    post[post_num]["created"] = (date_time)

                    if contentType == "kf_detailed":
                        #scaffolds
                        scaf_text = str(df_temp.loc[i, "Scaffolds"])
                        scaf_list = str2list(scaf_text)
                        post[post_num]["scaffolds"] = scaf_list
                        
                        #keywords
                        keyw_text = str(df_temp.loc[i, "Keywords"])
                        keyw_list = str2list(keyw_text)
                        post[post_num]["keywords"] = keyw_list
                        
                        #views
                        post[post_num]["views"] = (str(df_temp.loc[i, "Views"]))
                        
                        #buildson
                        post[post_num]["buildson"] = (str(df_temp.loc[i, "Buildson"]))
                        
                        #editby
                        editby_text = str(df_temp.loc[i, "Edit By"])
                        editby_list = str2list(editby_text)
                        post[post_num]["editby"] = editby_list
                        
                        #readby
                        readby_text = str(df_temp.loc[i, "Read By"])
                        readby_list = str2list(readby_text)
                        post[post_num]["readby"] = readby_list

                    posts[name]["post" + str(post_num)] = ((post[post_num]))
                    post.clear()

                    remaining.remove("i"+str(i))

            learning_class[group][name] = (posts[name])
            posts.clear()
    print(">>>>>>>>>>>>>>>>>>...")
    print(learning_class)
    return learning_class



#MAIN!
def file_to_chart_data_main(file, fileType, contentType):
    
    learning_class = defaultdict(dict)
    analyzer = SentimentIntensityAnalyzer()

    learning_class = df2dict (file, contentType)

    #assign sentiment score to posts
    for key in learning_class:
        k1 = key
        for key in learning_class[k1]:
            k2 = key
            for key in learning_class[k1][k2]:
                k3 = key
                text = learning_class[k1][k2][k3]["body"]
                sentence_list = tokenize.sent_tokenize(text)
                sentiments = {'compound': 0.0, 'neg': 0.0, 'neu': 0.0, 'pos': 0.0}
                for sentence in sentence_list:
                    vs = analyzer.polarity_scores(sentence)
                    sentiments['compound'] += vs['compound']
                    sentiments['neg'] += vs['neg']
                    sentiments['neu'] += vs['neu']
                    sentiments['pos'] += vs['pos']
                
                sentiments['compound'] = sentiments['compound'] / len(sentence_list)
                sentiments['neg'] = sentiments['neg'] / len(sentence_list)
                sentiments['neu'] = sentiments['neu'] / len(sentence_list)
                sentiments['pos'] = sentiments['pos'] / len(sentence_list)
                
                learning_class[k1][k2][k3]["senti"] = sentiments
            
    # assigning emotion score to posts
    if contentType == "kf_simple":
        data = {'group': [], 'student': [], 'post': [], 'time': [], 'senti':[]}
    else:
        data = {'group': [], 'student': [], 'post': [], 'time': [], 'scaffold':[] , 'senti':[]}

    for key in learning_class:
        k1 = key
        for key in learning_class[k1]:
            k2 = key
            for key in learning_class[k1][k2]:
                k3 = key
                data["group"].append(k1)
                data["student"].append(k2)
                data["post"].append(learning_class[k1][k2][k3]["body"])
                data["time"].append(learning_class[k1][k2][k3]["created"])
                data["senti"].append(learning_class[k1][k2][k3]["senti"])
                if contentType == "kf_detailed":
                    data["scaffold"].append(learning_class[k1][k2][k3]["scaffolds"])
       
    df_kf = pd.DataFrame(data=data)
    df_kf = text_emotion(df_kf, "post")

    df_kf_before_col_change = df_kf
    if contentType == "kf_simple":
        new_col_list = ['group', 'student', 'post', 'time', 'joy', 'trust', 'fear',
        'surprise','sadness','disgust','anger' ,'anticipation', 'senti']
    else:
        new_col_list = ['group', 'student', 'post', 'time', 'joy', 'trust', 'fear',
        'surprise','sadness','disgust','anger' ,'anticipation','scaffold', 'senti']
    
    df_kf = df_kf[new_col_list]

    # adding sentiment scores to the df_kf dataframe
    df_sentis = pd.DataFrame(columns=["s-positive", "s-negative", "s-neutral"])
    for i in range(df_kf.shape[0]):
        df_sentis = df_sentis.append({"s-positive": df_kf.iloc[i]["senti"]["pos"],
                                      "s-negative": df_kf.iloc[i]["senti"]["neg"] ,
                                      "s-neutral" : df_kf.iloc[i]["senti"]["neu"]},
                                     ignore_index=True)
    df_kf = df_kf.join(df_sentis)

#######################################  Bubble Chart  ############################################
   
    #for group compare in bubble chart
    df_temp_bubble = df_kf.groupby('group', as_index=False)['joy', 'trust', 'fear',
    'surprise','sadness','disgust','anger' ,'anticipation','s-negative', 's-positive','s-neutral'].mean()

# set chart title
    grp_num = len(df_temp_bubble)

    # one Group
    if grp_num == 1:
        chart_title_emotion = "Overall Emotion Score"
        chart_title_senti = "Overall Sentiment Score"
        chart_sub_title_emotion = "This chart shows Average Emotion Score of students."
        chart_sub_title_senti = "This chart shows Average Sentiment Score of students."


    # mor ethan one group
    else:
        chart_title_emotion = "Overall Emotion Score"
        chart_title_senti = "Overall Sentiment Score"
        chart_sub_title_emotion = "This chart shows Emotion Score for different groups."
        chart_sub_title_senti = "This chart shows Sentiment Score for different groups."


    bubble_list = []
    bubble_list.append(chart_title_emotion)
    bubble_list.append("&")
    bubble_list.append(chart_title_senti)
    bubble_list.append("&")
    bubble_list.append (chart_sub_title_emotion)
    bubble_list.append("&")
    bubble_list.append (chart_sub_title_senti)
    bubble_list.append("&")

# set chart data    
    for i in range(1,len(df_temp_bubble.columns)):
        bubble_list.append(df_temp_bubble.columns[i])

    for i in range(df_temp_bubble.shape[0]):
        bubble_list.append("&")
        for j in range(df_temp_bubble.shape[1]):
            d = df_temp_bubble.iloc[i].values[j]
            if (isinstance(d, float)):
                bubble_list.append(str("{:.2f}".format(d)))
            else:
                bubble_list.append(str(d))



#######################################  Line Chart  ############################################
   
    #line chart data
    line_list = []
    line_list_temp = []
    df_temp_line = df_kf[['student', 'time', 'joy', 'trust', 'fear','surprise',
                          'sadness','disgust','anger' ,'anticipation',
                          's-negative', 's-positive','s-neutral']]

    names = df_temp_line.loc[: , "student"]
    names_set = set (names)

    #set title and subtitle for line chart
    chart_title_emotion = "Emotion Change"
    chart_title_senti = "Sentiment Change"
    chart_sub_title_emotion = "To check Emotion Change for each student, select a student name from the 'Search Students' list."
    chart_sub_title_senti = "To check Sentiment Change for each student, select a student name from the 'Search Students' list."
    
    line_list.append (chart_title_emotion)
    line_list.append("&")
    line_list.append (chart_title_senti)
    line_list.append("&")
    line_list.append (chart_sub_title_emotion)
    line_list.append("&")
    line_list.append (chart_sub_title_senti)
    line_list.append("&")


    
    for i in range(2,len(df_temp_line.columns)):
        line_list.append(df_temp_line.columns[i])


    #initialization for finding min and max times
    print(df_temp_line.iloc[0])
    sampletime = str(df_temp_line.iloc[0].values[1])
    mintime = sampletime[0:10]
    maxtime = mintime
    t = (int(sampletime[0:4]),int(sampletime[5:7]),int(sampletime[8:10]),0,0,0,0,0,0)
    mintime_epoch = time.mktime(t)
    maxtime_epoch = mintime_epoch
    
    for name in names_set:
        line_list.append("&")
        line_list.append(name)
        student_df = df_temp_line.loc[df_temp_line['student'] == name]
        for row in range(student_df.shape[0]):
            line_list.append('/')
            for col in range(1, student_df.shape[1]):
                d = student_df.iloc[row].values[col]
                 #col=1 indicates the time data
                if (col == 1):
                    line_list.append(str(d))
                    d = str(d)
                    t = (int(d[0:4]),int(d[5:7]),int(d[8:10]),0,0,0,0,0,0)
                    print(t)
                    new_epoch = time.mktime(t)
                    
                    if (new_epoch < mintime_epoch):
                        mintime = d[0:10]
                        mintime_epoch = new_epoch
                    elif (new_epoch > maxtime_epoch):
                        maxtime = d[0:10]
                        maxtime_epoch = new_epoch
                # emotion values        
                else:
                    if (isinstance(d, float)):
                        line_list.append(str("{:.2f}".format(d)))
                    else:
                        line_list.append(str(d))

    time_list = []
    time_list.append(mintime)
    time_list.append("&")
    time_list.append(maxtime)
    time_list.append("&")
    line_list = time_list+line_list
    print("mintime" + str(mintime))
    print("maxtime" + str(maxtime))



#######################################  HEAT MAP  ############################################
    

    # HEAT_MAP CHART # : preparing chart data for HEAT_MAP CHART
    heatmap_list = []

    #set title and subtitle for heatmap chart
    chart_title_emotion = "Daily Primary Emotion"
    chart_title_senti = "Daily Primary Sentiment"
    chart_sub_title_emotion = "This figure shows the primary emotion of each student based on time."
    chart_sub_title_senti = "This figure shows the primary sentiment of each student based on time."
    
    
    heatmap_list.append (chart_title_emotion)
    heatmap_list.append("&")
    heatmap_list.append (chart_title_senti)
    heatmap_list.append("&")
    heatmap_list.append (chart_sub_title_emotion)
    heatmap_list.append("&")
    heatmap_list.append (chart_sub_title_senti)


    df_temp_heatmap = df_kf[['student', 'time']]
    emotion_df = df_kf[['joy', 'trust', 'fear','surprise','sadness','disgust',
                        'anger' ,'anticipation']]

    #heatmap emotion list
    emo_list_heatmap = emotion_df.columns.tolist()

    #find the emotion with the max score for each post
    max_objs = emotion_df.max(axis=1)
    max_objs = max_objs.astype(np.float32)
    maxvalue = max_objs.max()
    max_Objs_index = emotion_df.idxmax(axis=1)

    #normalize emotions to 0-1 and shift them (+i) based on their position(i) in th eemotion list
    for i in range(len(max_objs)):
        if max_objs[i] == maxvalue:
            max_objs[i] = "{:.2f}".format(max_objs[i]/maxvalue - 0.01  + emo_list_heatmap.index(str(max_Objs_index[i])))
        else:
            max_objs[i] = "{:.2f}".format(max_objs[i]/maxvalue  + emo_list_heatmap.index(str(max_Objs_index[i])))

    #merge heatmap dataframe with max_emotion and its score                                           
    df_temp_heatmap = pd.concat([df_temp_heatmap, max_Objs_index, max_objs], axis=1)
    df_temp_heatmap = df_temp_heatmap.rename(columns={0: 'emotion' , 1: 'emo_score'})

    #keep only year, month, and day for time
    for i in range(len(df_temp_heatmap)):
        t = str(df_temp_heatmap.iloc[i]["time"])
        t = t.split(" ")
        df_temp_heatmap.at[i , "time"] = datetime.strptime(t[0], '%Y-%m-%d')

    #only keep one value per day for a student
    for i in range(len(df_temp_heatmap)-1):
        for j in range(i+1 , len(df_temp_heatmap)):
            if (df_temp_heatmap.iloc[i]["time"] == df_temp_heatmap.iloc[j]["time"]):
                if (df_temp_heatmap.iloc[i]["student"] == df_temp_heatmap.iloc[j]["student"]):
                    if (df_temp_heatmap.iloc[i]['emo_score'] > df_temp_heatmap.iloc[j]['emo_score']):
                        df_temp_heatmap.at[j, 'emotion'] = "del"
                    else:
                        df_temp_heatmap.at[j, 'emotion'] = "del"

    for index, row in df_temp_heatmap.iterrows():
        if row["emotion"] == "del":
            df_temp_heatmap.drop(index, inplace=True)    

    # reset index numbers after deleting some rows in the previous section
    df_temp_heatmap = df_temp_heatmap.reset_index(drop=True)

    #sore the dataframe based on student names and create a set of student names
    df_temp_heatmap = df_temp_heatmap.sort_values(by=['student'])
    students = df_temp_heatmap.loc[: , "student"]
    student_set = set (students)

    #find min and max time and append in to the heatmap_list
    mintime = str(df_temp_heatmap["time"].min(skipna=False)).split(" ")
    maxtime = str(df_temp_heatmap["time"].max(skipna=False)).split(" ")

    heatmap_list.append(mintime[0])
    heatmap_list.append("&")
    heatmap_list.append(maxtime[0])
    heatmap_list.append("&")

    #append emotion list to heatmap_list
    for i in range(len(emo_list_heatmap)):
        heatmap_list.append(emo_list_heatmap[i])
        
    std_count = 0
    for std in student_set:
        heatmap_list.append("&")
        heatmap_list.append(std)
        std_count += 1
        for i in range(len(df_temp_heatmap)):
            if std == df_temp_heatmap.iloc[i]["student"]:
                heatmap_list.append("/")
                t = str(df_temp_heatmap.iloc[i]["time"]).split(" ")
                heatmap_list.append(t[0])
                heatmap_list.append(str(std_count))
                heatmap_list.append(str(df_temp_heatmap.iloc[i]["emo_score"]))



####################################### stacked bar chart #########################################

    # STACKED BAR CHART : preparing chart data for BAR CHART
    df_temp_stacked_bar = df_kf[['time', 'joy', 'trust', 'fear','surprise',
                          'sadness','disgust','anger' ,'anticipation',
                          's-negative', 's-positive','s-neutral']]

    df_temp_stacked_bar['time'] = df_temp_stacked_bar['time'].dt.strftime('%Y-%m-%d')


    df_temp_stacked_bar = df_temp_stacked_bar.groupby('time', as_index=False)['joy', 'trust', 'fear',
    'surprise','sadness','disgust','anger' ,'anticipation','s-negative', 's-positive','s-neutral'].mean()


    stackedbar_list = []

    #chart title and subtitle:
    chart_title_emotion = "Daily Average Emotion Score"
    chart_title_senti = "Daily Average Sentiment Score"
    chart_sub_title_emotion = "This chart shows Daily Average Emotion Score. Use the legend to select emotions."
    chart_sub_title_senti = "This chart shows Daily Average Sentiment Score. Use the legend to select sentiments."

    

    stackedbar_list.append(chart_title_emotion)
    stackedbar_list.append("&")
    stackedbar_list.append(chart_title_senti)
    stackedbar_list.append("&")
    stackedbar_list.append (chart_sub_title_emotion)
    stackedbar_list.append("&")
    stackedbar_list.append (chart_sub_title_senti)
    stackedbar_list.append("&")

    #appending min and max time
    stackedbar_list.append(df_temp_stacked_bar.iloc[0].values[0])
    stackedbar_list.append("&")
    stackedbar_list.append(df_temp_stacked_bar.iloc[df_temp_stacked_bar.shape[0]-1].values[0])
    stackedbar_list.append("&")

    #appending emotion categories
    for i in range(1,len(df_temp_stacked_bar.columns)):
        stackedbar_list.append(df_temp_stacked_bar.columns[i])

    #appending data
    for i in range(df_temp_stacked_bar.shape[0]):
        stackedbar_list.append("&")
        for j in range(df_temp_stacked_bar.shape[1]):
            d = df_temp_stacked_bar.iloc[i].values[j]
            if (isinstance(d, float)):
                stackedbar_list.append(str("{:.2f}".format(d)))
            else:
                stackedbar_list.append(str(d))

#######################################  Lists 2 text  ############################################
                
    bubble_text = ','.join(bubble_list)
    line_text = ','.join(line_list)
    heatmap_text = ','.join(heatmap_list)
    stackedbar_text = ','.join(stackedbar_list)

    if contentType == "kf_simple":
        polar_text = ""
    else:
        polar_text = "Activity Based Emotion Score,&,Activity Based Sentiment Score,&,subtitle emotion,&,subtitle sentiment,&,joy,trust,fear,surprise,sadness,disgust,anger,anticipation,s-negative,s-positive,s-neutral,&,1,2,3,4,1,2,1,2,3,4,5,&,2,3,4,1,2,3,1,2,3,4,5,&,3,4,1,2,3,4,1,2,3,4,5,&,2,4,1,2,5,5,1,2,3,4,5,&,4,2,1,5,4,5,1,2,3,4,5"
        
    return bubble_text, line_text, polar_text, stackedbar_text, heatmap_text
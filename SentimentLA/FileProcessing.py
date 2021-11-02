import pandas as pd
import docx
import os

def checkFileType (fileName):
    if fileName[-3:] == "txt":
        return "txt"
    elif fileName[-3:] =="doc":
        return "docx"
    elif fileName[-4:] =="docx":
        return "docx"
    elif fileName[-4:] == "xlsx":
        return "xlsx"
    elif fileName[-3:] == "csv":
        return "csv"
    else:
        return "NOK"
        #raise Exception("Invalid Data Type..")
def fileConvert_FreeText(inputFile):
    # --------------txt file---------------
    if checkFileType(inputFile) == "txt":
        try:
            fileReader = open(inputFile,"r")
            data = ""
            for line in fileReader:
                data = data + line

            fileReader.close()

        except IOError:
            print("Cannot find the file..")
            return None
        except Exception:
            print("Unknown error occurred..")
            return None

    # --------------docx file---------------
    elif checkFileType(inputFile) == "docx":
        try:
            doc = docx.Document(inputFile)
            docData = []
            for para in doc.paragraphs:
                docData.append(para.text.strip())
            data = docData[0]
        except IOError:
            print("Cannot find the file..")
            return None
        except Exception:
            print("Unknown error occurred..")
            return None

    else:
        raise Exception("Invalid Data Type..")
    df = pd.DataFrame(
        {
            "Type": [1],
            "DiscussionTopic" : None,
            "Title" : None,
            "Author" : None,
            "Body" : data,
            "Created" : None,
            "Scaffolds" : None,
            "Keywords" : None,
            "Views" : None,
            "Buildson" : None,
            "Edit By" : None,
            "Read By" : None
        }
    )
    return df


def fileConvert_KFData(inputFile):
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
    for i in range (numOfMsg):
        type.append(2)
        discussionTopic.append(None)
        scaffolds.append(None)
        keywords.append(None)
        views.append(None)
        buildson.append(None)
        editBy.append(None)
        readBy.append(None)
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
            "Title" : title,
            "Author" : author,
            "Body" : body,
            "Created" : created,
            "Scaffolds" : scaffolds,
            "Keywords" : keywords,
            "Views" : views,
            "Buildson" : buildson,
            "Edit By" : editBy,
            "Read By" : readBy

        }
    )
    return result


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
    for i in range (numOfMsg):
        type.append(3)
        discussionTopic.append(None)
    for elem in df["Title"]:
        title.append(elem)
    for elem in df["Authors"]:
        author.append(elem)
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

    result = pd.DataFrame(
        {
            "Type": type,
            "DiscussionTopic" : discussionTopic,
            "Title" : title,
            "Author" : author,
            "Body" : body,
            "Created" : created,
            "Scaffolds" : scaffolds,
            "Keywords" : keywords,
            "Views" : views,
            "Buildson" : buildson,
            "Edit By" : editBy,
            "Read By" : readBy

        }
    )
    return result

def fileConvert_whatsApp(inputFile):
    topic = ""
    discussionTopic = []
    author = []
    body = []
    created = []
    counter = 0
    type = []
    if checkFileType(inputFile) == "txt":
        try:
            fileReader = open(inputFile,"r", encoding='utf-8')
            for line in fileReader:
                line = line.split("]")
                dateTime = line[0]
                dateTime = dateTime.replace("[","")
                detail = line[1]
                if ":" in detail:
                    detail = detail.split(":")
                else:
                    continue
                if counter == 0:
                    topic = detail[0]
                    counter = counter + 1
                    continue
                else:
                    author.append(detail[0])
                    body.append(detail[1])
                    created.append(dateTime)
                    discussionTopic.append(topic)
                counter = counter + 1


            for i in range (counter-1):
                type.append(5)

            result = pd.DataFrame(
                {
                    "Type": type,
                    "DiscussionTopic" : discussionTopic,
                    "Author" : author,
                    "Body" : body,
                    "Created" : created,
                 }
            )

            print(result)

            fileReader.close()
            return result
        except IOError:
            print("Cannot find the file..")
            return None
        except Exception:
            print("Unknown error occurred..")
            return None

    else:
        raise Exception("Invalid Data Type..")


def fileConvert_OWL(inputFile):
    if checkFileType(inputFile) == "txt":
        try:
            counter = 1
            discussionTopic = []
            type = []
            title = []
            author = []
            created = []
            body = []
            str = ""
            fileReader = open(inputFile,"r", encoding='utf-8')

            for line in fileReader:
                if counter == 1:
                    counter = counter + 1
                    continue
                elif counter == 2:
                    line = line.split("/")
                    discussionTopic.append(line[-2].strip())
                    title.append(line[-1].strip())
                    counter = counter + 1
                    continue
                elif counter == 3:
                    line = line.replace(title[0]," ")
                    line = line.split("-",1)
                    name = line[1].strip()
                    name = name.split("(")
                    author.append(name[0].strip())
                    date = name[1].split(")")
                    created.append(date[1].strip())
                    type.append(4)
                    counter = counter + 1
                    continue
                if "Re: "+title[0] in line:
                    line = line.split("-",1)
                    discussionTopic.append(discussionTopic[0])
                    type.append(4)
                    title.append(title[0])
                    name = line[1].split("(")
                    author.append(name[0].strip())
                    time = name[1].split(")")
                    created.append(time[1].strip())
                    body.append(str)
                    str = ""
                    continue
                str = str+line


            body.append(str)
            result = pd.DataFrame(
                {
                    "Type": type,
                    "DiscussionTopic" : discussionTopic,
                    "Title": title,
                    "Author" : author,
                    "Body" : body,
                    "Created" : created
                 }
            )
            return result
        except IOError:
            print("Cannot find the file..")
            return None
        except Exception:
            print("Unknown error occurred..")
            return None


#print(fileConvert_OWL("owl_sample.txt")["Created"])


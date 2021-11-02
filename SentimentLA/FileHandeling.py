import pandas as pd
import docx
import os

def checkFileType (fileName):
    message = ""
    fileType = ""
    if fileName[-3:] == "txt":
        fileType = "txt"
    elif fileName[-3:] =="doc":
        fileType = "docx"
    elif fileName[-4:] =="docx":
        fileType = "docx"
    elif fileName[-4:] == "xlsx":
        fileType = "xlsx"
    elif fileName[-3:] == "csv":
        fileType = "csv"
    else:
        message = "Possible file types are: .txt, .doc, .docs, .xlsx, and .csv; Please refer to the description section for more explanation."
        fileType = "NOK"
        #raise Exception("Invalid Data Type..")
    return fileType, message

def checkFileContent(fileType, file):
    if fileType == "txt":
        return "nothing"
    elif fileType =="doc":
        return "nothing"
    elif fileType =="docx":
        return "nothing"
    elif fileType == "xlsx":
        message = check_xlsx_csv_file(fileType, file)
    elif fileType == "csv":
        message = check_xlsx_csv_file(fileType, file)

    return message

def check_xlsx_csv_file(fileType, file):
    if fileType == "xlsx":
        df = pd.read_excel(file)
    elif fileType == "csv":
        df=pd.read_csv(file)

    contentType = "kf_detailed"  #content type for xlsx and csv file includes: kf_detailed and kf_simple

    message = []
    if "Authors" not in df:
        message.append("the file does not contain a student list.")
    if "Body" not in df:
        message.append("The file does not have a body list.")
    if "Created" not in df:
        message.append("The file does not have a created date list for students' comments.")
    if "Scaffold(s)" not in df:
        #message.append("The file does not have a scaffolds list.")
        contentType = "kf_simple"
    if "Group" not in df:
        contentType = "kf_simple"
        #message.append("The file does not have a scaffolds list.")

    return message, contentType


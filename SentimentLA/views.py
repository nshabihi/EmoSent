from django.shortcuts import render, redirect
from SentimentLA.forms import UserForm
from SentimentLA.models import SiteUser
from django.contrib import messages
from SentimentLA.ss import script 
from django.urls import reverse_lazy
from django.conf.urls import url
from SentimentLA.forms import DocumentForm
from SentimentLA.forms import UploadFileForm
from django.core.files.storage import FileSystemStorage
#from SentimentLA.FileProcessing import checkFileType
from SentimentLA.FileHandeling import checkFileType
from SentimentLA.FileHandeling import checkFileContent

import csv
from django.http import HttpResponse
import pandas as pd
import os
from django.conf import settings
from SentimentLA.file_to_chart_data import file_to_chart_data_main

def home(request):
#	return render(request, "indexS.html")
	return render(request, "index.html")	

def sentiment_analysis(request):
	#return render(request, "Sentiment_Analysis.html")
	return render(request, "analyze.html", {"error_message" :""})

def header (request):
	return render(request, "header.html")

def footer (request):
	return render(request, "footer.html")

def contact (request):
	return render(request, "contact.html")  

def login(request):
	return render(request, "logIn.html")

def signup(request):
	return render(request, "signup.html")

def upload(request):
	return render(request, 'upload.html')

#new user
def user (request):
	if request.method == "POST":
		form = UserForm (request.POST)
		if form.is_valid():
			try:
				form.save()
				return redirect('/home')
			except:
				pass
	else:
		form = UserForm()
	return render (request, 'index.html' , {'form':form})

#view list of users
def view(request):
	site_user = SiteUser.objects.all()
	return render(request, "view.html", {'site_user': site_user})

#delete an existing user
def delete(request, id):
	site_user = SiteUser.objects.get(uid = id)
	site_user.delete()
	return redirect("/view")

#edit user
def edit(request, id):
	site_user = SiteUser.objects.get(uid=id)
	return render(request, "edit.html", {'site_user': site_user})

#update user
def update(request, id):
	idd = script(id)
	site_user = SiteUser.objects.get(uid=idd)
	form = UserForm(request.POST, instance = site_user)
	if form.is_valid:
		form.save()
		messages.success(request,"Record Updated!")
		return redirect("/view")


######### new
from django.core.files.storage import FileSystemStorage

def upload2 (request):
	context = {}
	if request.method == 'POST':
		uploaded_file = request.FILES['document']
		fs = FileSystemStorage ()
		name = fs.save (uploaded_file.name, uploaded_file)
		url = fs.url(name)
		context['url'] = fs.url(name)

		print(uploaded_file.name)
		print(uploaded_file.size)
		print(url)
		print(context)

	return render (request, 'Sentiment_Analysis.html', context)


def upload_file(request):
	context = {}
	if request.method == 'POST':
		uploaded_file = request.FILES['document']
		print(uploaded_file.name)
		print(uploaded_file.size)
		fs = FileSystemStorage()
		name = fs.save(uploaded_file.name, uploaded_file)
		
		message = "aaaaa"
		message = checkFileType (name)
		if message != 'NOK':
			context['url'] = fs.url(name)
		else:
			context['url'] = 'invalid file format'

#	return render(request, "Sentiment_Analysis.html", context)
	return render(request, "logIn.html", context)	
	
def results1(request):
	return render(request, 'Bubble_Chart.html')





def results1(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'

    writer = csv.writer(response)
    writer.writerow(['First row', 'Foo', 'Bar', 'Baz'])
    writer.writerow(['Second row', 'A', 'B', 'C', '"Testing"', "Here's a quote"])

    return response


def results(request):
    #handle uploaded file
    if request.method == 'POST':
    	uploaded_file = request.FILES['document']
    	fs = FileSystemStorage()
    	name = fs.save(uploaded_file.name, uploaded_file)

    	# check if the uploaded file type has accepted extension
    	message_file_type = checkFileType (name)
    	content_type = ""

    	print("file type: " + message_file_type[0])
    	print("file type message: " + message_file_type[1])
    	print("all message:")
    	print( message_file_type)


    	#show an error message on the analyze.html page
    	if message_file_type[0] == "NOK":
    		return render(request, "analyze.html", {"error_message" :message_file_type[1]})

    	# check if the uploaded file type has required content list
    	else:
    		file = os.path.join(settings.MEDIA_ROOT, name)
    		response_content = checkFileContent(message_file_type[0], file)
    		message_file_content = response_content[0]
    		content_type = response_content[1]
    		if len(message_file_content) > 0:
    			print("message_file_content: ")
    			print(message_file_content)
    			return render(request, "analyze.html", {"error_message" :message_file_content})

    		else:
    			#read from uploaded file
    			succes_message = "The file is OK!"
    			print(succes_message)

		    	#return render(request, "analyze.html", {"error_message" :succes_message})
		    	data = file_to_chart_data_main(file, message_file_type[0], content_type)
		    	data_str_bubble = data[0]
		    	data_str_line = data[1]
		    	data_str_polar = data[2]
		    	data_str_stackedbar = data[3]
		    	data_str_heatmap = data[4]
    	
    else:
    	#read from existing file
    	#file = os.path.join(settings.MEDIA_ROOT, 'KF Sample (detailed).csv')
    	#read from text data
    	data_str_bubble = "Overall Emotion Score,&,Overall Sentiment Score,&,Emotion Score Comparision for Different Groups,&,Sentiment Score Comparision for Different Groups,&,joy,trust,fear,surprise,sadness,disgust,anger,anticipation,s-negative,s-positive,s-neutral,&,G1,1.61,2.94,0.89,1.56,1.06,0.39,0.78,1.83,0.04,0.10,0.86,&,G2,1.10,2.70,0.80,1.30,1.60,0.60,1.00,0.90,0.05,0.4,0.7"
    	data_str_polar = "Activity Based Emotion Score,&,Activity Based Sentiment Score,&,subtitle emotion,&,subtitle sentiment,&,joy,trust,fear,surprise,sadness,disgust,anger,anticipation,s-negative,s-positive,s-neutral,&,1,2,3,4,1,2,1,2,3,4,5,&,2,3,4,1,2,3,1,2,3,4,5,&,3,4,1,2,3,4,1,2,3,4,5,&,2,4,1,2,5,5,1,2,3,4,5,&,4,2,1,5,4,5,1,2,3,4,5"
    	data_str_stackedbar = "Daily Average Emotion Score,&,Daily Average Sentiment Score,&,This chart shows Daily Average Emotion Score. Use the legend to select emotions.,&,This chart shows Daily Average Sentiment Score. Use the legend to select sentiments.,&,2020-05-02,&,2020-05-28,&,joy,trust,fear,surprise,sadness,disgust,anger,anticipation,s-negative,s-positive,s-neutral,&,2020-05-02,0.00,0.00,1.00,0.00,2.00,2.00,2.00,0.00,0.06,0.04,0.90,&,2020-05-03,1.00,4.00,0.00,1.00,3.00,0.00,2.00,0.00,0.05,0.21,0.74,&,2020-05-04,2.50,4.00,1.00,2.50,0.50,0.00,0.00,2.50,0.02,0.08,0.90,&,2020-05-05,3.00,4.50,0.50,1.50,1.00,1.00,1.00,4.50,0.08,0.11,0.81,&,2020-05-07,2.00,3.00,2.00,2.00,2.00,0.00,1.00,3.00,0.08,0.07,0.86,&,2020-05-08,1.00,1.00,1.00,3.00,0.00,0.00,1.00,3.00,0.03,0.02,0.96,&,2020-05-09,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.20,0.80,&,2020-05-10,0.00,1.00,1.00,0.00,1.00,0.00,0.00,0.00,0.14,0.04,0.82,&,2020-05-11,0.00,0.00,1.00,0.00,2.00,2.00,2.00,0.00,0.06,0.04,0.90,&,2020-05-12,1.00,4.00,0.00,1.00,3.00,0.00,2.00,0.00,0.05,0.21,0.74,&,2020-05-13,3.00,3.00,1.00,2.00,0.00,0.00,0.00,3.00,0.01,0.07,0.91,&,2020-05-14,2.00,5.00,1.00,3.00,1.00,0.00,0.00,2.00,0.02,0.10,0.89,&,2020-05-15,0.00,0.00,1.00,0.00,2.00,2.00,2.00,0.00,0.06,0.04,0.90,&,2020-05-16,2.00,5.00,1.00,3.00,1.00,0.00,0.00,2.00,0.02,0.10,0.89,&,2020-05-17,3.00,5.00,3.00,1.00,0.00,1.00,2.00,3.00,0.03,0.07,0.90,&,2020-05-18,1.00,0.00,0.00,1.00,0.00,0.00,0.00,1.00,0.05,0.08,0.87,&,2020-05-24,2.00,5.00,1.00,3.00,1.00,0.00,0.00,2.00,0.02,0.10,0.89,&,2020-05-25,3.00,3.00,1.00,2.00,0.00,0.00,0.00,3.00,0.01,0.07,0.91,&,2020-05-26,1.00,2.50,1.00,1.50,1.50,1.00,1.00,1.00,0.04,0.07,0.89,&,2020-05-27,1.00,2.50,1.00,1.50,1.50,1.00,1.00,1.00,0.04,0.07,0.89,&,2020-05-28,1.50,4.50,0.50,2.00,2.00,0.00,1.00,1.00,0.03,0.15,0.82"
    	data_str_line = "Emotion Change,&,Sentiment Change,&,To check Emotion Change for each student, select a student name from the 'Search Students' list.,&,To check Sentiment Change for each student, select a student name from the 'Search Students' list.,&,2020-05-02,&,2020-05-28,&,joy,trust,fear,surprise,sadness,disgust,anger,anticipation,s-negative,s-positive,s-neutral,&,student-1,/,2020-05-05 00:54:26,6,9,0,3,0,0,0,9,0.09,0.19,0.72,&,student-2,/,2020-05-10 23:50:42,0,1,1,0,1,0,0,0,0.14,0.04,0.82,/,2020-05-02 23:54:52,0,0,1,0,2,2,2,0,0.06,0.04,0.90,/,2020-05-03 23:55:04,1,4,0,1,3,0,2,0,0.05,0.21,0.74,/,2020-05-04 23:56:27,3,3,1,2,0,0,0,3,0.01,0.07,0.91,/,2020-05-26 23:56:44,2,5,1,3,1,0,0,2,0.02,0.10,0.89,/,2020-05-27 23:56:58,0,0,1,0,2,2,2,0,0.06,0.04,0.90,/,2020-05-28 23:57:45,2,5,1,3,1,0,0,2,0.02,0.10,0.89,/,2020-05-17 01:07:03,3,5,3,1,0,1,2,3,0.03,0.07,0.90,/,2020-05-18 03:19:55,1,0,0,1,0,0,0,1,0.05,0.08,0.87,/,2020-05-07 23:43:16,2,3,2,2,2,0,1,3,0.08,0.07,0.86,/,2020-05-08 23:43:33,1,1,1,3,0,0,1,3,0.03,0.02,0.96,/,2020-05-09 23:49:51,0,0,0,0,0,0,0,0,0.00,0.20,0.80,/,2020-05-10 23:50:42,0,1,1,0,1,0,0,0,0.14,0.04,0.82,/,2020-05-11 23:54:52,0,0,1,0,2,2,2,0,0.06,0.04,0.90,/,2020-05-12 23:50:42,1,4,0,1,3,0,2,0,0.05,0.21,0.74,/,2020-05-13 23:54:52,3,3,1,2,0,0,0,3,0.01,0.07,0.91,/,2020-05-14 23:50:42,2,5,1,3,1,0,0,2,0.02,0.10,0.89,/,2020-05-15 23:54:52,0,0,1,0,2,2,2,0,0.06,0.04,0.90,/,2020-05-16 23:50:42,2,5,1,3,1,0,0,2,0.02,0.10,0.89,&,student-3,/,2020-05-03 23:46:19,1,4,0,1,3,0,2,0,0.05,0.21,0.74,/,2020-05-04 23:46:27,2,5,1,3,1,0,0,2,0.02,0.10,0.89,/,2020-05-05 23:46:49,0,0,1,0,2,2,2,0,0.06,0.04,0.90,/,2020-05-28 23:46:19,1,4,0,1,3,0,2,0,0.05,0.21,0.74,/,2020-05-27 23:46:27,2,5,1,3,1,0,0,2,0.02,0.10,0.89,/,2020-05-26 23:46:49,0,0,1,0,2,2,2,0,0.06,0.04,0.90,/,2020-05-25 23:46:49,3,3,1,2,0,0,0,3,0.01,0.07,0.91,/,2020-05-24 23:49:02,2,5,1,3,1,0,0,2,0.02,0.10,0.89"
    	data_str_heatmap = "Daily Primary Emotion,&,Daily Primary Sentiment,&,This figure shows the primary emotion of each student based on time.,&,This figure shows the primary sentiment of each student based on time.,&,2020-05-02,&,2020-05-28,&,joy,trust,fear,surprise,sadness,disgust,anger,anticipation,s-negative,s-positive,s-neutral,&,student-1,/,2020-05-05,1,1.99,0.17,&,student-2,/,2020-05-02,2,4.22,-0.06,/,2020-05-16,2,1.56,0.06,/,2020-05-15,2,4.22,-0.06,/,2020-05-14,2,1.56,0.06,/,2020-05-13,2,0.33,0.11,/,2020-05-12,2,1.44,0.29,/,2020-05-11,2,4.22,-0.06,/,2020-05-10,2,1.11,-0.13,/,2020-05-09,2,0.0,0.2,/,2020-05-07,2,1.33,-0.11,/,2020-05-08,2,3.33,0.02,/,2020-05-17,2,1.56,0.17,/,2020-05-28,2,1.56,0.06,/,2020-05-27,2,4.22,-0.06,/,2020-05-26,2,1.56,0.06,/,2020-05-04,2,0.33,0.11,/,2020-05-03,2,1.44,0.29,/,2020-05-18,2,0.11,-0.19,&,student-3,/,2020-05-25,3,0.33,0.11,/,2020-05-05,3,4.22,-0.06,/,2020-05-04,3,1.56,0.06,/,2020-05-03,3,1.44,0.29,/,2020-05-28,3,1.44,0.29,/,2020-05-27,3,1.56,0.06,/,2020-05-26,3,4.22,-0.06,/,2020-05-24,3,1.56,0.06";
    	#####################################
    	# the following line helps to test the condition where the third chart should not be in the result page (So, there will be only 4 charts).
    	#If you comment the following line everything will back to the normal (5 figures)
    	#data_str_polar = ""


    print("data_str_polar:   "  + data_str_polar)
    return render(request, 'results.html', 
    	{"data_str_bubble" :data_str_bubble,
    	"data_str_line" :data_str_line,
    	"data_str_polar" : data_str_polar,
    	"data_str_stackedbar" : data_str_stackedbar,
    	"data_str_heatmap" : data_str_heatmap})

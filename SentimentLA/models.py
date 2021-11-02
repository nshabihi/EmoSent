from django.db import models
from django.forms import ModelForm, Textarea

#########  SiteUser model ###########
class SiteUser(models.Model):
	uid = models.AutoField (primary_key = True)
	f_name = models.CharField (max_length = 100)
	l_name = models.CharField (max_length = 100)
	email = models.EmailField (max_length = 100)

	class Meta:
		db_table = "SiteUser"

#########  LAToolType model ###########
class LAToolType(models.Model):
	tid = models.AutoField (primary_key = True)
	la_tool_type = models.CharField(max_length = 100)
		
	class Meta:
		db_table = "LAToolType"

#########  Analysis model ###########
class Analysis(models.Model):
	aid = models.AutoField(primary_key = True)
	uid = models.ForeignKey(SiteUser, on_delete=models.CASCADE)
	tool_id = models.ForeignKey(LAToolType, on_delete=models.CASCADE)
	input_text_id = models.IntegerField()
	input_text_type = models.CharField(max_length = 100) ## delete this from this model
	result_id = models.CharField(max_length = 100)

	class Meta:
		db_table = "Analysis"

#########  APIKey model ###########
class APIKey(models.Model):
	api_id = models.AutoField (primary_key = True)
	uid = models.ForeignKey(SiteUser, on_delete=models.CASCADE)
	tid = models.ForeignKey(LAToolType, on_delete=models.CASCADE)
	api_key = models.CharField(max_length = 255)
		
	class Meta:
		db_table = "APIKey"


class Document(models.Model):
	doc_id = models.AutoField(primary_key = True)
	doc_name = models.CharField (max_length = 100)
	doc_file = models.FileField (upload_to = 'texts/')
	doc_type = models.CharField (max_length = 20)
	discussion_topic = models.CharField (max_length = 100)
	note_title = models.CharField (max_length = 100)
	author = models.CharField (max_length = 100)
	created = models.CharField (max_length = 100) ## turn to time type of field?
	scaffolds = models.CharField (max_length = 120)
	keywords = models.CharField (max_length = 100)
	views = models.CharField (max_length = 100)
	buildson = models.CharField (max_length = 100)
	edit_by = models.CharField (max_length = 100)
	read_by = models.CharField (max_length = 100)

	class Meta:
		db_table = "Docs"

	def __str__(self):
		return self.doc_name


class Doc_File(models.Model):
	did = models.AutoField(primary_key = True)
	uid = models.ForeignKey(SiteUser, on_delete=models.CASCADE)
	title = models.CharField(max_length = 100)
	file = models.FileField(upload_to = 'SAFiles/', max_length = 100)
	def __str__(self):
		return self.title
	class Meta:
		db_table = "Doc_File"




from django import forms
from SentimentLA.models import SiteUser
from SentimentLA.models import LAToolType
from SentimentLA.models import Analysis
from SentimentLA.models import APIKey
from SentimentLA.models import Document
from SentimentLA.models import Doc_File

class UserForm(forms.ModelForm):
	class Meta:
		model = SiteUser
		fields = "__all__"

class LAToolTypeForm(forms.ModelForm):
	class Meta:
		model = LAToolType
		fields = "__all__"

class AnalysisForm(forms.ModelForm):
	class Meta:
		model = Analysis
		fields = "__all__"

class APIKeyForm(forms.ModelForm):
	class Meta:
		model = APIKey
		fields = "__all__"

######## new

class UploadFileForm(forms.Form):
    file = forms.FileField()


class DocumentForm(forms.ModelForm):
	class Meta:
		model = Doc_File
		fields = "__all__"
		

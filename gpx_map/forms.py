from django import forms

from .models import DataFile

class FileForm(forms.ModelForm):
    class Meta:
        model = DataFile
        fields = ('name', 'author', 'gpx')

class SaveAndUploadForm(forms.ModelForm):
    class Meta:
        model = DataFile
        fields = ('name', 'author')
        
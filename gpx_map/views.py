import json
import gpx_map.generateFileName as generateFileName
import gpx_map.GPX_parser as GPXparser

from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.http import FileResponse

from gpx_map.forms import FileForm
from gpx_map.models import DataFile
from django.core.files.base import ContentFile

    
def gpx_map(request):

    if request.method == 'POST':

        res = {}
        form = FileForm()

        # Upload new track to the server and save in to the databse

        if 'FileUploader' in request.POST:

            uploadedFile = request.FILES
            uploadedFile['gpx'].name = generateFileName.generateFileName(12)
            
            form = FileForm(request.POST, uploadedFile)

            if form.is_valid():
                form.save()

                return redirect('files')

        # Upload edited track to the server and save it to the database
        
        elif request.is_ajax and request.method == "POST":

            print("GOT AJAX REQUEST")

            # saveAndUpload = SaveAndUploadForm()

            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            uploaded_file = body
            uploadedFile = json.dumps(body)
        
    
            saveAndUpload = DataFile.objects.create(name='test', author='test', gpx=uploaded_file)
            saveAndUpload.save()
            # saveAndUpload = SaveAndUploadForm(name='test', author='test', gpx=uploaded_file)

            # uploadedFile = request.file_to_stream
            # uploadedFile['gpx'].name = generateFileName.generateFileName(12)

            # body_unicode = request.body.decode('utf-8')
            # body = json.loads(body_unicode)
            # uploaded_file = body

            # gpx_parsed = GPXparser.parseJSON(uploaded_file)


            # data = DataFile(name = 'temp_record', author = 'N/A')
            # data.gpx.save("tempgpx", ContentFile(gpx_parsed))
            # data.save()

            # Set value of file to input tag (hidden) and send it maybe ???

            # uploadedFile = saveAndUpload(request.POST, uploadedFile)

            # request = FileResponse(open("../../output.gpx"))
            
            return request 

    else:

        res = {}
        form = FileForm()

    return render(request, 'gpx_map.html', {"my_data" : res, 'form': form })


# Render files list page

def files(request):
    files = DataFile.objects.all().order_by('-id')
    return render(request, 'files.html', {'files': files})

# Render view specific track page

def trackView(request, fileid):

    fileObj = DataFile.objects.get(pk=fileid)
    filePath = 'media/' + str(fileObj.gpx)
    fileInstance = open(filePath)
    trackName = fileObj.name
    data = fileInstance.read()

    return render (request, 'trackViewer.html', {'data': data, 'trackName': trackName})




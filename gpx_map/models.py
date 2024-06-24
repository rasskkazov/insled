from django.db import models

class DataFile(models.Model):
    
    name = models.CharField(max_length = 100)
    author = models.CharField(max_length = 100)
    gpx = models.FileField(upload_to='data/gpx/')
    linkToExtDB = models.CharField(max_length = 255, null = True, blank = True)

    def __str__(self):
        return self.name

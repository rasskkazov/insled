# Generated by Django 3.1.6 on 2021-04-06 08:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gpx_map', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datafile',
            name='linkToExtDB',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]

# Generated by Django 3.1.1 on 2020-09-16 07:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('lunch', '0002_auto_20200910_1247'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proposal',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proposal', to='lunch.restaurant'),
        ),
        migrations.AlterField(
            model_name='voting',
            name='date',
            field=models.DateField(auto_now_add=True, unique=True),
        ),
    ]
